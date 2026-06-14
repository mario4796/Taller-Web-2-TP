import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environmets/environmet.development';
import { NuevaOfertaLibro, OfertaLibro } from '../../modules/proveedor/interfaces/oferta-libro.interface';
import { OfertaLibroRest } from './mapping/oferta-libro.interface.rest';
import { OfertaLibroMapper } from './mapping/oferta-libro.mapper';

@Injectable({
  providedIn: 'root',
})
export class OfertasLibroService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.API_URL}/api/ofertas`;

  listOfertas(): Observable<OfertaLibro[]> {
    return this.http.get<{ message: string; data: OfertaLibroRest[] }>(this.apiUrl).pipe(
      map((res) => OfertaLibroMapper.mapRestOfertaArrayToOfertaArrayFront(res.data))
    );
  }

  crearOferta(oferta: NuevaOfertaLibro): Observable<OfertaLibro> {
    return this.http.post<{ message: string; data: OfertaLibroRest }>(this.apiUrl, oferta).pipe(
      map((res) => OfertaLibroMapper.mapRestOfertaToOfertaFront(res.data))
    );
  }

  contraofertarProveedor(id: number, nuevaCantidad: number): Observable<OfertaLibro> {
    return this.http
      .put<{ message: string; data: OfertaLibroRest }>(`${this.apiUrl}/proveedor/contraofertar/${id}`, {
        nuevaCantidad,
      })
      .pipe(map((res) => OfertaLibroMapper.mapRestOfertaToOfertaFront(res.data)));
  }

  aceptarOferta(id: number): Observable<OfertaLibro> {
    return this.http
      .put<{ message: string; data: OfertaLibroRest }>(`${this.apiUrl}/aceptar/${id}`, {})
      .pipe(map((res) => OfertaLibroMapper.mapRestOfertaToOfertaFront(res.data)));
  }
}
