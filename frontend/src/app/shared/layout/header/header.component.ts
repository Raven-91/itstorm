import {Component, HostListener, inject, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpErrorResponse} from "@angular/common/http";
import {UserService} from "../../services/user.service";
import {UserInfoType} from "../../../../types/user-info.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {NavigationService} from "../../services/navigation.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  navigationService = inject(NavigationService);

  constructor(
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private userService: UserService,
  ) {
    this.isLogged = this.authService.getIsLoggedIn();
  }

  // Burger-menu
  active: boolean = false;

  onClickBurger(): void {
    this.active = !this.active;
  };

  onClickMenuItem(): void {
    if (this.active) {
      this.active = !this.active;
    }
  }

  // Navbar
  lastScroll: number = 0;
  // defaultOffset: number = 200;
  hide: boolean = false;

  @HostListener('document:scroll') scrollFunction(): void {
    if ((window.scrollY || document.documentElement.scrollTop) > this.lastScroll) {
      // && (window.scrollY || document.documentElement.scrollTop) > this.defaultOffset) {
      this.hide = true;
    } else if ((window.scrollY || document.documentElement.scrollTop) < this.lastScroll && this.hide) {
      this.hide = false;
    }

    this.lastScroll = (window.scrollY || document.documentElement.scrollTop);
  }

  // isLogged
  isLogged: boolean = false;

  // Имя пользователя
  userName: string = '';


  ngOnInit(): void {
    // Проверка: залогинен ли пользователь
    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {

      if (isLoggedIn) {
        // Запрос на получение данных о пользователе
        this.userService.getUserInfo().subscribe({
          next: (data: UserInfoType | DefaultResponseType) => {
            if ((data as DefaultResponseType).error !== undefined) {
              throw new Error((data as DefaultResponseType).message);
            }
            this.isLogged = isLoggedIn;
            const userData = data as UserInfoType;

            this.userName = userData.name;
            localStorage.setItem("name", userData.name);
            localStorage.setItem("email", userData.email);
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this.authService.removeTokens();

              localStorage.removeItem("name");
              localStorage.removeItem("email");
            }
          }
        });
      } else {
        this.isLogged = isLoggedIn;
      }

    });

   if (this.isLogged) {
     this.userName = localStorage.getItem("name") as string;
   }
  }

  logout(): void {
    this.navigationService.setReturnUrl(this.router.url);
    this.authService.logout().subscribe({
      next: (): void => {
        this.doLogout();
      },
      error: (errorResponse: HttpErrorResponse): void => {
        this.doLogout();
      }
    })
  }

  private doLogout(): void {
    this.authService.removeTokens();
    this.authService.userId = null;

    localStorage.removeItem("name");
    localStorage.removeItem("email");
    this._snackBar.open('Вы вышли из системы');
    // this.router.navigate(['/']);
  }
}
