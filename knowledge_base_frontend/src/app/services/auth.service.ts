import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, Observable, BehaviorSubject, of } from 'rxjs';

// PUBLIC_INTERFACE
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiBase = '/api';
  private readonly tokenKey = 'kb_jwt';
  public user$ = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {
    // Use http here for actual API requests; if not, keep as DI for future use
    if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
      const saved = globalThis.localStorage.getItem(this.tokenKey);
      if (saved) this.loadProfile().subscribe();
    }
  }

  /** PUBLIC_INTERFACE Login user. */
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiBase}/auth/login`, { email, password }).pipe(
      tap((res: any) => {
        if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
          globalThis.localStorage.setItem(this.tokenKey, res.token);
        }
        this.user$.next(res.user);
      })
    );
  }

  /** PUBLIC_INTERFACE Register user. */
  register(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiBase}/auth/register`, { email, password }).pipe(
      tap((res: any) => {
        if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
          globalThis.localStorage.setItem(this.tokenKey, res.token);
        }
        this.user$.next(res.user);
      })
    );
  }

  /** PUBLIC_INTERFACE Log out user. */
  logout() {
    if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
      globalThis.localStorage.removeItem(this.tokenKey);
    }
    this.user$.next(null);
  }

  /** PUBLIC_INTERFACE Loads current user profile from backend using JWT. */
  loadProfile(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      this.user$.next(null); return of(null);
    }
    return this.http.get(`${this.apiBase}/auth/me`).pipe(
      tap((user: any) => this.user$.next(user))
    );
  }

  /** PUBLIC_INTERFACE Get saved JWT token or null. */
  getToken(): string | null {
    if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
      return globalThis.localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  /** PUBLIC_INTERFACE Returns true if logged in. */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /** PUBLIC_INTERFACE Returns true if admin. (sync hint only, always protect on backend too) */
  isAdmin(): boolean {
    return !!this.user$.value?.isAdmin;
  }
}
