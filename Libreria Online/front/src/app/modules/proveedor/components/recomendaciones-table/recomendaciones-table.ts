import { Component, input, output, signal, viewChild } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { PopoverModule } from 'primeng/popover';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

import { IsbnLookupService } from '../../../../api/services/isbn-lookup/isbn-lookup.service';
import { EstadoOferta, OfertaLibro } from '../../../../shared/interfaces/oferta-libro.interface';
import {
  cantidadVisibleOferta,
  estadoOfertaLabel,
  estadoOfertaSeverity,
  puedeResponderOferta,
} from '../../../../shared/utils/oferta-estado.utils';

@Component({
  selector: 'app-recomendaciones-table',
  standalone: true,
  imports: [
    CurrencyPipe,
    FormsModule,
    TableModule,
    ButtonModule,
    FloatLabelModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    PopoverModule,
    TagModule,
  ],
  templateUrl: './recomendaciones-table.html',
  styleUrl: './recomendaciones-table.css',
})
export class RecomendacionesTable {
  recomendaciones = input.required<OfertaLibro[]>();
  cargando = input(false);

  aceptar = output<OfertaLibro>();
  contraofertar = output<OfertaLibro>();
  rechazar = output<OfertaLibro>();

  searchValue = signal('');
  tablaRecomendaciones = viewChild<Table>('tablaRecomendaciones');

  constructor(private isbnLookup: IsbnLookupService) {}

  buscarRecomendaciones(valor: string): void {
    this.searchValue.set(valor);
    this.tablaRecomendaciones()?.filterGlobal(valor, 'contains');
  }

  portadaUrl(isbn: string): string {
    return this.isbnLookup.portadaUrl(isbn);
  }

  ocultarPortada(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }

  puedeResponder(recomendacion: OfertaLibro): boolean {
    return puedeResponderOferta(recomendacion);
  }

  estadoLabel(estado: EstadoOferta): string {
    return estadoOfertaLabel(estado);
  }

  estadoSeverity(estado: EstadoOferta): 'success' | 'info' | 'warn' | 'danger' {
    return estadoOfertaSeverity(estado);
  }

  cantidadVisible(recomendacion: OfertaLibro): number {
    return cantidadVisibleOferta(recomendacion);
  }

  sinopsisTexto(recomendacion: OfertaLibro): string {
    return recomendacion.sinopsis?.trim() || 'Sin sinopsis cargada.';
  }
}
