import { Component, inject, OnInit, signal } from '@angular/core';

import { DataViewModule } from 'primeng/dataview';

import { LibrosService } from '../../api/services/libros/libros.services';
import { LibroEstanteria } from '../libro-estanteria/libro-estanteria';
import { CompradorService } from '../../api/services/comprador/comprador-service';
import { AuthService } from '../../services/Auth/auth-service';
import { Libro } from '../../shared/interfaces/libro.interface';

@Component({
  selector: 'app-estanteria',
  standalone: true,
  imports: [LibroEstanteria, DataViewModule],
  templateUrl: './estanteria.html',
  styleUrl: './estanteria.css',
})
export class Estanteria implements OnInit {
  libroService = inject(LibrosService);
  compradorService = inject(CompradorService);
  auth = inject(AuthService);
  libros = signal<Libro[]>([]);

  ngOnInit(): void {
    this.cargarLibros();
  }

  cargarLibros() {
    this.libroService.listLibros().subscribe({
      next: (data) => {
        console.log('DATA:', data);
        this.libros.set(data);

        console.log('SIGNAL:', this.libros());
      },
      error: (err) => {
        console.error('❌ Error al cargar libros:', err);
      },
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
          next: () => alert('Libro agregado al carrito'),
          error: (err) => console.error('Error al comprar', err),
        });
    } else {
      console.log('Error usuario no encontrado');
    }
  }
}
