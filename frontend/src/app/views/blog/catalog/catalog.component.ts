import {Component, OnInit} from '@angular/core';
import {ArticlesService} from "../../../shared/services/articles.service";
import {ArticlesType} from "../../../../types/articles.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ArticleType} from "../../../../types/article.type";
import {CategoryService} from "../../../shared/services/category.service";
import {CategoryType} from "../../../../types/category.type";
import {ActivatedRoute, Router} from "@angular/router";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {AppliedFilterType} from "../../../../types/applied-filter.type";

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {

  // Каталог статей
  catalog: ArticlesType = {
    count: 0,
    pages: 0,
    items: [],
  };
  articles: ArticleType[] = [];
  pages: number[] = [];

  // Категории
  categories: CategoryType[] = [];

  // Применяемые фильтры
  appliedFilters: AppliedFilterType[] = [];

  activeParams: ActiveParamsType = {categories: []};

  constructor(private articleService: ArticlesService,
              private _snackBar: MatSnackBar,
              private categoryService: CategoryService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {

    // запрос на получение категорий
    this.categoryService.getCategories().subscribe((data: CategoryType[] | DefaultResponseType) => {
      if ((data as DefaultResponseType).error !== undefined) {
        this._snackBar.open('Ошибка при получении данных');
        throw new Error((data as DefaultResponseType).message);
      }
      this.categories = data as CategoryType[];

      // Проверяем, есть ли выбранные пункты из фильтра через url
      this.activatedRoute.queryParams.subscribe((params) => {

        // Добавляю свойство selected к каждой категории, которое будет по умолчанию false
        this.categories.forEach((category) => category.selected = false);

        // получаем url - параметры
        let urlParams: string[] = Array.isArray(params['categories']) ? params['categories'] : [params['categories']];
        let urlParamsPage: number = +params['page'];

        // Определяем страницу
        if (urlParamsPage) {
          this.activeParams.page = urlParamsPage;
        } else {
          this.activeParams.page = 1;
        }

        // Присвоим true, если категория соответствует url-параметрам
        if (urlParams && urlParams.length > 0) {
          urlParams.forEach((param: string) => {
            this.categories.find(item => {
              if (item.url === param) {
                item.selected = true;

                // Добавим категории со значением true в this.activeParams.categories
                if (this.activeParams.categories && this.activeParams.categories.length > 0) {
                  const existingCategoryInParams = this.activeParams.categories.find(activeParamsCategory => activeParamsCategory === item.url);
                  if (!existingCategoryInParams) {
                    this.activeParams.categories.push(item.url);
                  }
                } else {
                  this.activeParams.categories = [item.url];
                }

              }
            });
          });
        }

        // Определяем какие категории сортировки активны
        this.appliedFilters = [];
        this.categories.forEach(item => {
          if (item.selected) {
            this.appliedFilters.push({
              name: item.name,
              urlParam: item.url,
            })
          }
        });

        // Делаем запрос на статьи по выбранной категории
        this.articleService.getArticles(this.activeParams).subscribe((data: ArticlesType | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            this._snackBar.open('Ошибка при получении данных');
            throw new Error((data as DefaultResponseType).message);
          }
          this.catalog = (data as ArticlesType);
          this.articles = (data as ArticlesType).items;
          this.pages = [];
          for (let i = 1; i <= this.catalog.pages; i++) {
            this.pages.push(i);
          }
        });
      });
    });
  }

  sort(obj: { url: string, selected: boolean }): void {
    let url = obj.url;
    let selected = obj.selected;

    if (this.activeParams.categories && this.activeParams.categories.length > 0) {
      const existingCategoryInParams = this.activeParams.categories.find(item => item === url);
      if (existingCategoryInParams && !selected) {
        this.activeParams.categories = this.activeParams.categories.filter(item => item !== url);
      } else if (!existingCategoryInParams && selected) {
        this.activeParams.categories.push(url);
      }
    } else if (selected) {
      this.activeParams.categories = [url];
    }

    this.activeParams.page = 1;
    this.router.navigate(['/catalog'], {
      queryParams: this.activeParams
    });
  }

  // Убираем один из примененных фильтров
  removeAppliedFilter(urlParam: string): void {
    this.activeParams.categories = this.activeParams.categories.filter(item => item !== urlParam);
    this.activeParams.page = 1;
    this.router.navigate(['/catalog'], {
      queryParams: this.activeParams
    });
  }

  // Переход по каталогу по страницам
  openPage(page: number): void {
    this.activeParams.page = page;
    this.router.navigate(['/catalog'], {
      queryParams: this.activeParams
    });
  }

  // Переход на предыдущую страницу
  openPrevPage(): void {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--;
      this.router.navigate(['/catalog'], {
        queryParams: this.activeParams
      });
    }
  }

  // Переход на следующую страницу
  openNextPage(): void {
    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page++;
    }
    this.router.navigate(['/catalog'], {
      queryParams: this.activeParams
    });
  }
}
