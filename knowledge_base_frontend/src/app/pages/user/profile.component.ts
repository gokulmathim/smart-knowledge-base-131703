import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>User Profile</h2>
    <div *ngIf="user">
      <p><strong>Email:</strong> {{user?.email}}</p>
      <div>
        <label>New Password: <input type="password" [(ngModel)]="password"></label>
        <button (click)="changePassword()">Change Password</button>
      </div>
      <p *ngIf="msg" style="color:green">{{msg}}</p>
    </div>
    <div *ngIf="!user">Not logged in.</div>
  `
})
export class ProfileComponent {
  user: any = null;
  password = '';
  msg = '';
  constructor() {
    AuthService.prototype.user$.subscribe(u => this.user = u);
  }
  changePassword() {
    // Replace with actual backend call
    this.msg = 'Password updated (not really, backend not implemented)';
  }
}
