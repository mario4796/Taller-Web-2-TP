import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { catchError, of } from 'rxjs';

import { IsbnLookupService, OpenLibraryBook } from '../../../../api/services/isbn-lookup/isbn-lookup.service';
import { LibrosService } from '../../../../api/services/libros/libros.services';
import { OfertasLibroService } from '../../../../api/services/ofertas-libro/ofertas-libro.service';
import { Nav } from '../../../../shared/components/nav/nav';
import { CategoriaLibro, Libro } from '../../../../shared/interfaces/libro.interface';
import { NuevaOfertaLibro, OfertaLibro } from '../../../../shared/interfaces/oferta-libro.interface';
import { ToastService } from '../../../../shared/services/toast.service';
import { ContraofertaProveedorDialog } from '../../components/contraoferta-proveedor-dialog/contraoferta-proveedor-dialog';
import { RecomendacionFormDialog } from '../../components/recomendacion-form-dialog/recomendacion-form-dialog';
import { RecomendacionesTable } from '../../components/recomendaciones-table/recomendaciones-table';

@Component({
  selector: 'app-proveedor-recomendacion',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Nav,
    ButtonModule,
    ToastModule,
    RecomendacionesTable,
    RecomendacionFormDialog,
    ContraofertaProveedorDialog,
  ],
  templateUrl: './proveedor-recomendacion.html',
  styleUrl: './proveedor-recomendacion.css',
})
export class ProveedorRecomendacion implements OnInit {
  readonly userName = 'Maria Rodriguez';
  readonly role = 'proveedor';
  readonly activeItem = 'Recomendar libro';

  recomendaciones = signal<OfertaLibro[]>([]);
  cargando = signal(true);
  guardando = signal(false);
  respondiendo = signal(false);
  buscandoIsbn = signal(false);
  nuevaRecomendacionVisible = signal(false);
  contraofertaVisible = signal(false);
  ofertaSeleccionada = signal<OfertaLibro | undefined>(undefined);
  isbnVerificado = signal(false);
  isbnVerificadoValor = signal('');
  portadaPreview = signal<string | undefined>(undefined);

  private fb = inject(FormBuilder);
  private ofertasService = inject(OfertasLibroService);
  private librosService = inject(LibrosService);
  private isbnLookup = inject(IsbnLookupService);
  private toastService = inject(ToastService);
  private messageService = inject(MessageService);

  readonly recomendacionForm = this.fb.group({
    isbn: ['', [Validators.required, Validators.pattern(/^[0-9Xx-]{10,20}$/)]],
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    autor: ['', [Validators.required, Validators.minLength(3)]],
    categoria: [null as CategoriaLibro | null, [Validators.required]],
    sinopsis: ['', [Validators.maxLength(700)]],
    precioProveedor: [null as number | null, [Validators.required, Validators.min(1)]],
    cantidadProveedor: [null as number | null, [Validators.required, Validators.min(1)]],
    libroId: [null as number | null],
  });

  readonly contraofertaForm = this.fb.group({
    nuevaCantidad: [null as number | null, [Validators.required, Validators.min(1)]],
  });

  ngOnInit(): void {
    this.obtenerRecomendaciones();

    this.recomendacionForm.get('isbn')?.valueChanges.subscribe(() => {
      this.isbnVerificado.set(false);
      this.isbnVerificadoValor.set('');
      this.portadaPreview.set(undefined);
      this.recomendacionForm.patchValue({ libroId: null }, { emitEvent: false });
    });
  }

  obtenerRecomendaciones(): void {
    this.cargando.set(true);

    this.ofertasService.listOfertas().subscribe({
      next: (data) => {
        this.recomendaciones.set(data);
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al traer las recomendaciones', error);
        this.cargando.set(false);
        this.toastService.error('No se pudieron cargar los libros recomendados.');
      },
    });
  }

  abrirNuevaRecomendacion(): void {
    this.nuevaRecomendacionVisible.set(true);
  }

  cerrarNuevaRecomendacion(): void {
    this.nuevaRecomendacionVisible.set(false);
    this.recomendacionForm.reset({ categoria: null });
    this.isbnVerificado.set(false);
    this.isbnVerificadoValor.set('');
    this.portadaPreview.set(undefined);
  }

