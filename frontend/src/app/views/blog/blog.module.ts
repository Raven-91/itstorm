import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {BlogRoutingModule} from './blog-routing.module';
import {CatalogComponent} from './catalog/catalog.component';
import {SharedModule} from "../../shared/shared.module";
import {ArticlePageComponent} from './article-page/article-page.component';
import {MatIconModule} from "@angular/material/icon";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    CatalogComponent,
    ArticlePageComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatIconModule,
    ReactiveFormsModule,
    BlogRoutingModule,
  ]
})
export class BlogModule {
}
