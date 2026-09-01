import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth'),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard'),
    canActivate: [AuthGuard.canActivate], // Authentication
    children: [
      {
        path: 'users',
        loadComponent: () => import('./pages/users/user'),
      },
      {
        path: 'wallet',
        loadComponent: () => import('./pages/wallet/wallet'),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'auth',
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
];
