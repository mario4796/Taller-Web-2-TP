import { Component, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Libro } from '../libros/interfaces/libro.interface';

@Component({
  selector: 'app-libro-estanteria',
  imports: [CardModule, ButtonModule],
  template: `<p-card [header]="libro().nombre" [style]="{ 'background-color': '#1e2330', 'color': 'white' }">
        <p><strong>Autor:</strong> {{ libro().autor }}</p>
        <p><strong>ISBN:</strong> {{ libro().isbn }}</p>
        <p style="font-size: 1.2rem; font-weight: bold; color: #10b981;">
            $ {{ libro().precio }}
        </p>
        
        <ng-template pTemplate="footer">
            <p-button label="Comprar" styleClass="w-full p-button-success"></p-button>
        </ng-template>
    </p-card>`,
  styleUrl: './libro-estanteria.css',
})
export class LibroEstanteria {
    libro = input.required<Libro>();
}
