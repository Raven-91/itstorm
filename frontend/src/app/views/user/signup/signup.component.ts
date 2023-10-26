import {Component} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../core/auth/auth.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {LoginResponseType} from "../../../../types/login-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {NavigationService} from "../../../shared/services/navigation.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private navigationService: NavigationService
  ) {
  }

  signupForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/^([А-ЯЁ][а-яё]+)?( [А-ЯЁ][а-яё]+){0,3}$/)]],
    email: ['', [Validators.email, Validators.required, Validators.pattern(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)]],
    agree: [false]
  })


  signup(): void {
    if (this.signupForm.valid
      && this.signupForm.value.name
      && this.signupForm.value.email
      && this.signupForm.value.password) {

      this.authService.signup(this.signupForm.value.name, this.signupForm.value.email,
        this.signupForm.value.password).subscribe({

        next: (data: DefaultResponseType | LoginResponseType): void => {
          let error = null;
          if ((data as DefaultResponseType).error !== undefined) {
            error = (data as DefaultResponseType).message;
          }

          const loginResponse: LoginResponseType = data as LoginResponseType;
          if (!loginResponse.accessToken || !loginResponse.refreshToken || !loginResponse.userId) {
            error = 'Ошибка регистрации';
          }

          if (error) {
            this._snackBar.open(error);
            throw new Error(error);
          }

          this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
          this.authService.userId = loginResponse.userId;

          this._snackBar.open('Регистрация прошла успешно');
          this.router.navigate(['/']);
        },

        error: (errorResponse: HttpErrorResponse): void  => {
          if (errorResponse.error && errorResponse.error.message) {
            this._snackBar.open(errorResponse.error.message);
          } else {
            this._snackBar.open('Ошибка регистрации');
          }
        }

      })
    }
  }
}
