import { Component, inject, OnInit, signal } from '@angular/core';
import { Carrito } from '../interfaces/carrito.interface';
import { Router } from '@angular/router';
import { CompradorService } from '../../../api/services/comprador/comprador-service';
import { LibroCarrito } from '../libro-carrito/libro-carrito';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-carrito-component',
  standalone: true,
  imports: [LibroCarrito, ButtonModule],
  templateUrl: './carrito-component.html',
  styleUrl: './carrito-component.css',
})
export class CarritoComponent implements OnInit {
  carrito = signal<Carrito | null>(null);
  compradorService = inject(CompradorService);
  router = inject(Router);

  ngOnInit(): void {
    this.cargarCarrito();
    console.log(this.carrito);
  }

  cargarCarrito() {
    this.compradorService.getCarritoUsuario(1).subscribe({
      next: (res: Carrito) => {
        console.log(res);
        this.carrito.set(res);
      },
      error: (err) => console.error('Error:', err),
    });
  }

  finalizarCompra() {
    const carritoActual = this.carrito();
    if (!carritoActual) return;

    this.compradorService
      .procesarPago({
        comprador_id: 1,
        metodo_pago_id: 1,
      })
      .subscribe({
        next: (res) => {
          alert('Pago procesado con éxito: ' + res.transaccionId);

          this.carrito.set(null);
          this.router.navigate(['/libros']);
        },
        error: (err) => {
          console.error('Error al procesar pago:', err);
          alert('Hubo un error al procesar el pago.');
        },
      });
  }

  manejarBorrado(libro_id: number) {
    this.compradorService
      .borrarProducto({
        comprador_id: 1,
        libro_id: libro_id,
      })
      .subscribe({
        next: () => {
          this.cargarCarrito();
        },
        error: (err) => console.error('Error al borrar:', err),
      });
  }
}
