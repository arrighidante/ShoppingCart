import { Routes } from '@angular/router';
import { HeaderComponent } from '@layout/header/header.component';
import { DashboardPage } from '@pages/dashboard/dashboard.page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: HeaderComponent,
    children: [
      {
        path: '',
        loadComponent: () => DashboardPage,
      },
    ],
  },
];
