import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CatalogComponent} from "./catalog/catalog.component";
import {ArticlePageComponent} from "./article-page/article-page.component";

const routes: Routes = [
  {
    path: 'catalog', component: CatalogComponent
  },
  {
    path: 'article/:url', component: ArticlePageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogRoutingModule { }
