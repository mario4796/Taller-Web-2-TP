import { Component, inject, OnInit, signal } from '@angular/core';
import { Usuario } from '../usuario-component/usuario';
import { UsuarioService } from '../../../api/services/usuario/usuario-service';
import { UsuarioPrueba } from '../usuario.interface';


@Component({
  selector: 'app-usuarios-page',
  standalone: true,
  imports: [Usuario], // Importás al hijo para poder usar su etiqueta HTML
  templateUrl: './usuarios-page.html'
})
export class UsuariosPageComponent implements OnInit {
  
  // Inyectás el servicio
  usuarioService = inject(UsuarioService);
  
  // Creás el signal para almacenar los datos que vengan del back
  listaUsuarios = signal<UsuarioPrueba[]>([]);

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    // El padre es quien realmente llama a la base de datos
    this.usuarioService.listUsuarios().subscribe({
      next: (data) => this.listaUsuarios.set(data),
      error: (err) => console.error(err)
    });
  }

  // Esta función se va a ejecutar cuando el hijo emita el evento de borrar
  procesarEliminacion(idUsuario: number) {
    console.log("El hijo pidió borrar el ID:", idUsuario);
    // Acá llamarías a this.compradorService.eliminarUsuario(idUsuario)...
  }
}