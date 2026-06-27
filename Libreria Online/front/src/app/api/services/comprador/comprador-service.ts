import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Carrito } from '../../../modules/carrito/interfaces/carrito.interface';
import { CarritoRest } from './mapping/carrito.interface.rest';
import { environment } from '../../../../environmets/environmet.development';
import { CarritoMapper } from './mapping/carrito.mapper';

@Injectable({
  providedIn: 'root',
})
export class CompradorService {
  http = inject(HttpClient);

  getCarritoUsuario(comprador_id: number): Observable<Carrito> {
    return this.http
      .get<CarritoRest>(`${environment.API_URL}/comprador/carrito/${comprador_id}`) // <-- Sin []
      .pipe(
        map((res) => {
          return CarritoMapper.mapRestCarritoToCarrioFront(res);
        }),
      );
  }

  agregarProductoAlCarrito(datos: {
    comprador_id: number;
    libro_id: number;
    cantidad: number;
  }): Observable<any> {
    return this.http.post(`${environment.API_URL}/comprador/agregarProducto`, datos);
  }

  borrarProducto(datos: { comprador_id: number; libro_id: number }): Observable<any> {
    return this.http.post(`${environment.API_URL}/comprador/borrarProducto`, datos);
  }

  procesarPago(datos: { comprador_id: number; metodo_pago_id: number }): Observable<any> {
    return this.http.post(`${environment.API_URL}/comprador/procesarPago`, datos);
  }
}
