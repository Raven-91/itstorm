import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {environment} from "../../../environments/environment";
import {ArticleType} from "../../../types/article.type";
import {ArticlesType} from "../../../types/articles.type";
import {ActiveParamsType} from "../../../types/active-params.type";

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  constructor(private http: HttpClient) { }

  getTopArticles(): Observable<ArticleType[] | DefaultResponseType> {
    return this.http.get<ArticleType[] | DefaultResponseType>(environment.api + 'articles/top')
  };

  getArticles(params?: ActiveParamsType): Observable<ArticlesType | DefaultResponseType> {
    return this.http.get<ArticlesType | DefaultResponseType>(environment.api + 'articles', {
      params: params
    })
  };

  getArticle(url: string): Observable<ArticleType | DefaultResponseType> {
    return this.http.get<ArticleType | DefaultResponseType>(environment.api + 'articles/' + url)
  };

  getRelatedArticles(url: string): Observable<ArticleType[] | DefaultResponseType> {
    return this.http.get<ArticleType[] | DefaultResponseType>(environment.api + 'articles/related/' + url)
  };
}
