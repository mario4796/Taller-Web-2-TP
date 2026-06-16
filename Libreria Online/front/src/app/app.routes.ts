import { Routes } from '@angular/router';
import { HomeUser } from './layouts/home-user/home-user';
import { Register } from './layouts/register/register';
import { Login } from './layouts/login/login';

export const routes: Routes = [
  {
    path: '',
    component: HomeUser
  },
  {
    path: 'proveedor',
    loadChildren: () =>
      import('./modules/proveedor/proveedor.routes').then((m) => m.proveedorRoutes),
  },
  {
    path: 'register',
    component: Register
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./modules/admin/admin.routes').then((m) => m.adminRoutes),
  },
  {
    path: '**',
    redirectTo: '',
  }
];
