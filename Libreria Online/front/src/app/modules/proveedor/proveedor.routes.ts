import { Routes } from '@angular/router';

import { Estadisticas } from './pages/estadisticas/estadisticas';
import { Libros } from './pages/libros/libros';
import { ProveedorRecomendacion } from './pages/proveedor-recomendacion/proveedor-recomendacion';

export const proveedorRoutes: Routes = [
  {
    path: '',
    redirectTo: 'recomendaciones',
    pathMatch: 'full',
  },
  {
    path: 'libros',
    component: Libros,
  },
  {
    path: 'estadisticas',
    component: Estadisticas,
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
    redirectTo: 'recomendaciones',
  },
];
