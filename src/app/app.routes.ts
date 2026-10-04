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
     {
        path: 'drivers/new',
        loadComponent: () =>
          import('./features/drivers/pages/driver-form/driver-form')
            .then(m => m.DriverForm)
      },
      {
        path: 'drivers/:id/edit',
        loadComponent: () =>
          import('./features/drivers/pages/driver-form/driver-form')
            .then(m => m.DriverForm)
      },
      {
        path: 'drivers/:id',
        loadComponent: () =>
          import('./features/drivers/pages/driver-details/driver-details')
            .then(m => m.DriverDetails)
      },
      {
        path: 'drivers',
        loadComponent: () =>
          import('./features/drivers/pages/driver-list/driver-list')
            .then(m => m.DriverList)
      },
      {
        path: 'assignments/new',
        loadComponent: () =>
          import('./features/assignments/pages/assignment-form/assignment-form')
            .then(m => m.AssignmentForm)
      },
      {
        path: 'assignments',
        loadComponent: () =>
          import('./features/assignments/pages/assignment-list/assignment-list')
            .then(m => m.AssignmentList)
      },
     {
        path: 'fuel-transactions/new',
        loadComponent: () =>
          import('./features/fuel-transactions/pages/fuel-transaction-form/fuel-transaction-form')
            .then(m => m.FuelTransactionForm)
      },
    {
      path: 'fuel-transactions/:id/edit',
      loadComponent: () =>
        import('./features/fuel-transactions/pages/fuel-transaction-form/fuel-transaction-form')
          .then(m => m.FuelTransactionForm)
    },
    {
      path: 'fuel-transactions',
      loadComponent: () =>
        import('./features/fuel-transactions/pages/fuel-transaction-list/fuel-transaction-list')
          .then(m => m.FuelTransactionList)
    },
    {
      path: 'maintenance/new',
       loadComponent: () =>
      import('./features/maintenance/pages/maintenance-form/maintenance-form')
        .then(m => m.MaintenanceForm)
      },
      {
        path: 'maintenance/:id/edit',
        loadComponent: () =>
          import('./features/maintenance/pages/maintenance-form/maintenance-form')
            .then(m => m.MaintenanceForm)
      },
      {
        path: 'maintenance',
        loadComponent: () =>
          import('./features/maintenance/pages/maintenance-list/maintenance-list')
            .then(m => m.MaintenanceList)
      },
      {
        path: 'trips/new',
        loadComponent: () =>
          import('./features/trips/pages/trip-form/trip-form')
            .then(m => m.TripForm)
      },
      {
        path: 'trips/:id/edit',
        loadComponent: () =>
          import('./features/trips/pages/trip-form/trip-form')
            .then(m => m.TripForm)
      },
      {
        path: 'trips',
        loadComponent: () =>
          import('./features/trips/pages/trip-list/trip-list')
            .then(m => m.TripList)
      },
            
    ]
  },

  {
    path: '**',
    redirectTo: ''
  }
];
