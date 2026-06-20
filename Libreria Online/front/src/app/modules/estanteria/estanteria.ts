import { Component, inject, OnInit, signal } from '@angular/core';

import { DataViewModule } from 'primeng/dataview';

import { LibrosService } from '../../services/libros/libros.services';
import { LibroEstanteria } from '../libro-estanteria/libro-estanteria';
import { Libro } from '../libros/interfaces/libro.interface';
import { CompradorService } from '../../api/services/comprador/comprador-service';

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

  compradorId = 1;

  manejarCompra(libroId: number) {
    this.compradorService
      .agregarProductoAlCarrito({
        comprador_id: this.compradorId,
        libro_id: libroId,
        cantidad: 1,
      })
      .subscribe({
        next: () => alert('Libro agregado al carrito'),
        error: (err) => console.error('Error al comprar', err),
      });
  }
}
