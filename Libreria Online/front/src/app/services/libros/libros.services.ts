import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

// Ajustá estas rutas según dónde tengas los archivos en tu proyecto
import { Libro } from '../../modules/libros/interfaces/libro.interface';
import { LibroRest } from './mapping/libro.interface.rest';
import { LibroMapper } from './mapping/libro.mapper';
import { environment } from '../../../environmets/environmet.development';

@Injectable({
  providedIn: 'root',
})
export class LibrosService {

  http = inject(HttpClient);

  // Armamos la URL base apuntando a tu backend.
  // Asumo que tu environment.API_URL tiene "http://localhost:3000"
  private apiUrl = `${environment.API_URL}/api/libros`;

  listLibros(): Observable<Libro[]> {
    console.log("Pidiéndole los libros al backend...");


    return this.http.get<LibroRest[]>(this.apiUrl).pipe(
      map((res) => {
        return LibroMapper.mapRestLibroArrayToLibroArrayFront(res);
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

  crearLibro(libro: Libro): Observable<Libro> {
    return this.http.post<any>(this.apiUrl, libro).pipe(
      map((res) => {
        return LibroMapper.mapRestLibrotoLibroFrontU(res.data);
      })
    );
  }


  updateLibro(id: number, libro: Libro): Observable<Libro> {
    return this.http.put<LibroRest>(`${this.apiUrl}/${id}`, libro).pipe(
      map((res) => {
         return LibroMapper.mapRestLibrotoLibroFrontU(res);
      })
    );
  }


  eliminarLibro(id: number): Observable<any> {

    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}
