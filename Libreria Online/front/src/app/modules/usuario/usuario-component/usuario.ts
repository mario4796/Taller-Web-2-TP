import { Component, inject, signal, OnInit } from '@angular/core'; // 1. Importá OnInit
import { Router } from '@angular/router';
import { UsuarioService } from '../../../api/services/usuario/usuario-service';
import { UsuarioPrueba } from '../usuario.interface';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-usuario-prueba',
  standalone:true,
  imports: [TableModule, TagModule],
  templateUrl: './usuario.html',
  styleUrl: './usuario.css',
})
// 2. Implementá OnInit
export class Usuario implements OnInit { 
  usuarios = signal<UsuarioPrueba[]>([]);
  router = inject(Router);
  usuarioService = inject(UsuarioService);

  // 3. Ejecutá la carga apenas el componente nace
  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuarioService.listUsuarios().subscribe({
      next: (res: UsuarioPrueba[]) => {
        // 4. Actualizás el signal con los datos que llegaron del back
        this.usuarios.set(res); 
      },
      error: (err) => {
        console.error("Error al traer los usuarios:", err);
      }
    });
  }

  verUsuario(usuario: UsuarioPrueba){
    this.router.navigate(['usuarios']);
  }
}