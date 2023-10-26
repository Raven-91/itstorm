import {Component, OnInit} from '@angular/core';
import {ArticlesService} from "../../../shared/services/articles.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute, Router} from "@angular/router";
import {ArticleType} from "../../../../types/article.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {environment} from "../../../../environments/environment";
import {CommentsService} from "../../../shared/services/comments.service";
import {CommentType} from "../../../../types/comment.type";
import {CommentResponseType} from "../../../../types/comment-response.type";
import {AuthService} from "../../../core/auth/auth.service";
import {FormBuilder, Validators} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";
import {CommentsActionsType} from "../../../../types/comments-actions.type";
import {CommentActionsType} from "../../../../types/comment-actions.type";

@Component({
  selector: 'app-article-page',
  templateUrl: './article-page.component.html',
  styleUrls: ['./article-page.component.scss']
})
export class ArticlePageComponent implements OnInit {

  serverStaticPath = environment.serverStaticPath;
  url: string = '';

  // статья
  article: ArticleType;
  relatedArticle: ArticleType[] = [];

  // Комментарии
  comments: CommentType[] = [];

  // Кол-во комментариев к статье больше 3 или нет
  isTrueAmountComments: boolean = false;

  // isLogged
  isLogged: boolean = false;

  constructor(private articleService: ArticlesService,
              private _snackBar: MatSnackBar,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private commentsService: CommentsService,
              private authService: AuthService,
              private fb: FormBuilder,) {
    this.isLogged = this.authService.getIsLoggedIn();

    this.article = {
      id: '',
      title: '',
      description: '',
      image: '',
      date: '',
      category: '',
      url: '',
      comments: [],
      commentsCount: 0,
      text: ''
    }
  };

