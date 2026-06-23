import { Routes } from '@angular/router';

import { Admin } from './admin';
import { VerOfertas } from './pages/ver-ofertas/ver-ofertas';
import { SubastaAdmin } from './pages/subasta-admin/subasta-admin';

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
];
