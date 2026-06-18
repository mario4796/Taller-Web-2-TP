import { CommonModule } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Nav } from '../../../../shared/components/nav/nav';
import { NuevaSubastaDialog } from '../../components/nueva-subasta-dialog/nueva-subasta-dialog';

@Component({
  selector: 'app-subasta-admin',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TagModule,
    DialogModule,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
    FloatLabelModule,
    Nav,
    NuevaSubastaDialog,
  ],
  templateUrl: './subasta-admin.html',
  styleUrl: './subasta-admin.css',
})
export class SubastaAdmin {
  userName = 'María Rodríguez';
  role = 'admin';
  // 📥 Inputs usando la sintaxis nueva de Angular (Signals implicitas)
  // subastas = input.required<any[]>();
  subastas = input<any[]>([]);
  subastasMock = signal<any[]>([
  {
    id: 1,
    nombre: 'El Principito',
    autor: 'Antoine de Saint-Exupéry',
    isbn: '978-3-16-148410-0',
    precioInicial: 5500,
    estado: 'ACTIVA',
    subastas: [{ precioOfertado: 6000, creadoPor: 'ADMIN' }]
  },
  {
    id: 2,
    nombre: 'Rayuela',
    autor: 'Julio Cortázar',
    isbn: '978-950-511-351-4',
    precioInicial: 12000,
    estado: 'PENDIENTE',
    subastas: []
  }
]);
 
  cargando = input<boolean>(false);

  // 📤 Outputs usando la nueva función output()
  pujar = output<any>();
  cerrar = output<any>();
  //crearSubasta = output<NuevaSubastaDTO>();

  // 🚦 Signals de estado interno (Controlan la UI)
  mostrarFormulario = signal<boolean>(false);
  searchValue = signal<string>('');


  buscarSubastas(valor: string): void {
    this.searchValue.set(valor);
    // Nota: Si usás el filtro global nativo de p-table, 
    // le pasás este valor por atrás mediante una referencia (#tablaSubastas) en tu HTML extendido.
  }

  /**
   * Determina visualmente si el usuario logueado puede o no interactuar con la subasta
   */
  puedePujar(subasta: any): boolean {
    // Tu lógica de negocio. Por ejemplo: sólo se puja si el estado es 'ACTIVA'
    return subasta.estado === 'ACTIVA' || subasta.estado === 'PENDIENTE';
  }

  /**
   * Retorna el texto amigable que va a mostrar la etiqueta de PrimeNG
   */
  estadoLabel(estado: string): string {
    const mapaEstados: Record<string, string> = {
      'PENDIENTE': 'Sin ofertas',
      'ACTIVA': 'En Curso',
      'CERRADA': 'Finalizada',
      'ACEPTADA': 'Adjudicada'
    };
    return mapaEstados[estado] || estado;
  }

  /**
   * Retorna el color (severity) del p-tag de PrimeNG según el estado
   */
  estadoSeverity(estado: string): 'success' | 'info' | 'warn' | 'danger' | undefined {
    switch (estado) {
      case 'ACTIVA': return 'info';
      case 'PENDIENTE': return 'warn';
      case 'ACEPTADA': return 'success';
      case 'CERRADA': return 'danger';
      default: return undefined;
    }
  }

 onNuevaSubastaRecibida(nuevaSubasta: any): void {
    const nuevaSubastaFormateada = {
      id: Math.floor(Math.random() * 1000),
      nombre: nuevaSubasta.nombre,
      autor: nuevaSubasta.autor,
      isbn: nuevaSubasta.isbn,
      precioInicial: Number(nuevaSubasta.precioInicial),
      estado: 'PENDIENTE',
      subastas: []
    };

    // Actualizamos la lista local mockeada
    this.subastasMock.update(lista => [nuevaSubastaFormateada, ...lista]);
  }
}
