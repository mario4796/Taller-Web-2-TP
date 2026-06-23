import { Routes } from '@angular/router';

import { Libros } from './pages/libros/libros';
import { ProveedorHome } from './pages/proveedor-home/proveedor-home';
import { ProveedorRecomendacion } from './pages/proveedor-recomendacion/proveedor-recomendacion';

export const proveedorRoutes: Routes = [
  {
    path: '',
    component: ProveedorHome,
  },
  {
    path: 'libros',
    component: Libros,
  },
  {
    path: 'recomendaciones',
    component: ProveedorRecomendacion,
  },
  {
    path: 'proveedor-recomendacion',
    redirectTo: 'recomendaciones',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
