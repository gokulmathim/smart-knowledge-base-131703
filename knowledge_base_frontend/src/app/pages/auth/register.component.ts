import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <h2>Register</h2>
    <form (ngSubmit)="register()">
      <input type="text" [(ngModel)]="email" name="email" placeholder="Email" required /><br/>
      <input type="password" [(ngModel)]="password" name="password" placeholder="Password" required /><br/>
      <input type="password" [(ngModel)]="confirm" name="confirm" placeholder="Confirm Password" required /><br/>
      <div *ngIf="error" style="color:red">{{error}}</div>
      <button type="submit">Register</button>
    </form>
  `
})
export class RegisterComponent {
  email = '';
  password = '';
  confirm = '';
  error: string | null = null;
  constructor(authService: AuthService) {
    this._authService = authService;
  }
  private _authService: AuthService;
  register() {
    this.error = null;
    if (this.password !== this.confirm) { this.error = 'Passwords do not match'; return; }
    this._authService.register(this.email, this.password).subscribe({
      next: () => {
        if (typeof globalThis !== 'undefined' && globalThis.location) {
          globalThis.location.pathname = '/';
        }
      },
      error: err => this.error = err?.error?.message || 'Registration failed'
    });
  }
}
