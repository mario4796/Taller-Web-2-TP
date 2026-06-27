import { Component, inject, OnInit, signal } from '@angular/core';
import { DataViewModule } from 'primeng/dataview';
import { MessageService } from 'primeng/api'; // 1. Importa el servicio
import { ToastModule } from 'primeng/toast'; // 2. Importa el módulo

import { LibrosService } from '../../api/services/libros/libros.services';
import { LibroEstanteria } from '../libro-estanteria/libro-estanteria';
import { CompradorService } from '../../api/services/comprador/comprador-service';
import { AuthService } from '../../services/Auth/auth-service';
import { Libro } from '../../shared/interfaces/libro.interface';
import { Nav } from '../../shared/components/nav/nav';

@Component({
  selector: 'app-estanteria',
  standalone: true,
  imports: [LibroEstanteria, DataViewModule, Nav, ToastModule],
  providers: [MessageService],
  templateUrl: './estanteria.html',
  styleUrl: './estanteria.css',
})
export class Estanteria implements OnInit {
  libroService = inject(LibrosService);
  compradorService = inject(CompradorService);
  auth = inject(AuthService);
  messageService = inject(MessageService);

  libros = signal<Libro[]>([]);

  ngOnInit(): void {
    this.cargarLibros();
  }

  cargarLibros() {
    this.libroService.listLibros().subscribe({
      next: (data) => this.libros.set(data),
      error: (err) => console.error('❌ Error al cargar libros:', err),
    });
  }

  manejarCompra(libroId: number) {
    if (this.auth.getUser() !== null) {
      this.compradorService
        .agregarProductoAlCarrito({
          comprador_id: this.auth.getUser(),
          libro_id: libroId,
          cantidad: 1,
        })
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: '¡Éxito!',
              detail: 'Libro agregado al carrito',
              life: 3000,
            });

            this.cargarLibros();
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo agregar el libro',
            });
            console.error('Error al comprar', err);
          },
        });
    } else {
      console.log('Error usuario no encontrado');
    }
  }
}