  ngOnInit(): void {
    // Берем url-параметры
    this.activatedRoute.params.subscribe(params => {
      this.url = params['url'];
      if (this.url) {
        // Запрос на получение данных по статье
        this.articleService.getArticle(this.url).subscribe((data: ArticleType | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            this._snackBar.open('Ошибка при получении данных');
            throw new Error((data as DefaultResponseType).message);
          }
          this.article = data as ArticleType;

          // запрос на похожие статьи
          this.articleService.getRelatedArticles(this.url).subscribe((data: ArticleType[] | DefaultResponseType) => {
            if ((data as DefaultResponseType).error !== undefined) {
              this._snackBar.open('Ошибка при получении данных');
              throw new Error((data as DefaultResponseType).message);
            }
            this.relatedArticle = data as ArticleType[];
          });

          // запрос на комментарии к статье
          this.getComments(this.article.id);

          if (this.isLogged) {
            // запрос на все действия пользователя по комментариям к статье
            this.commentsService.getReactionsUser(this.article.id).subscribe((commentsActions: CommentActionsType[] | DefaultResponseType) => {
              if ((commentsActions as DefaultResponseType).error !== undefined) {
                this._snackBar.open('Ошибка при получении данных');
                throw new Error((data as DefaultResponseType).message);
              }
              const userCommentsActions = commentsActions as CommentActionsType[];

              // определяем комментарии, которые были ранее отмечены пользователем по категориям "Нравится" и "Не нравится"
              this.comments.forEach((comment) => {
                userCommentsActions.find(item => {
                  if (comment.id === item.comment) {
                    if (item.action === CommentsActionsType.like) {
                      comment.selectedLike = true;
                    } else if (item.action === CommentsActionsType.dislike) {
                      comment.selectedDislike = true;
                    }
                  }
                });
              });
            });
          }

        });
      } else {
        this.router.navigate(['/']);
      }
    });
  };

  // Добавить комментарии
  addComments(): void {
    const amount: number = this.comments.length;
    // запрос на дополнительные комментарии к статье.
    this.commentsService.getComments(amount, this.article.id).subscribe((data: CommentResponseType | DefaultResponseType) => {
      if ((data as DefaultResponseType).error !== undefined) {
        this._snackBar.open('Ошибка при получении данных');
        throw new Error((data as DefaultResponseType).message);
      }
      const dataComments = data as CommentResponseType;

      dataComments.comments.forEach((comment => {
        this.comments.push(comment);
      }));

      // Определяем остались ли ещё комментарии
      this.isTrueAmountComments = this.comments.length < dataComments.allCount;

      // Получаем день и время
      if (this.comments && this.comments.length > 0) {
        this.comments.forEach(item => {
          const date: string = new Date(item.date).toLocaleString("ru-RU").slice(0, -3);
          item.day = date.split(', ')[0];
          item.time = date.split(', ')[1];
        })
      }
    });
  };


  // Функционал по форме для отправки комментария
  commentsForm = this.fb.group({
    comments: ['', Validators.required]
  });

  // Отправляем комментарий
  sendComment(): void {
    if (this.commentsForm.valid && this.commentsForm.value.comments && this.article.id) {
      this.commentsService.addComment(this.commentsForm.value.comments, this.article.id).subscribe({
        next: (request: DefaultResponseType) => {
          if ((request as DefaultResponseType).error) {
            this._snackBar.open((request as DefaultResponseType).message);
            throw new Error((request as DefaultResponseType).message);
          }
          if (!(request as DefaultResponseType).error) {

            // запрос на комментарии к статье
            this.getComments(this.article.id);

            this._snackBar.open((request as DefaultResponseType).message);
          }
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.message) {
            this._snackBar.open(errorResponse.error.message);
          }
        }
      });

    }
  };


  // Запрос на комментарии к статье
  private getComments(articleId: string): void {
    this.commentsService.getComments(0, articleId).subscribe((data: CommentResponseType | DefaultResponseType) => {
      if ((data as DefaultResponseType).error !== undefined) {
        this._snackBar.open('Ошибка при получении данных');
        throw new Error((data as DefaultResponseType).message);
      }
      const dataComments = data as CommentResponseType;
      this.comments = [];

      // Определяем сколько есть комментариев
      if (dataComments.allCount > 3) {
        dataComments.comments.slice(0, 3).forEach(comment => {
          this.comments.push(comment);
        })
        this.isTrueAmountComments = true;
      } else if (dataComments.allCount <= 3) {
        this.comments = dataComments.comments;
        this.isTrueAmountComments = false;
      }

      // Получаем день и время
      if (this.comments && this.comments.length > 0) {
        this.comments.forEach(item => {
          const date: string = new Date(item.date).toLocaleString("ru-RU").slice(0, -3);
          item.day = date.split(', ')[0];
          item.time = date.split(', ')[1];
        })
      }
    });
  };

  // Функционал по работе с реакцией на комментарии
  action: string = '';

  // Обработка события-клик на иконку "Нравится"
  like(commentId: string): void {
    this.action = CommentsActionsType.like;
    if (commentId) {
      this.commentAction(commentId, this.action);
    }
  };

  // Обработка события-клик на иконку "Не нравится"
  dislike(commentId: string): void {
    this.action = CommentsActionsType.dislike;
    if (commentId) {
      this.commentAction(commentId, this.action);
    }
  };

  // Обработка события-клик на иконку "Пожаловаться"
  complain(commentId: string): void {
    this.action = CommentsActionsType.violate;
    if (commentId) {
      this.commentAction(commentId, this.action);
    }
  };

  // Отправка реакции на комментарий
  private commentAction(id: string, action: string): void {
    this.commentsService.sendCommentAction(id, action).subscribe({
      next: (request: CommentsActionsType | DefaultResponseType) => {
        if ((request as DefaultResponseType).error) {
          this._snackBar.open((request as DefaultResponseType).message);
          throw new Error((request as DefaultResponseType).message);
        }

        if ((action === CommentsActionsType.like || action === CommentsActionsType.dislike) && !(request as DefaultResponseType).error) {
          this._snackBar.open('Ваш голос учтен');

          if (action === CommentsActionsType.like) {
            this.comments.find((comment) => {
              if (id === comment.id) {
                comment.selectedLike = !comment.selectedLike;
                if (comment.selectedLike) {
                  comment.likesCount++;
                } else {
                  comment.likesCount--;
                }
                if (comment.selectedLike && comment.selectedDislike) {
                  comment.selectedDislike = !comment.selectedDislike;
                  comment.dislikesCount--;
                }
              }
            })
          }

          if (action === CommentsActionsType.dislike) {
            this.comments.find((comment) => {
              if (id === comment.id) {
                comment.selectedDislike = !comment.selectedDislike;
                if (comment.selectedDislike) {
                  comment.dislikesCount++;
                } else {
                  comment.dislikesCount--;
                }
                if (comment.selectedDislike && comment.selectedLike) {
                  comment.selectedLike = !comment.selectedLike;
                  comment.likesCount--;
                }
              }
            })
          }
        }

        if (action === CommentsActionsType.violate && !(request as DefaultResponseType).error) {
          this._snackBar.open('Жалоба отправлена');
        }
      },
      error: (errorResponse: HttpErrorResponse) => {
        if (errorResponse.error && errorResponse.error.message) {
          this._snackBar.open('Жалоба уже отправлена');
          console.log(errorResponse.error.message);
        }
      },
    });
  };

  // Делиться статьей в социальных сетях (FB, VK). Instagram - просто ссылка, функционал не работает
  shareArticle(social: string): boolean {

    if (social === 'facebook') {
      window.open(
        'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(document.URL) + '&t=' + encodeURIComponent(document.URL));
      return true;
    }

    if (social === 'vk') {
      window.open(
        'https://vk.com/share.php?url=' + encodeURIComponent(document.URL));
      return true;
    }

    if (social === 'instagram') {
      window.open('https://www.instagram.com/');
      return true;
    }

    return false;
  }


  // Не понял для чего этот запрос нужен.
  // private getReaction(commentId: string): void {
  //   this.commentsService.getReactionUser(commentId).subscribe({
  //     next: (request: CommentActionsType | DefaultResponseType) => {
  //       if ((request as DefaultResponseType).error) {
  //         this._snackBar.open((request as DefaultResponseType).message);
  //         throw new Error((request as DefaultResponseType).message);
  //       }
  //
  //       const comment = request as CommentActionsType;
  //
  //     },
  //     error: (errorResponse: HttpErrorResponse) => {
  //       if (errorResponse.error && errorResponse.error.message) {
  //         this._snackBar.open(errorResponse.error.message);
  //         throw new Error(errorResponse.error.message);
  //       }
  //     },
  //   });
  // };
}
