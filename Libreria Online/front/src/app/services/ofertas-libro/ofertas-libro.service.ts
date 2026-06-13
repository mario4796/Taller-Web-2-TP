import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environmets/environmet.development';
import { NuevaOfertaLibro, OfertaLibro } from '../../modules/proveedor/interfaces/oferta-libro.interface';

interface OfertaLibroRest extends Omit<OfertaLibro, 'precioProveedor'> {
  precioProveedor: number | string;
}

@Injectable({
  providedIn: 'root',
})
export class OfertasLibroService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.API_URL}/api/ofertas`;

  listOfertas(): Observable<OfertaLibro[]> {
    return this.http.get<{ message: string; data: OfertaLibroRest[] }>(this.apiUrl).pipe(
      map((res) => res.data.map((oferta) => this.mapOferta(oferta)))
    );
  }

  crearOferta(oferta: NuevaOfertaLibro): Observable<OfertaLibro> {
    return this.http.post<{ message: string; data: OfertaLibroRest }>(this.apiUrl, oferta).pipe(
      map((res) => this.mapOferta(res.data))
    );
  }

  contraofertarProveedor(id: number, nuevaCantidad: number): Observable<OfertaLibro> {
    return this.http
      .put<{ message: string; data: OfertaLibroRest }>(`${this.apiUrl}/proveedor/contraofertar/${id}`, {
        nuevaCantidad,
      })
      .pipe(map((res) => this.mapOferta(res.data)));
  }

  aceptarOferta(id: number): Observable<OfertaLibro> {
    return this.http
      .put<{ message: string; data: OfertaLibroRest }>(`${this.apiUrl}/aceptar/${id}`, {})
      .pipe(map((res) => this.mapOferta(res.data)));
  }

  private mapOferta(oferta: OfertaLibroRest): OfertaLibro {
    return {
      ...oferta,
      precioProveedor: Number(oferta.precioProveedor),
    };
  }
}
