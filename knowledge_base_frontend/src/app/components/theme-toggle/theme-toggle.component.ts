import { Component } from '@angular/core';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  styleUrl: './theme-toggle.component.css',
  template: `
  <button
    (click)="toggle()"
    class="theme-btn"
    title="Toggle light/dark theme"
    aria-label="Toggle Light or Dark Theme"
    tabindex="0"
    type="button"
    >
    <span aria-hidden="true">{{ theme === 'light' ? '🌞' : '🌙' }}</span>
  </button>
  `
})
export class ThemeToggleComponent {
  theme: 'light' | 'dark' = 'light';
  toggle() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    // SSR/Node/browser lint-safe: use globalThis reference
    if (
      typeof globalThis !== 'undefined' &&
      globalThis.document &&
      globalThis.document.body &&
      globalThis.document.body.dataset
    ) {
      globalThis.document.body.dataset['theme'] = this.theme;
    }
    // else: Not in a browser, do nothing (prevents lint errors about "document" being undefined)
  }
}
