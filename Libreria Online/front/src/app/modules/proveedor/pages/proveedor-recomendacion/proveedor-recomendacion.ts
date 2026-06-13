import { Component, OnInit, inject, ViewChild, ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';

import { Table } from 'primeng/table';
import { TableModule } from 'primeng/table';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';

import { Nav } from '../../../../shared/components/nav/nav';
import { LibrosService } from '../../../../services/libros/libros.services';
import { Libro } from '../../../libros/interfaces/libro.interface';
import { ToastService } from '../../../../services/toast.service';
import { AgregarLibro } from '../../components/agregar-libro/agregar-libro';


@Component({
  selector: 'app-proveedor-recomendacion',
  standalone: true,
  imports: [Nav, CommonModule, TableModule, InputGroupModule, InputGroupAddonModule, FloatLabelModule, InputTextModule, ButtonModule, FormsModule, ToastModule, AgregarLibro],
  templateUrl: './proveedor-recomendacion.html',
  styleUrl: './proveedor-recomendacion.css',
})
export class ProveedorRecomendacion implements OnInit {
  userName = 'María Rodríguez';
  role = 'proveedor';

libros: Libro[] = [];
  cargando = true;
  searchValue = '';

  @ViewChild('tablaLibros') tablaLibros?: Table;

  private librosService = inject(LibrosService);
  private toastService = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.obtenerLibros();
  }

  obtenerLibros(): void {
    this.cargando = true;

    this.librosService.listLibros().subscribe({
      next: (data) => {
        this.libros = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al traer los libros', error);
        this.cargando = false;
        this.toastService.error('No se pudieron cargar los libros.');
        this.cdr.detectChanges();
      }
    });
  }

  buscarLibros(valor: string): void {
    this.searchValue = valor;
    this.tablaLibros?.filterGlobal(valor, 'contains');
  }
}
