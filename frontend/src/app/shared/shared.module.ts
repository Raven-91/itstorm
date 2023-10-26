import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {NgxMaskDirective} from "ngx-mask";
import {PopupComponent} from "./common/popup/popup.component";
import {LoaderComponent} from './common/loader/loader.component';
import {ArticleComponent} from './common/article/article.component';
import {ShortenTextPipe} from './pipes/shorten-text.pipe';
import { FilterComponent } from './common/filter/filter.component';
import {MatIconModule} from "@angular/material/icon";

@NgModule({
  declarations: [
    PopupComponent,
    LoaderComponent,
    ArticleComponent,
    ShortenTextPipe,
    FilterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatInputModule,
    NgxMaskDirective,
    MatIconModule
  ],
  exports: [
    PopupComponent,
    LoaderComponent,
    ArticleComponent,
    ShortenTextPipe,
    FilterComponent,
  ]
})
export class SharedModule {
}
