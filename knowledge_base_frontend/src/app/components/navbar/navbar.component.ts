import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { TranslateService as NgxTranslateService, TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '../../services/translate.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, TranslateModule],
  styleUrl: './navbar.component.css',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  isLoggedIn = false;
  isAdmin = false;
  selLang: string = 'en';

  private userSub?: Subscription;
  private _authService: AuthService;
  private _router: Router;
  private _translate: TranslateService;
  private _ngxTranslate: NgxTranslateService;

  constructor(
    authService: AuthService,
    router: Router,
    translate: TranslateService,
    ngxTranslate: NgxTranslateService
  ) {
    this.userSub = authService.user$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.isAdmin = !!user?.isAdmin;
    });
    this._authService = authService;
    this._router = router;
    this._translate = translate;
    this._ngxTranslate = ngxTranslate;

    this.selLang = this._translate.getLanguage();
    // Listen to language changes
    this._ngxTranslate.onLangChange.subscribe(({lang}) => {
      this.selLang = lang;
    });
  }

  changeLang(lang: string) {
    this._translate.setLanguage(lang);
  }

  logout() {
    this._authService.logout();
    this._router.navigateByUrl('/');
  }

  ngOnDestroy() {
    this.userSub?.unsubscribe();
  }
}
