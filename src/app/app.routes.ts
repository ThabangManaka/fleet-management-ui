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
      },
      {
        path: 'vehicles',
        loadComponent: () =>
          import('./features/Vehicles/pages/vehicle-list/vehicle-list')
            .then(m => m.VehicleList)
      },
      {
        path: 'vehicles/new',
        loadComponent: () =>
          import('./features/Vehicles/pages/vehicle-form/vehicle-form')
            .then(m => m.VehicleForm)
      },
      {
        path: 'vehicles/:id/edit',
        loadComponent: () =>
          import('./features/Vehicles/pages/vehicle-form/vehicle-form')
            .then(m => m.VehicleForm)
      },
       {
        path: 'vehicles/:id',
        loadComponent: () =>
          import('./features/Vehicles/pages/vehicle-details/vehicle-details')
            .then(m => m.VehicleDetails)
      },
      
    ]
  },

  {
    path: '**',
    redirectTo: ''
  }
];
