import { Component, inject, OnInit, signal } from '@angular/core';
import { DataViewModule } from 'primeng/dataview';
import { MessageService } from 'primeng/api'; // 1. Importa el servicio
import { ToastModule } from 'primeng/toast'; // 2. Importa el módulo

import { LibrosService } from '../../api/services/libros/libros.services';
import { LibroEstanteria } from '../libro-estanteria/libro-estanteria';
import { CompradorService } from '../../api/services/comprador/comprador-service';
import { AuthService } from '../../services/Auth/auth-service';
import { LibroDigitalService } from '../../services/libro-digital/libro-digital.service';
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
  libroDigitalService = inject(LibroDigitalService);
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

  manejarCompraDigital(libroId: number) {
    const compradorId = this.auth.getUser();
    if (compradorId === null) {
      console.log('Error usuario no encontrado');
      return;
    }

    this.libroDigitalService.adquirirLibro(compradorId, libroId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: '¡Libro digital adquirido!',
          detail: 'Ya podés acceder a él desde "Mis libros digitales"',
          life: 4000,
        });
      },
      error: (err) => {
        const yaAdquirido = err?.error?.message?.includes('ya adquirido') || err?.status === 409;
        this.messageService.add({
          severity: yaAdquirido ? 'warn' : 'error',
          summary: yaAdquirido ? 'Ya lo tenés' : 'Error',
          detail: yaAdquirido
            ? 'Este libro digital ya está en tu biblioteca'
            : 'No se pudo adquirir el libro digital',
        });
        console.error('Error al adquirir libro digital', err);
      },
    });
  }
}
