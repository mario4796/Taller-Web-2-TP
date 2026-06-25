import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

import { Nav } from '../../../../shared/components/nav/nav';
import { LibroDigitalService } from '../../../../services/libro-digital/libro-digital.service';
import { ToastService } from '../../../../services/toast.service';
import { LibroDigitalAdquirido } from '../../../../services/libro-digital/libro-digital.interface';

@Component({
    selector: 'app-libros-digitales',
    standalone: true,
    imports: [CommonModule, Nav, TableModule, ButtonModule, TagModule, ToastModule],
    templateUrl: './libros-digitales.html',
    styleUrl: './libros-digitales.css'
})
export class LibrosDigitales implements OnInit {

    userName = '';
    role = 'comprador';

    librosAdquiridos: LibroDigitalAdquirido[] = [];
    cargando = true;

    private readonly COMPRADOR_ID_MOCK = 1;

    private libroDigitalService = inject(LibroDigitalService);
    private toastService = inject(ToastService);
    private cdr = inject(ChangeDetectorRef);

    ngOnInit(): void {
        this.obtenerLibrosAdquiridos();
    }

    obtenerLibrosAdquiridos(): void {
        this.cargando = true;

        this.libroDigitalService.getLibrosAdquiridos(this.COMPRADOR_ID_MOCK).subscribe({
            next: (data) => {
                this.librosAdquiridos = data;
                this.cargando = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.toastService.error('No se pudieron cargar los libros digitales.');
                this.cargando = false;
                this.cdr.detectChanges();
            }
        });
    }

    abrirPdf(libroId: number): void {
        const url = this.libroDigitalService.getPdfUrl(libroId, this.COMPRADOR_ID_MOCK);
        window.open(url, '_blank');
    }
}
