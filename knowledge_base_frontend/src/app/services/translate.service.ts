import { Injectable } from '@angular/core';
import { TranslateService as NgxTranslateService } from '@ngx-translate/core';

// PUBLIC_INTERFACE
@Injectable({ providedIn: 'root' })
export class TranslateService {
  private readonly key = 'kb_lang';
  private translate: NgxTranslateService;

  constructor(translate: NgxTranslateService) {
    this.translate = translate;
    let lang = this.getLanguage();
    if (!lang) {
      lang = 'en';
      this.setLanguage(lang);
    }
    this.translate.setDefaultLang('en');
    this.translate.use(lang);
  }

  // PUBLIC_INTERFACE
  getLanguage(): string {
    if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
      return globalThis.localStorage.getItem(this.key) || 'en';
    }
    return 'en';
  }

  // PUBLIC_INTERFACE
  setLanguage(lang: string) {
    if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
      globalThis.localStorage.setItem(this.key, lang);
    }
    this.translate.use(lang);
  }
}
