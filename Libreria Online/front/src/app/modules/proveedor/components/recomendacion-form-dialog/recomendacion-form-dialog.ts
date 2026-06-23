import { Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';

import { CATEGORIAS_LIBRO } from '../../../../shared/interfaces/libro.interface';

@Component({
  selector: 'app-recomendacion-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    DialogModule,
    FloatLabelModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputNumberModule,
    InputTextModule,
    SelectModule,
    TextareaModule,
    TooltipModule,
  ],
  templateUrl: './recomendacion-form-dialog.html',
  styleUrl: './recomendacion-form-dialog.css',
})
export class RecomendacionFormDialog {
  visible = input(false);
  form = input.required<FormGroup>();
  buscandoIsbn = input(false);
  guardando = input(false);
  isbnVerificado = input(false);
  portadaPreview = input<string | undefined>();

  cerrar = output<void>();
  buscarIsbn = output<void>();
  guardar = output<void>();

  categorias = CATEGORIAS_LIBRO;
  sinopsisMaxLength = 700;

  ocultarPortada(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }

  get isbn() { return this.form().get('isbn'); }
  get nombre() { return this.form().get('nombre'); }
  get autor() { return this.form().get('autor'); }
  get precioProveedor() { return this.form().get('precioProveedor'); }
  get cantidadProveedor() { return this.form().get('cantidadProveedor'); }
  get categoria() { return this.form().get('categoria'); }
  get sinopsis() { return this.form().get('sinopsis'); }
}
