import { Component, inject } from '@angular/core';
import { Libro } from '../../modules/libros/interfaces/libro.interface';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { LibrosService } from '../../services/libros/libros.services';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';

interface ApiResponse {
  message: string;
  data: Libro[];
}

@Component({
  selector: 'app-ver-libros-admin',
  imports: [
    CommonModule,
    TableModule,
    TagModule
  ],
  templateUrl: './ver-libros-admin.html',
  styleUrl: './ver-libros-admin.css',
})
export class VerLibrosAdmin {
  private librosService = inject(LibrosService)
  public cargando = true;
  public errorError: string | null = null;

  public libros = toSignal(
    this.librosService.listLibros().pipe(
      map(listaDeLibros =>{
        this.cargando = false
        return listaDeLibros.sort((a,b) => a.stock - b.stock);
      }),
      catchError(err => {
        console.error(err);
        this.errorError = "No se pudo cargar los libros";
        this.cargando = false;
        return of([]);
      })
    ),
    {initialValue: [] as Libro[]}
  );
  getSeverity(stock: number): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | undefined{
    if (stock === 0) return 'danger';
    if (stock < 10) return 'warn';
    return 'success';
  }
}
