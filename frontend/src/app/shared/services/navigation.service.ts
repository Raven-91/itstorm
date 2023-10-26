import {Injectable} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  private history: string[] = [];
  private returnUrl: string | null = null;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.history.push(event.urlAfterRedirects);
      }
    });
  }

  setReturnUrl(url: string): void {
    this.returnUrl = url;
  }

  getReturnUrl(): string | null {
    return this.returnUrl;
  }

  clearReturnUrl(): void {
    this.returnUrl = null;
  }

  getHistory(): string[] {
    return this.history;
  }
}