  buscarPorIsbn(): void {
    const isbn = this.normalizarIsbn(this.recomendacionForm.value.isbn);

    this.recomendacionForm.patchValue({ isbn }, { emitEvent: false });
    this.recomendacionForm.get('isbn')?.markAsTouched();

    if (!isbn || this.recomendacionForm.get('isbn')?.invalid) {
      this.toastService.error('Ingres\u00e1 un ISBN v\u00e1lido antes de buscar.');
      return;
    }

    this.buscandoIsbn.set(true);

    this.librosService.buscarLibroPorIsbn(isbn).pipe(
      catchError(() => of(null))
    ).subscribe((libro) => {
      if (libro) {
        this.completarDesdeLibro(libro);
        this.buscandoIsbn.set(false);
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
    if (!this.isbnVerificado() || this.isbnVerificadoValor() !== this.normalizarIsbn(this.recomendacionForm.value.isbn)) {
      this.toastService.error('Busc\u00e1 el ISBN antes de guardar la recomendaci\u00f3n.');
      this.recomendacionForm.get('isbn')?.markAsTouched();
      return;
    }

    if (this.recomendacionForm.invalid) {
      this.recomendacionForm.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    this.ofertasService.crearOferta(this.getNuevaOfertaPayload()).subscribe({
      next: () => {
        this.guardando.set(false);
        this.cerrarNuevaRecomendacion();
        this.toastService.created('Recomendaci\u00f3n');
        this.obtenerRecomendaciones();
      },
      error: (error) => {
        console.error('Error al crear la recomendacion', error);
        this.guardando.set(false);
        this.toastService.error('No se pudo guardar la recomendaci\u00f3n.');
      },
    });
  }

  abrirContraoferta(recomendacion: OfertaLibro): void {
    this.ofertaSeleccionada.set(recomendacion);
    this.contraofertaForm.reset({
      nuevaCantidad: recomendacion.cantidadAdmin ?? recomendacion.cantidadProveedor,
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

    this.ofertasService.contraofertarProveedor(ofertaActual.id, nuevaCantidad).subscribe({
      next: () => {
        this.respondiendo.set(false);
        this.cerrarContraoferta();
        this.toastService.updated('Contraoferta enviada al administrador');
        this.obtenerRecomendaciones();
      },
      error: (error) => {
        console.error('Error al enviar contraoferta', error);
        this.respondiendo.set(false);
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

  private buscarEnOpenLibrary(isbn: string): void {
    this.isbnLookup.buscarEnOpenLibrary(isbn).subscribe({
      next: (libro) => {
        this.buscandoIsbn.set(false);

        if (!libro) {
          this.marcarIsbnVerificado(isbn);
          this.messageService.add({
            severity: 'warn',
            summary: 'Sin datos externos',
            detail: 'No se encontr\u00f3 en la base de datos ni en OpenLibrary. Pod\u00e9s completar t\u00edtulo y autor manualmente.',
            life: 4500,
          });
          return;
        }

        this.completarDesdeOpenLibrary(libro, isbn);
      },
      error: (error) => {
        console.error('Error al consultar OpenLibrary', error);
        this.buscandoIsbn.set(false);
        this.marcarIsbnVerificado(isbn);
        this.toastService.error('No se pudo consultar OpenLibrary. Complet\u00e1 t\u00edtulo y autor manualmente.');
      },
    });
  }

  private completarDesdeOpenLibrary(libro: OpenLibraryBook, isbn: string): void {
    const titulo = [libro.title, libro.subtitle].filter(Boolean).join(': ');
    const autor = libro.authors?.map((item) => item.name).filter(Boolean).join(', ') ?? '';

    this.recomendacionForm.patchValue({
      nombre: titulo,
      autor,
      libroId: null,
    });
    this.portadaPreview.set(libro.cover?.medium ?? libro.cover?.small ?? libro.cover?.large);
    this.marcarIsbnVerificado(isbn);

    this.messageService.add({
      severity: 'info',
      summary: 'OpenLibrary',
      detail: 'No estaba en la base de datos. Se completaron los datos encontrados en la API.',
      life: 4000,
    });
  }

  private completarDesdeLibro(libro: Libro): void {
    this.recomendacionForm.patchValue({
      nombre: libro.nombre,
      autor: libro.autor,
      categoria: libro.categoria,
      sinopsis: libro.sinopsis ?? '',
      libroId: libro.id,
    });
    this.portadaPreview.set(this.isbnLookup.portadaUrl(libro.isbn));
    this.marcarIsbnVerificado(this.normalizarIsbn(libro.isbn));
  }

  private marcarIsbnVerificado(isbn: string): void {
    this.isbnVerificado.set(true);
    this.isbnVerificadoValor.set(isbn);
  }

  private normalizarIsbn(isbn: string | null | undefined): string {
    return String(isbn ?? '').trim().replace(/\s+/g, '');
  }

  private getNuevaOfertaPayload(): NuevaOfertaLibro {
    const form = this.recomendacionForm.getRawValue();

    return {
      isbn: String(form.isbn ?? ''),
      nombre: String(form.nombre ?? ''),
      autor: String(form.autor ?? ''),
      categoria: form.categoria as CategoriaLibro,
      sinopsis: form.sinopsis ?? '',
      precioProveedor: Number(form.precioProveedor ?? 0),
      cantidadProveedor: Number(form.cantidadProveedor ?? 0),
      libroId: form.libroId ?? null,
    };
  }
}
