import { ChangeDetectorRef, Component, OnInit, ViewChild, inject, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { OfertaLibro, EstadoOferta } from '../../../proveedor/interfaces/oferta-libro.interface';
@Component({
  selector: 'app-ver-ofertas',
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
  templateUrl: './ver-ofertas.html',
  styleUrl: './ver-ofertas.css',
})
export class VerOfertas {
  readonly userName = 'Maria Rodriguez';
  readonly role = 'admin';
  readonly activeItem = 'Ofertas';

  // Inyección de servicios modernos usando inject() en el constructor implícito
  private fb = inject(NonNullableFormBuilder); // FormBuilder fuertemente tipado para evitar nulos molestos
  private ofertasService = inject(OfertasLibroService);
  private toastService = inject(ToastService);

  // --- SIGNALS (Estado Reactivo Moderno) ---
  ofertas = signal<OfertaLibro[]>([]);
  cargando = signal<boolean>(true);
  guardando = signal<boolean>(false);
  respondiendo = signal<boolean>(false);
  searchValue = signal<string>('');
  nuevaOfertaVisible = signal<boolean>(false);
  contraofertaVisible = signal<boolean>(false);
  ofertaSeleccionada = signal<OfertaLibro | undefined>(undefined);


  // Reemplaza al viejo @ViewChild('tablaOfertas') para resolverlo de forma reactiva y limpia
  tablaOfertas = viewChild<Table>('tablaOfertas');


  // Al usar NonNullableFormBuilder, los formularios se inicializan directamente aquí de forma segura
  ofertaForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    isbn: ['', [Validators.required, Validators.pattern(/^[0-9-]{10,20}$/)]],
    autor: ['', [Validators.required, Validators.minLength(3)]],
    precioProveedor: [0, [Validators.required, Validators.min(1)]],
    cantidadProveedor: [0, [Validators.required, Validators.min(1)]],
    libroId: [null as number | null],
  });

  contraofertaForm = this.fb.group({
    nuevaCantidad: [null as number | null, [Validators.required, Validators.min(1)]],
    nuevoPrecio: [null as number | null, [Validators.min(1)]],
  });

  // --- CONSTRUCTOR (El nuevo OnInit de Angular) ---
  constructor() {
    // Las peticiones iniciales ahora se disparan de forma segura en el constructor
    this.obtenerOfertas();
  }

  obtenerOfertas(): void {
    this.cargando.set(true);

    this.ofertasService.listOfertas().subscribe({
      next: (data) => {
        this.ofertas.set(data);
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al traer las ofertas', error);
        this.cargando.set(false);
        this.toastService.error('No se pudieron cargar las ofertas.');
      },
    });
  }

  buscarOfertas(valor: string): void {
    this.searchValue.set(valor);
    // Accedemos al valor de la tabla usando la sintaxis de función de los Signals ()
    this.tablaOfertas()?.filterGlobal(valor, 'contains');
  }

  abrirNuevaOferta(): void {
    this.nuevaOfertaVisible.set(true);
  }

  cerrarNuevaOferta(): void {
    this.nuevaOfertaVisible.set(false);
    this.ofertaForm.reset();
  }

  guardarOferta(): void {
    if (this.ofertaForm.invalid) {
      this.ofertaForm.markAllAsTouched();

      return;
    }


    this.guardando.set(true);
    const datosOferta = this.ofertaForm.getRawValue();
    this.ofertasService.crearOferta(datosOferta).subscribe({
      next: () => {
        this.guardando.set(false);
        this.cerrarNuevaOferta();
        this.toastService.created('Oferta');
        this.obtenerOfertas();
      },
      error: (error) => {
        console.error('Error al crear la oferta', error);
        this.guardando.set(false);
        this.toastService.error('No se pudo crear la oferta.');
      },
    });
  }

  abrirContraoferta(oferta: OfertaLibro): void {
    this.ofertaSeleccionada.set(oferta);
    this.contraofertaForm.reset({
      nuevaCantidad: oferta.cantidadAdmin ?? oferta.cantidadProveedor,
      nuevoPrecio: oferta.precioProveedor,
    });
    this.contraofertaVisible.set(true);
  }

  cerrarContraoferta(): void {
    this.contraofertaVisible.set(false);
    this.ofertaSeleccionada.set(undefined);
    this.contraofertaForm.reset();
  }

  enviarContraoferta(): void {
    const ofertaActual = this.ofertaSeleccionada();

    if (!ofertaActual || this.contraofertaForm.invalid) {
      this.contraofertaForm.markAllAsTouched();
      return;
    }

    this.respondiendo.set(true);
    const nuevaCantidad = this.contraofertaForm.value.nuevaCantidad!;
    const nuevoPrecio = this.contraofertaForm.value.nuevoPrecio ?? undefined;

    // llama al endpoint correcto: admin contraofertar
    this.ofertasService.contraofertarAdmin(ofertaActual.id, nuevaCantidad, nuevoPrecio).subscribe({
      next: () => {
        this.respondiendo.set(false);
        this.cerrarContraoferta();
        this.toastService.updated('Contraoferta');
        this.obtenerOfertas();
      },
      error: (error) => {
        console.error('Error al responder la contraoferta', error);
        this.respondiendo.set(false);
        this.toastService.error('No se pudo enviar la contraoferta.');
      },
    });
  }

  aceptarOferta(oferta: OfertaLibro): void {
    console.log("aceptando oferta..")
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

  rechazarOferta(oferta: OfertaLibro): void {
    this.ofertasService.rechazarOferta(oferta.id).subscribe({
      next: () => {
        this.toastService.error('Oferta rechazada y eliminada');
        this.obtenerOfertas();
      },
      error: (error) => {
        console.error('Error al rechazar la oferta', error);
        this.toastService.error('No se pudo rechazar la oferta.');
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
    return oferta.estado === 'ESPERANDO_ADMIN';
  }

  cantidadActual(oferta: OfertaLibro): number {
    return oferta.estado === 'ESPERANDO_PROVEEDOR' && oferta.cantidadAdmin
      ? oferta.cantidadAdmin
      : oferta.cantidadProveedor;
  }

  // --- GETTERS PARA FORMULARIOS ---
  get nombre() { return this.ofertaForm.get('nombre'); }
  get isbn() { return this.ofertaForm.get('isbn'); }
  get autor() { return this.ofertaForm.get('autor'); }
  get precioProveedor() { return this.ofertaForm.get('precioProveedor'); }
  get cantidadProveedor() { return this.ofertaForm.get('cantidadProveedor'); }
  get nuevaCantidad() { return this.contraofertaForm.get('nuevaCantidad'); }
  get nuevoPrecio() { return this.contraofertaForm.get('nuevoPrecio'); }
}
