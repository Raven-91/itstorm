import { CanActivateFn } from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../auth/auth.service";
import {Location} from "@angular/common";

export const authForwardGuard: CanActivateFn =
  (route, state) => {
    if (inject(AuthService).getIsLoggedIn()) {
      inject(Location).back();
      return false;
    }
    return true;
  };
