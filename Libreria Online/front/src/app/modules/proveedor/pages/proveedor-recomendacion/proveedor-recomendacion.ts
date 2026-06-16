import { ChangeDetectorRef, Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
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
import { catchError, of } from 'rxjs';

import { Nav } from '../../../../shared/components/nav/nav';
import { ToastService } from '../../../../services/toast.service';
import { OfertasLibroService } from '../../../../services/ofertas-libro/ofertas-libro.service';
import { LibrosService } from '../../../../services/libros/libros.services';
import { EstadoOferta, OfertaLibro } from '../../interfaces/oferta-libro.interface';
import { Libro } from '../../../libros/interfaces/libro.interface';

interface OpenLibraryBook {
  title?: string;
  subtitle?: string;
  authors?: Array<{ name?: string }>;
  cover?: {
    small?: string;
    medium?: string;
    large?: string;
  };
}

@Component({
  selector: 'app-proveedor-recomendacion',
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
  templateUrl: './proveedor-recomendacion.html',
  styleUrl: './proveedor-recomendacion.css',
})
export class ProveedorRecomendacion implements OnInit {
  userName = 'Maria Rodriguez';
  role = 'proveedor';
  activeItem = 'Recomendar libro';

  recomendaciones: OfertaLibro[] = [];
  cargando = true;
  guardando = false;
  respondiendo = false;
  buscandoIsbn = false;
  searchValue = '';
  nuevaRecomendacionVisible = false;
  contraofertaVisible = false;
  ofertaSeleccionada?: OfertaLibro;
  isbnVerificado = false;
  isbnVerificadoValor = '';
  portadaPreview?: string;

  recomendacionForm!: FormGroup;
  contraofertaForm!: FormGroup;

  @ViewChild('tablaRecomendaciones') tablaRecomendaciones?: Table;

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private ofertasService = inject(OfertasLibroService);
  private librosService = inject(LibrosService);
  private toastService = inject(ToastService);
  private messageService = inject(MessageService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.initializeForms();
    this.obtenerRecomendaciones();

    this.recomendacionForm.get('isbn')?.valueChanges.subscribe(() => {
      this.isbnVerificado = false;
      this.isbnVerificadoValor = '';
      this.portadaPreview = undefined;
      this.recomendacionForm.patchValue({ libroId: null }, { emitEvent: false });
    });
  }

  obtenerRecomendaciones(): void {
    this.cargando = true;

    this.ofertasService.listOfertas().subscribe({
      next: (data) => {
        this.recomendaciones = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al traer las recomendaciones', error);
        this.cargando = false;
        this.toastService.error('No se pudieron cargar los libros recomendados.');
        this.cdr.detectChanges();
      },
    });
  }

  buscarRecomendaciones(valor: string): void {
    this.searchValue = valor;
    this.tablaRecomendaciones?.filterGlobal(valor, 'contains');
  }

  abrirNuevaRecomendacion(): void {
    this.nuevaRecomendacionVisible = true;
  }

  cerrarNuevaRecomendacion(): void {
    this.nuevaRecomendacionVisible = false;
    this.recomendacionForm.reset();
    this.isbnVerificado = false;
    this.isbnVerificadoValor = '';
    this.portadaPreview = undefined;
  }

  buscarPorIsbn(): void {
    const isbn = this.normalizarIsbn(this.recomendacionForm.value.isbn);

    this.recomendacionForm.patchValue({ isbn }, { emitEvent: false });
    this.isbn?.markAsTouched();

    if (!isbn || this.isbn?.invalid) {
      this.toastService.error('Ingresá un ISBN válido antes de buscar.');
      return;
    }

    this.buscandoIsbn = true;

    this.librosService.buscarLibroPorIsbn(isbn).pipe(
      catchError(() => of(null))
    ).subscribe((libro) => {
      if (libro) {
        this.completarDesdeLibro(libro);
        this.buscandoIsbn = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Libro encontrado',
          detail: 'El ISBN existe en la base de datos de la libreria.',
          life: 3500,
        });
        return;
      }

      this.buscarEnOpenLibrary(isbn);
    });
  }

  guardarRecomendacion(): void {
    if (!this.isbnVerificado || this.isbnVerificadoValor !== this.normalizarIsbn(this.recomendacionForm.value.isbn)) {
      this.toastService.error('Buscá el ISBN antes de guardar la recomendación.');
      this.isbn?.markAsTouched();
      return;
    }

    if (this.recomendacionForm.invalid) {
      this.recomendacionForm.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.ofertasService.crearOferta(this.recomendacionForm.value).subscribe({
      next: () => {
        this.guardando = false;
        this.cerrarNuevaRecomendacion();
        this.toastService.created('Recomendación');
        this.obtenerRecomendaciones();
      },
      error: (error) => {
        console.error('Error al crear la recomendacion', error);
        this.guardando = false;
        this.toastService.error('No se pudo guardar la recomendación.');
      },
    });
  }

  abrirContraoferta(recomendacion: OfertaLibro): void {
    this.ofertaSeleccionada = recomendacion;
    this.contraofertaForm.reset({
      nuevaCantidad: recomendacion.cantidadAdmin ?? recomendacion.cantidadProveedor,
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
        this.toastService.updated('Contraoferta enviada al administrador');
        this.obtenerRecomendaciones();
      },
      error: (error) => {
        console.error('Error al enviar contraoferta', error);
        this.respondiendo = false;
        this.toastService.error('No se pudo enviar la contraoferta.');
      },
    });
  }

  aceptarContraoferta(recomendacion: OfertaLibro): void {
    const cantidadAceptada = recomendacion.cantidadAdmin ?? recomendacion.cantidadProveedor;
    this.ofertasService.contraofertarProveedor(recomendacion.id, cantidadAceptada).subscribe({
      next: () => {
        this.toastService.updated('Contraoferta aceptada y enviada al administrador');
        this.obtenerRecomendaciones();
      },
      error: (error) => {
        console.error('Error al aceptar la contraoferta', error);
        this.toastService.error('No se pudo aceptar la contraoferta.');
      },
    });
  }

  rechazarOferta(recomendacion: OfertaLibro): void {
    this.ofertasService.rechazarOferta(recomendacion.id).subscribe({
      next: () => {
        this.toastService.error('Oferta rechazada y eliminada');
        this.obtenerRecomendaciones();
      },
      error: (error) => {
        console.error('Error al rechazar la oferta', error);
        this.toastService.error('No se pudo rechazar la oferta.');
      },
    });
  }

  puedeResponder(recomendacion: OfertaLibro): boolean {
    return recomendacion.estado === 'ESPERANDO_PROVEEDOR';
  }

  portadaUrl(isbn: string): string {
    return `https://covers.openlibrary.org/b/isbn/${encodeURIComponent(isbn)}-S.jpg?default=false`;
  }

  ocultarPortada(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
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

  cantidadActual(recomendacion: OfertaLibro): number {
    return recomendacion.estado === 'ESPERANDO_PROVEEDOR' && recomendacion.cantidadAdmin
      ? recomendacion.cantidadAdmin
      : recomendacion.cantidadProveedor;
  }

  private buscarEnOpenLibrary(isbn: string): void {
    const url = `https://openlibrary.org/api/books?bibkeys=ISBN:${encodeURIComponent(isbn)}&jscmd=data&format=json`;

    this.http.get<Record<string, OpenLibraryBook>>(url).subscribe({
      next: (respuesta) => {
        const libro = respuesta[`ISBN:${isbn}`];
        this.buscandoIsbn = false;

        if (!libro) {
          this.isbnVerificado = true;
          this.isbnVerificadoValor = isbn;
          this.messageService.add({
            severity: 'warn',
            summary: 'Sin datos externos',
            detail: 'No se encontró en la base de datos ni en OpenLibrary. Podés completar título y autor manualmente.',
            life: 4500,
          });
          return;
        }

        const titulo = [libro.title, libro.subtitle].filter(Boolean).join(': ');
        const autor = libro.authors?.map((item) => item.name).filter(Boolean).join(', ') ?? '';

        this.recomendacionForm.patchValue({
          nombre: titulo,
          autor,
          libroId: null,
        });
        this.portadaPreview = libro.cover?.medium ?? libro.cover?.small ?? libro.cover?.large;
        this.isbnVerificado = true;
        this.isbnVerificadoValor = isbn;

        this.messageService.add({
          severity: 'info',
          summary: 'OpenLibrary',
          detail: 'No estaba en la base de datos. Se completaron los datos encontrados en la API.',
          life: 4000,
        });
      },
      error: (error) => {
        console.error('Error al consultar OpenLibrary', error);
        this.buscandoIsbn = false;
        this.isbnVerificado = true;
        this.isbnVerificadoValor = isbn;
        this.toastService.error('No se pudo consultar OpenLibrary. Completá título y autor manualmente.');
      },
    });
  }

  private completarDesdeLibro(libro: Libro): void {
    this.recomendacionForm.patchValue({
      nombre: libro.nombre,
      autor: libro.autor,
      libroId: libro.id,
    });
    this.portadaPreview = this.portadaUrl(libro.isbn);
    this.isbnVerificado = true;
    this.isbnVerificadoValor = this.normalizarIsbn(libro.isbn);
  }

  private normalizarIsbn(isbn: string | null | undefined): string {
    return String(isbn ?? '').trim().replace(/\s+/g, '');
  }

  private initializeForms(): void {
    this.recomendacionForm = this.fb.group({
      isbn: ['', [Validators.required, Validators.pattern(/^[0-9Xx-]{10,20}$/)]],
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      autor: ['', [Validators.required, Validators.minLength(3)]],
      precioProveedor: [null, [Validators.required, Validators.min(1)]],
      cantidadProveedor: [null, [Validators.required, Validators.min(1)]],
      libroId: [null],
    });

    this.contraofertaForm = this.fb.group({
      nuevaCantidad: [null, [Validators.required, Validators.min(1)]],
    });
  }

  get isbn() { return this.recomendacionForm.get('isbn'); }
  get nombre() { return this.recomendacionForm.get('nombre'); }
  get autor() { return this.recomendacionForm.get('autor'); }
  get precioProveedor() { return this.recomendacionForm.get('precioProveedor'); }
  get cantidadProveedor() { return this.recomendacionForm.get('cantidadProveedor'); }
  get nuevaCantidad() { return this.contraofertaForm.get('nuevaCantidad'); }
}
