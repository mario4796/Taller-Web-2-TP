import { Routes } from '@angular/router';
import { HomeUser } from './layouts/home-user/home-user';
import { ProveedorHome } from './modules/proveedor/pages/proveedor-home/proveedor-home';
import { Register } from './layouts/register/register';
import { Login } from './layouts/login/login';
import { Carrito } from './modules/carrito/carrito';
import { Libro } from './modules/libro/libro';
import { Usuario } from './modules/usuario/usuario-component/usuario';

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
    path: 'register', 
    component: Register
  },
  { 
    path: 'login', 
    component: Login
  },
  {
    path:'carrito',
    component: Carrito
  },
  {
    path: 'libro',
    component: Libro
  },
{
  path:'usuarios',
  component: Usuario
}


];
