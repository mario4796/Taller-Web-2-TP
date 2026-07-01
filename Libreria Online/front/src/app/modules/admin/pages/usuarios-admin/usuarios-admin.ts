import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { TableModule } from 'primeng/table';

import { UsuarioListado, UsuarioService } from '../../../../api/services/usuario/usuario-service';
import { Nav } from '../../../../shared/components/nav/nav';

@Component({
  selector: 'app-usuarios-admin',
  standalone: true,
  imports: [CommonModule, Nav, TableModule],
  templateUrl: './usuarios-admin.html',
  styleUrl: './usuarios-admin.css',
})
export class UsuariosAdmin {
  private usuarioService = inject(UsuarioService);

  usuarios = signal<UsuarioListado[]>([]);
  cargando = signal(true);
  error = signal<string | null>(null);

  constructor() {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.cargando.set(true);
    this.error.set(null);

    this.usuarioService.listUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios.set(usuarios);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la lista de usuarios.');
        this.cargando.set(false);
      },
    });
  }
}
