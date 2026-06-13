import { ChangeDetectorRef, Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

import { Nav } from '../../../../shared/components/nav/nav';
import { ToastService } from '../../../../services/toast.service';
import { OfertasLibroService } from '../../../../services/ofertas-libro/ofertas-libro.service';
import { EstadoOferta, OfertaLibro } from '../../interfaces/oferta-libro.interface';

@Component({
  selector: 'app-proveedor-ofertas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Nav,
    TableModule,
    ButtonModule,
    DialogModule,
    FloatLabelModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputNumberModule,
    InputTextModule,
    TagModule,
    ToastModule,
    TooltipModule,
  ],
  templateUrl: './proveedor-ofertas.html',
  styleUrl: './proveedor-ofertas.css',
})
export class ProveedorOfertas implements OnInit {
  userName = 'Maria Rodriguez';
  role = 'proveedor';
  activeItem = 'Ofertas';

  ofertas: OfertaLibro[] = [];
  cargando = true;
  guardando = false;
  respondiendo = false;
  searchValue = '';
  nuevaOfertaVisible = false;
  contraofertaVisible = false;
  ofertaSeleccionada?: OfertaLibro;

  ofertaForm!: FormGroup;
  contraofertaForm!: FormGroup;

  @ViewChild('tablaOfertas') tablaOfertas?: Table;

  private fb = inject(FormBuilder);
  private ofertasService = inject(OfertasLibroService);
  private toastService = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.initializeForms();
    this.obtenerOfertas();
  }

  obtenerOfertas(): void {
    this.cargando = true;

    this.ofertasService.listOfertas().subscribe({
      next: (data) => {
        this.ofertas = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al traer las ofertas', error);
        this.cargando = false;
        this.toastService.error('No se pudieron cargar las ofertas.');
        this.cdr.detectChanges();
      },
    });
  }

  buscarOfertas(valor: string): void {
    this.searchValue = valor;
    this.tablaOfertas?.filterGlobal(valor, 'contains');
  }

  abrirNuevaOferta(): void {
    this.nuevaOfertaVisible = true;
  }

  cerrarNuevaOferta(): void {
    this.nuevaOfertaVisible = false;
    this.ofertaForm.reset();
  }

  guardarOferta(): void {
    if (this.ofertaForm.invalid) {
      this.ofertaForm.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.ofertasService.crearOferta(this.ofertaForm.value).subscribe({
      next: () => {
        this.guardando = false;
        this.cerrarNuevaOferta();
        this.toastService.created('Oferta');
        this.obtenerOfertas();
      },
      error: (error) => {
        console.error('Error al crear la oferta', error);
        this.guardando = false;
        this.toastService.error('No se pudo crear la oferta.');
      },
    });
  }

  abrirContraoferta(oferta: OfertaLibro): void {
    this.ofertaSeleccionada = oferta;
    this.contraofertaForm.reset({
      nuevaCantidad: oferta.cantidadProveedor,
    });
    this.contraofertaVisible = true;
  }

  cerrarContraoferta(): void {
    this.contraofertaVisible = false;
    this.ofertaSeleccionada = undefined;
    this.contraofertaForm.reset();
  }

  enviarContraoferta(): void {
    if (!this.ofertaSeleccionada || this.contraofertaForm.invalid) {
      this.contraofertaForm.markAllAsTouched();
      return;
    }

    this.respondiendo = true;
    const nuevaCantidad = this.contraofertaForm.value.nuevaCantidad;

    this.ofertasService.contraofertarProveedor(this.ofertaSeleccionada.id, nuevaCantidad).subscribe({
      next: () => {
        this.respondiendo = false;
        this.cerrarContraoferta();
        this.toastService.updated('Contraoferta');
        this.obtenerOfertas();
      },
      error: (error) => {
        console.error('Error al responder la contraoferta', error);
        this.respondiendo = false;
        this.toastService.error('No se pudo enviar la contraoferta.');
      },
    });
  }

  aceptarOferta(oferta: OfertaLibro): void {
    this.ofertasService.aceptarOferta(oferta.id).subscribe({
      next: () => {
        this.toastService.updated('Oferta');
        this.obtenerOfertas();
      },
      error: (error) => {
        console.error('Error al aceptar la oferta', error);
        this.toastService.error('No se pudo aceptar la oferta.');
      },
    });
  }

  estadoLabel(estado: EstadoOferta): string {
    const labels: Record<EstadoOferta, string> = {
      ESPERANDO_ADMIN: 'Esperando admin',
      ESPERANDO_PROVEEDOR: 'Esperando proveedor',
      ACEPTADA: 'Aceptada',
      RECHAZADA: 'Rechazada',
    };

    return labels[estado];
  }

  estadoSeverity(estado: EstadoOferta): 'success' | 'info' | 'warn' | 'danger' {
    const severities: Record<EstadoOferta, 'success' | 'info' | 'warn' | 'danger'> = {
      ESPERANDO_ADMIN: 'info',
      ESPERANDO_PROVEEDOR: 'warn',
      ACEPTADA: 'success',
      RECHAZADA: 'danger',
    };

    return severities[estado];
  }

  puedeResponder(oferta: OfertaLibro): boolean {
    return oferta.estado === 'ESPERANDO_PROVEEDOR';
  }

  cantidadActual(oferta: OfertaLibro): number {
    return oferta.estado === 'ESPERANDO_PROVEEDOR' && oferta.cantidadAdmin
      ? oferta.cantidadAdmin
      : oferta.cantidadProveedor;
  }

  private initializeForms(): void {
    this.ofertaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      isbn: ['', [Validators.required, Validators.pattern(/^[0-9-]{10,20}$/)]],
      autor: ['', [Validators.required, Validators.minLength(3)]],
      precioProveedor: [null, [Validators.required, Validators.min(1)]],
      cantidadProveedor: [null, [Validators.required, Validators.min(1)]],
      libroId: [null],
    });

    this.contraofertaForm = this.fb.group({
      nuevaCantidad: [null, [Validators.required, Validators.min(1)]],
    });
  }

  get nombre() { return this.ofertaForm.get('nombre'); }
  get isbn() { return this.ofertaForm.get('isbn'); }
  get autor() { return this.ofertaForm.get('autor'); }
  get precioProveedor() { return this.ofertaForm.get('precioProveedor'); }
  get cantidadProveedor() { return this.ofertaForm.get('cantidadProveedor'); }
  get nuevaCantidad() { return this.contraofertaForm.get('nuevaCantidad'); }
}
