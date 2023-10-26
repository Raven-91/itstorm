import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LayoutComponent} from "./shared/layout/layout.component";
import {MainComponent} from "./views/main/main.component";
import {authForwardGuard} from "./core/guard/auth-forward.guard";

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '', component: MainComponent
      },
      {
        path: '',
        loadChildren: () => import('./views/user/user.module').then((m) => m.UserModule),
        canActivate: [authForwardGuard]
      },
      {
        path: '', loadChildren: () => import('./views/blog/blog.module').then((m) => m.BlogModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    anchorScrolling: "enabled",
    scrollPositionRestoration: "enabled",
    // scrollOffset: [0, 132]
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
