import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { Libro } from '../../modules/libros/interfaces/libro.interface';
import { LibroRest } from './mapping/libro.interface.rest';
import { LibroMapper } from './mapping/libro.mapper';
import { environment } from '../../../environmets/environmet.development';

@Injectable({
  providedIn: 'root',
})
export class LibrosService {

  http = inject(HttpClient);

  private apiUrl = `${environment.API_URL}/api/libros`;

  listLibros(): Observable<Libro[]> {
    console.log("Pidiéndole los libros al backend...");

    return this.http.get<{ message: string, data: LibroRest[] }>(this.apiUrl).pipe(
      map((res) => {
        console.log('✅ [GET] Datos mapeados con éxito:');
        return LibroMapper.mapRestLibroArrayToLibroArrayFront(res.data);
      })
    );
  }

  detailLibro(id: number): Observable<Libro> {
    return this.http.get<LibroRest>(`${this.apiUrl}/${id}`).pipe(
      map((res) => {
        return LibroMapper.mapRestLibrotoLibroFrontU(res);
      })
    );
  }

  crearLibro(libro: Omit<Libro, 'id'>): Observable<Libro> {
    return this.http.post<any>(this.apiUrl, libro).pipe(
      map((res) => {
        return LibroMapper.mapRestLibrotoLibroFrontU(res.data);
      })
    );
  }


  updateLibro(id: number, libro: Omit<Libro, 'id' | 'stock'>): Observable<Libro> {
    return this.http.put<{ message: string, data: LibroRest }>(`${this.apiUrl}/${id}`, libro).pipe(
      map((res) => {
         return LibroMapper.mapRestLibrotoLibroFrontU(res.data);
      })
    );
  }


  eliminarLibro(id: number): Observable<any> {

    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}
