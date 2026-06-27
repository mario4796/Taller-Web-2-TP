import { Component, inject, OnInit, signal } from '@angular/core';
import { Carrito } from '../interfaces/carrito.interface';
import { Router } from '@angular/router';
import { CompradorService } from '../../../api/services/comprador/comprador-service';
import { LibroCarrito } from '../libro-carrito/libro-carrito';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../services/Auth/auth-service';
// Importaciones nuevas para el Toast
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Nav } from '../../../shared/components/nav/nav';

@Component({
  selector: 'app-carrito-component',
  standalone: true,
  imports: [LibroCarrito, ButtonModule, ToastModule, Nav], // Agregar ToastModule
  providers: [MessageService], // Es obligatorio proveer el servicio
  templateUrl: './carrito-component.html',
  styleUrl: './carrito-component.css',
})
export class CarritoComponent implements OnInit {
  carrito = signal<Carrito | null>(null);

  compradorService = inject(CompradorService);
  router = inject(Router);
  auth = inject(AuthService);
  messageService = inject(MessageService); // Inyectar el servicio de mensajes

  ngOnInit(): void {
    this.cargarCarrito();
  }

  cargarCarrito() {
    this.compradorService.getCarritoUsuario(this.auth.getUser()).subscribe({
      next: (res: Carrito) => {
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
        comprador_id: this.auth.getUser(),
        metodo_pago_id: 1,
      })
      .subscribe({
        next: (res) => {
          // Reemplazo del alert de éxito
          this.messageService.add({
            severity: 'success',
            summary: 'Compra exitosa',
            detail: 'Transacción: ' + res.transaccionId,
            life: 3000, // Tiempo en milisegundos que dura el mensaje
          });

          this.carrito.set(null);

          // Opcional: darle tiempo al usuario de ver el mensaje antes de redirigir
          setTimeout(() => {
            this.router.navigate(['/libros']);
          }, 2000);
        },
        error: (err) => {
          console.error('Error al procesar pago:', err);
          // Reemplazo del alert de error
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Hubo un problema al procesar el pago.',
            life: 3000,
          });
        },
      });
  }

  manejarBorrado(libro_id: number) {
    this.compradorService
      .borrarProducto({
        comprador_id: this.auth.getUser(),
        libro_id: libro_id,
      })
      .subscribe({
        next: () => {
          this.cargarCarrito();
          // Opcional: Agregar un toast informando que se borró el producto
          this.messageService.add({
            severity: 'info',
            summary: 'Actualizado',
            detail: 'Producto eliminado del carrito',
            life: 2000,
          });
        },
        error: (err) => {
          console.error('Error al borrar:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar el producto',
          });
        },
      });
  }
}
