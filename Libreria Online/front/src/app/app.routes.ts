import { Routes } from '@angular/router';
import { HomeUser } from './layouts/home-user/home-user';
import { Register } from './layouts/register/register';
import { Login } from './layouts/login/login';
import { Carrito } from './modules/carrito/carrito';
import { Usuario } from './modules/usuario/usuario-component/usuario';
import { ProveedorRecomendacion } from './modules/proveedor/pages/proveedor-recomendacion/proveedor-recomendacion';
import { Admin } from './modules/admin/admin';
import { VerOfertas } from './modules/admin/pages/ver-ofertas/ver-ofertas';
import { authGuard } from './services/Auth/auth-guard';
import { Estanteria } from './modules/estanteria/estanteria';

export const routes: Routes = [
  {
    path: '',
    component: HomeUser,
  },
  {
    path: 'proveedor',
    loadChildren: () =>
      import('./modules/proveedor/proveedor.routes').then((m) => m.proveedorRoutes),
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: 'login',
    component: Login,
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
