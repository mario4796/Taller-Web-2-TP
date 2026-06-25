import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { catchError, of } from 'rxjs';

import { IsbnLookupService } from '../../../../api/services/isbn-lookup/isbn-lookup.service';
import { LibrosService } from '../../../../api/services/libros/libros.services';
import { OfertasLibroService } from '../../../../api/services/ofertas-libro/ofertas-libro.service';
import { ContraofertaProveedorDialog } from '../../components/contraoferta-proveedor-dialog/contraoferta-proveedor-dialog';
import { RecomendacionFormDialog } from '../../components/recomendacion-form-dialog/recomendacion-form-dialog';
import { RecomendacionesTable } from '../../components/recomendaciones-table/recomendaciones-table';
import { Nav } from '../../../../shared/components/nav/nav';
import { Libro } from '../../../../shared/interfaces/libro.interface';
import { OfertaLibro } from '../../../../shared/interfaces/oferta-libro.interface';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-proveedor-recomendacion',
  standalone: true,
  imports: [
    CommonModule,
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
  userName = 'Maria Rodriguez';
  role = 'proveedor';
  activeItem = 'Recomendar libro';

  private fb = inject(FormBuilder);
  private isbnLookupService = inject(IsbnLookupService);
  private ofertasService = inject(OfertasLibroService);
  private librosService = inject(LibrosService);
  private toastService = inject(ToastService);
  private messageService = inject(MessageService);

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
  datosLibroBloqueados = signal(false);
  portadaPreview = signal<string | undefined>(undefined);

  recomendacionForm: FormGroup = this.fb.group({
    isbn: ['', [Validators.required, Validators.pattern(/^[0-9Xx-]{10,20}$/)]],
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    autor: ['', [Validators.required, Validators.minLength(3)]],
    categoria: ['GENERAL', [Validators.required]],
    sinopsis: ['', [Validators.maxLength(700)]],
    precioProveedor: [null, [Validators.required, Validators.min(1)]],
    cantidadProveedor: [null, [Validators.required, Validators.min(1)]],
    libroId: [null],
  });

  contraofertaForm: FormGroup = this.fb.group({
    nuevaCantidad: [null, [Validators.required, Validators.min(1)]],
  });

  ngOnInit(): void {
    this.cargarOfertasRecomendadas();

    this.recomendacionForm.get('isbn')?.valueChanges.subscribe(() => {
      this.isbnVerificado.set(false);
      this.isbnVerificadoValor.set('');
      this.datosLibroBloqueados.set(false);
      this.portadaPreview.set(undefined);
      this.recomendacionForm.patchValue({ libroId: null }, { emitEvent: false });
    });
  }

  cargarOfertasRecomendadas(): void {
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
    this.recomendacionForm.reset({ categoria: 'GENERAL' });
    this.isbnVerificado.set(false);
    this.isbnVerificadoValor.set('');
    this.datosLibroBloqueados.set(false);
    this.portadaPreview.set(undefined);
  }

  buscarDatosDelLibroPorIsbn(): void {
    const isbn = this.normalizarIsbn(this.recomendacionForm.value.isbn);

    this.recomendacionForm.patchValue({ isbn }, { emitEvent: false });
    this.isbn?.markAsTouched();

    if (!isbn || this.isbn?.invalid) {
      this.toastService.error('Ingresa un ISBN valido antes de buscar.');
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
      this.toastService.error('Busca el ISBN antes de guardar la recomendacion.');
      this.isbn?.markAsTouched();
      return;
    }

    if (this.recomendacionForm.invalid) {
      this.recomendacionForm.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    this.ofertasService.crearOferta(this.recomendacionForm.value).subscribe({
      next: () => {
        this.guardando.set(false);
        this.cerrarNuevaRecomendacion();
        this.toastService.created('Recomendacion');
        this.cargarOfertasRecomendadas();
      },
      error: (error) => {
        console.error('Error al crear la recomendacion', error);
        this.guardando.set(false);
        this.toastService.error('No se pudo guardar la recomendacion.');
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
    const oferta = this.ofertaSeleccionada();

    if (!oferta || this.contraofertaForm.invalid) {
      this.contraofertaForm.markAllAsTouched();
      return;
    }

    this.respondiendo.set(true);
    const nuevaCantidad = this.contraofertaForm.value.nuevaCantidad;

    this.ofertasService.contraofertarProveedor(oferta.id, nuevaCantidad).subscribe({
      next: () => {
        this.respondiendo.set(false);
        this.cerrarContraoferta();
        this.toastService.updated('Contraoferta enviada al administrador');
        this.cargarOfertasRecomendadas();
      },
      error: (error) => {
        console.error('Error al enviar contraoferta', error);
        this.respondiendo.set(false);
        this.toastService.error('No se pudo enviar la contraoferta.');
      },
    });
  }

  aceptarCantidadPropuestaPorAdmin(recomendacion: OfertaLibro): void {
    const cantidadAceptada = recomendacion.cantidadAdmin ?? recomendacion.cantidadProveedor;
    this.ofertasService.contraofertarProveedor(recomendacion.id, cantidadAceptada).subscribe({
      next: () => {
        this.toastService.updated('Contraoferta aceptada y enviada al administrador');
        this.cargarOfertasRecomendadas();
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
        this.toastService.error('Oferta rechazada');
        this.cargarOfertasRecomendadas();
      },
      error: (error) => {
        console.error('Error al rechazar la oferta', error);
        this.toastService.error('No se pudo rechazar la oferta.');
      },
    });
  }

  private buscarEnOpenLibrary(isbn: string): void {
    this.isbnLookupService.buscarEnOpenLibrary(isbn).subscribe({
      next: (libro) => {
        this.buscandoIsbn.set(false);

        if (!libro) {
          this.isbnVerificado.set(true);
          this.isbnVerificadoValor.set(isbn);
          this.datosLibroBloqueados.set(false);
          this.messageService.add({
            severity: 'warn',
            summary: 'Sin datos externos',
            detail: 'No se encontro en la base de datos ni en OpenLibrary. Podes completar titulo y autor manualmente.',
            life: 4500,
          });
          return;
        }

        const titulo = [libro.title, libro.subtitle].filter(Boolean).join(': ');
        const autor = libro.authors?.map((item) => item.name).filter(Boolean).join(', ') ?? '';
        const sinopsis = libro.excerpts?.find((item) => item.text)?.text ?? '';

        this.recomendacionForm.patchValue({
          nombre: titulo,
          autor,
          sinopsis,
          libroId: null,
        });
        this.portadaPreview.set(libro.cover?.medium ?? libro.cover?.small ?? libro.cover?.large);
        this.isbnVerificado.set(true);
        this.isbnVerificadoValor.set(isbn);
        this.datosLibroBloqueados.set(true);

        this.messageService.add({
          severity: 'info',
          summary: 'OpenLibrary',
          detail: 'No estaba en la base de datos. Se completaron los datos encontrados en la API.',
          life: 4000,
        });
      },
      error: (error) => {
        console.error('Error al consultar OpenLibrary', error);
        this.buscandoIsbn.set(false);
        this.isbnVerificado.set(true);
        this.isbnVerificadoValor.set(isbn);
        this.datosLibroBloqueados.set(false);
        this.toastService.error('No se pudo consultar OpenLibrary. Completa titulo y autor manualmente.');
      },
    });
  }

  private completarDesdeLibro(libro: Libro): void {
    this.recomendacionForm.patchValue({
      nombre: libro.nombre,
      autor: libro.autor,
      categoria: libro.categoria ?? 'GENERAL',
      sinopsis: libro.sinopsis ?? '',
      libroId: libro.id,
    });
    this.portadaPreview.set(this.isbnLookupService.portadaUrl(libro.isbn));
    this.isbnVerificado.set(true);
    this.isbnVerificadoValor.set(this.normalizarIsbn(libro.isbn));
    this.datosLibroBloqueados.set(true);
  }

  private normalizarIsbn(isbn: string | null | undefined): string {
    return String(isbn ?? '').trim().replace(/[^0-9Xx]/g, '').toUpperCase();
  }

  get isbn() { return this.recomendacionForm.get('isbn'); }
}
