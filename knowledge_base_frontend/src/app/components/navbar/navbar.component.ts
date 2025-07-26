import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

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
  private userSub?: Subscription;
  private _authService: AuthService;
  private _router: Router;

  constructor(authService: AuthService, router: Router) {
    this.userSub = authService.user$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.isAdmin = !!user?.isAdmin;
    });
    this._authService = authService;
    this._router = router;
  }

  logout() {
    this._authService.logout();
    this._router.navigateByUrl('/');
  }

  ngOnDestroy() {
    this.userSub?.unsubscribe();
  }
}
