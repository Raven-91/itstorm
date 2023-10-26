import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {LoginResponseType} from "../../../../types/login-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {NavigationService} from "../../../shared/services/navigation.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private cookieService: CookieService,
    private navigationService: NavigationService) {
  }

  cookieEmailValue: string = '';
  cookiePasswordValue: string = '';

  ngOnInit() {
    this.cookieEmailValue = this.cookieService.get('email');
    this.cookiePasswordValue = this.cookieService.get('password');

    if (this.cookieEmailValue !== '' && this.cookiePasswordValue !== '') {
      this.loginForm.get('email')?.setValue(this.cookieEmailValue);
      this.loginForm.get('password')?.setValue(this.cookiePasswordValue);
    }
  }

  loginForm = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required]],
    rememberMe: [false]
  })

  login(): void {
    if (this.loginForm.valid && this.loginForm.value.email && this.loginForm.value.password) {

      // Записываем данные пользователя в файлы куки для функционала "Запомнить меня"
      if (this.loginForm.value.rememberMe === true) {
        this.cookieService.set('email', this.loginForm.value.email);
        this.cookieService.set('password', this.loginForm.value.password);
      }

      this.authService.login(this.loginForm.value.email, this.loginForm.value.password, !!this.loginForm.value.rememberMe).subscribe({

        next: (data: DefaultResponseType | LoginResponseType): void => {
          let error = null;
          if ((data as DefaultResponseType).error !== undefined) {
            error = (data as DefaultResponseType).message;
          }

          const loginResponse = data as LoginResponseType;
          if (!loginResponse.accessToken || !loginResponse.refreshToken || !loginResponse.userId) {
            error = 'Ошибка авторизации';
          }

          if (error) {
            this._snackBar.open(error);
            throw new Error(error);
          }

          this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
          this.authService.userId = loginResponse.userId;

          this._snackBar.open('Авторизация прошла успешно');
          // this.router.navigate(['/']);
          const returnUrl = this.navigationService.getReturnUrl();
          if (returnUrl) {
            this.router.navigateByUrl(returnUrl);
            this.navigationService.clearReturnUrl(); // Очистка сохраненного URL
          } else {
            this.router.navigate(['/']); // Если нет сохраненного URL, перенаправляет на главную
          }
        },
        error: (errorResponse: HttpErrorResponse): void => {
          if (errorResponse.error && errorResponse.error.message) {
            this._snackBar.open(errorResponse.error.message);
          } else {
            this._snackBar.open('Ошибка авторизации');
          }
        }
      })
    }
  };

  // Раскрытие и скрытие пароля
  showPassword: boolean = false;

}
