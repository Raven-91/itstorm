import { CanActivateFn } from '@angular/router';
import {AuthService} from "../auth/auth.service";
import {inject} from "@angular/core";
import {MatSnackBar} from "@angular/material/snack-bar";

export const authGuard: CanActivateFn = (route, state) => {
  const isLoggedIn = inject(AuthService).getIsLoggedIn()
  if (!isLoggedIn) {
    inject(MatSnackBar).open('Для доступа необходимо авторизоваться')
  }
  return isLoggedIn;
};
