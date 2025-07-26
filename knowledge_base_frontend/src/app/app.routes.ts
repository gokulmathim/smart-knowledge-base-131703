import { Routes } from '@angular/router';

// Core lazy-loaded or eagerly loaded components, stubs listed here
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    title: 'Home',
    data: { showSidebar: true }
  },
  {
    path: 'faq',
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/faq-browser/faq-browser.component').then(m => m.FaqBrowserComponent),
        title: 'Browse FAQs'
      },
      {
        path: ':id',
        loadComponent: () => import('./pages/faq-detail/faq-detail.component').then(m => m.FaqDetailComponent),
        title: 'FAQ Details'
      }
    ]
  },
  {
    path: 'search',
    loadComponent: () => import('./pages/search/search.component').then(m => m.SearchComponent),
    title: 'AI Search'
  },
  {
    path: 'ask',
    loadComponent: () => import('./pages/ask/ask.component').then(m => m.AskComponent),
    title: 'Ask a Question'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login.component').then(m => m.LoginComponent),
    title: 'Login'
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/auth/register.component').then(m => m.RegisterComponent),
    title: 'Register'
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/user/profile.component').then(m => m.ProfileComponent),
    title: 'Profile'
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    title: 'Admin Dashboard',
    data: { requiresAdmin: true }
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/theme-settings.component').then(m => m.ThemeSettingsComponent),
    title: 'Theme & App Settings'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
