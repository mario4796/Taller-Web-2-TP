import { Routes } from '@angular/router';
import { HomeUser } from './layouts/home-user/home-user';
import { ProveedorHome } from './modules/proveedor/pages/proveedor-home/proveedor-home';
import { Libros } from './modules/proveedor/pages/libros/libros';
import { Register } from './layouts/register/register';
import { Login } from './layouts/login/login';

export const routes: Routes = [
  {
    path: '',
    component: HomeUser
  },
  {
    path: 'proveedor',
    component: ProveedorHome
  },
  {
    path: 'proveedor/libros',
    component: Libros
  },
  {
    path: 'register',
    component: Register
  },
  {
    path: 'login',
    component: Login
  }


];
