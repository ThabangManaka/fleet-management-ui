import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/pages/main-layout/main-layout')
        .then(m => m.MainLayoutComponent),

    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard-pages/dashboard-pages')
            .then(m => m.DashboardPages)
      }
    ]
  },

  {
    path: '**',
    redirectTo: ''
  }
];
