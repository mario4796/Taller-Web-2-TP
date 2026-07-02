import { Component, computed, input, output, signal, viewChild } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

import { IsbnLookupService } from '../../../../api/services/isbn-lookup/isbn-lookup.service';
import { EstadoOferta, OfertaLibro } from '../../../../shared/interfaces/oferta-libro.interface';
import {
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
    TagModule,
  ],
  templateUrl: './recomendaciones-table.html',
  styleUrl: './recomendaciones-table.css',
})
export class RecomendacionesTable {
  readonly portadaFallback = '/img/portada/imagen-no-disponible-vertical.svg';

  recomendaciones = input.required<OfertaLibro[]>();
  cargando = input(false);
  recomendacionesOrdenadas = computed(() =>
    [...this.recomendaciones()].sort((a, b) => this.prioridadEstado(a.estado) - this.prioridadEstado(b.estado))
  );

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

  portadaUrl(recomendacion: OfertaLibro): string {
    return recomendacion.imagenUrl?.trim() || this.isbnLookup.portadaUrl(recomendacion.isbn);
  }

  usarPortadaFallback(event: Event): void {
    const imagen = event.target as HTMLImageElement;
    if (!imagen.src.endsWith(this.portadaFallback)) {
      imagen.src = this.portadaFallback;
    }
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
    return recomendacion.cantidadProveedor;
  }

  private prioridadEstado(estado: EstadoOferta): number {
    return estado === 'ESPERANDO_ADMIN' || estado === 'ESPERANDO_PROVEEDOR' ? 0 : 1;
  }
}
