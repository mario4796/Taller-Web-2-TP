import { Component, input, output } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Libro } from '../libros/interfaces/libro.interface';

@Component({
  selector: 'app-libro-estanteria',
  standalone: true,
  imports: [CardModule, ButtonModule],
  template: `
    <p-card styleClass="book-card">
      <div class="book-content">
        <div class="book-cover">
          <i class="pi pi-book"></i>
        </div>
        <div class="book-category">
          {{ libro().categoria || 'GENERAL' }}
        </div>

        <h3 class="book-title">
          {{ libro().nombre }}
        </h3>

        <div class="book-author">✍️ {{ libro().autor }}</div>

        <div class="book-sinopsis">
          {{ libro().sinopsis ? libro().sinopsis : 'No detallado por el autor o la editorial.' }}
        </div>

        <div class="book-isbn">ISBN: {{ libro().isbn }}</div>

        <div class="book-footer-info">
          <div class="book-price">$ {{ libro().precio }}</div>

          @if (libro().stock > 0) {
            <div class="book-stock">Stock: {{ libro().stock }}</div>
          } @else {
            <div class="book-agotado">AGOTADO</div>
          }
        </div>
      </div>

      <ng-template pTemplate="footer">
        <p-button
          [label]="libro().stock > 0 ? 'Comprar' : 'Sin Stock'"
          icon="pi pi-shopping-cart"
          styleClass="buy-btn"
          [disabled]="libro().stock <= 0"
          (onClick)="emitirCompra()"
        >
        </p-button>
      </ng-template>
    </p-card>
  `,
  styleUrl: './libro-estanteria.css',
})
export class LibroEstanteria {
  libro = input.required<Libro>();

  onComprar = output<number>();

  emitirCompra() {
    if (this.libro().stock > 0) {
      this.onComprar.emit(this.libro().id);
    }
  }
}
