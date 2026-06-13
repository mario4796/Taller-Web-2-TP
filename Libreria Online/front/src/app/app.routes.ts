import { Routes } from '@angular/router';
import { HomeUser } from './layouts/home-user/home-user';
import { ProveedorHome } from './modules/proveedor/pages/proveedor-home/proveedor-home';
import { Libros } from './modules/proveedor/pages/libros/libros';
import { Register } from './layouts/register/register';
import { Login } from './layouts/login/login';
import { ProveedorRecomendacion } from './modules/proveedor/pages/proveedor-recomendacion/proveedor-recomendacion';
import { ProveedorOfertas } from './modules/proveedor/pages/proveedor-ofertas/proveedor-ofertas';
import { Admin } from './modules/admin/admin';
import { VerOfertas } from './modules/admin/pages/ver-ofertas/ver-ofertas';

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
    path: 'proveedor/ofertas',
    component: ProveedorOfertas
  },
  {
    path: 'proveedor/proveedor-recomendacion',
    component: ProveedorRecomendacion
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
    component: Admin
  },
  {
    path: 'admin',
    children: [
      {
        path: 'ofertas',
        component: VerOfertas
      }
    ]
  }

];
