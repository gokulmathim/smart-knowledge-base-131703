import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <h2>Login</h2>
    <form (ngSubmit)="login()">
      <input type="text" [(ngModel)]="email" name="email" placeholder="Email" required /><br/>
      <input type="password" [(ngModel)]="password" name="password" placeholder="Password" required /><br/>
      <div *ngIf="error" style="color:red">{{error}}</div>
      <button type="submit">Login</button>
    </form>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  error: string | null = null;

  constructor() {}
  login() {
    this.error = null;
    AuthService.prototype.login(this.email, this.password).subscribe({
      next: () => {
        if (typeof globalThis !== 'undefined' && globalThis.location) {
          globalThis.location.pathname = '/';
        }
      },
      error: err => this.error = err?.error?.message || 'Login failed'
    });
  }
}
