import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {environment} from "../../../environments/environment";
import {CommentResponseType} from "../../../types/comment-response.type";
import {CommentActionsType} from "../../../types/comment-actions.type";

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(private http: HttpClient) {
  }

  getComments(amountComments: number, id: string): Observable<CommentResponseType | DefaultResponseType> {

    let queryParams: HttpParams = new HttpParams();
    queryParams = queryParams.append("offset", amountComments);
    queryParams = queryParams.append("article", id);

    return this.http.get<CommentResponseType | DefaultResponseType>(environment.api + 'comments', {
      params: queryParams
    })
  };

  addComment(comments: string, articleId: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments', {text: comments, article: articleId})
  };

  sendCommentAction(id: string, action: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments/' + id + '/apply-action', { action: action })
  };

  getReactionsUser(articleId: string): Observable<CommentActionsType[] | DefaultResponseType> {

    let queryParams: HttpParams = new HttpParams();
    queryParams = queryParams.append("articleId", articleId);

    return this.http.get<CommentActionsType[] | DefaultResponseType>(environment.api + 'comments/article-comment-actions', {
      params: queryParams
    })
  };

  // Вопрос. Нужен ли данный запрос??????
  getReactionUser(commentId: string): Observable<CommentActionsType | DefaultResponseType> {
    return this.http.get<CommentActionsType | DefaultResponseType>(environment.api + 'comments/' + commentId + '/actions');
  };
}
