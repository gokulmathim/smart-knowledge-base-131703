import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  styleUrl: './navbar.component.css',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  isLoggedIn = false;
  isAdmin = false;
  constructor(
  ) {
    // Use the AuthService singleton from DI (standalone: providedIn:root)
    AuthService.prototype.user$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.isAdmin = !!user?.isAdmin;
    });
  }
  logout() {
    AuthService.prototype.logout();
    // Router can't be called here directly since this is a stateless static bar: fallback to location
    if (typeof globalThis !== 'undefined' && globalThis.location) {
      globalThis.location.pathname = '/';
    }
  }
}

