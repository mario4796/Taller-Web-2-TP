import { Component, input } from '@angular/core';
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
        <h3>{{ libro().nombre }}</h3>

        <div class="book-author">
          {{ libro().autor }}
        </div>

        <div class="book-isbn">ISBN: {{ libro().isbn }}</div>

        <div class="book-price">$ {{ libro().precio }}</div>
      </div>

      <ng-template pTemplate="footer">
        <p-button label="Comprar" icon="pi pi-shopping-cart" styleClass="buy-btn"> </p-button>
      </ng-template>
    </p-card>
  `,
  styleUrl: './libro-estanteria.css',
})
export class LibroEstanteria {
  libro = input.required<Libro>();
}
