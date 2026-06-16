import { Routes } from '@angular/router';

import { Admin } from './admin';
import { VerOfertas } from './pages/ver-ofertas/ver-ofertas';

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
    path: '**',
    redirectTo: '',
  },
];
