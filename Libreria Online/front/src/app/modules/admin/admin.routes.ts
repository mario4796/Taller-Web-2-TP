import { Routes } from '@angular/router';

import { Admin } from './admin';
import { VerOfertas } from './pages/ver-ofertas/ver-ofertas';
import { SubastaAdmin } from './pages/subasta-admin/subasta-admin';
import { VerLibrosAdmin } from './pages/ver-libros-admin/ver-libros-admin';
import { StockAdmin } from './pages/stock-admin/stock-admin';
import { UsuariosAdmin } from './pages/usuarios-admin/usuarios-admin';
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
    path: 'usuarios',
    component: UsuariosAdmin,
  },
  {
    path: 'libros',
    component: VerLibrosAdmin,
  },
  {
    path: 'subastaAdmin',
    component: SubastaAdmin,
  },
  {
    path: 'stock',
    component: StockAdmin,
  },
  {
    path: '**',
    redirectTo: '',
  },
  { path: 'actualizar-libro/:id', component: ActualizarLibro },
  { path: 'eliminar-libro/:id', component: EliminarLibro },
];
