import { Routes } from '@angular/router';

import { Admin } from './admin';
import { VerOfertas } from './pages/ver-ofertas/ver-ofertas';
import { SubastaAdmin } from './pages/subasta-admin/subasta-admin';
import { ActualizarLibro } from './components/actualizar-libro/actualizar-libro.js';
import { EliminarLibro } from './components/eliminar-libro/eliminar-libro.js';

export const adminRoutes: Routes = [
  {
    path: '',
    component: Admin,
  },
  {
    path: 'ofertas',
    component: VerOfertas,
  },
  {
    path: 'subastaAdmin',
    component: SubastaAdmin,
  },
  {
    path: '**',
    redirectTo: '',
  },
  { path: 'actualizar-libro/:id', component: ActualizarLibro },
  { path: 'eliminar-libro/:id', component: EliminarLibro },
];
