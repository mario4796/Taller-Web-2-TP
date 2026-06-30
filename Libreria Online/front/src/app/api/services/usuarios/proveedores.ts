import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Proveedor, Usuario } from '../../../shared/interfaces/usuario.interface';
import { ProveedorMapper } from '../../mapper/usuarios/usuario.mapper';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class ProveedoresService {
  private http = inject(HttpClient);
  
  // Tu URL real hacia el endpoint que filtre usuarios donde tipo_usuario === 'Proveedor'
  private apiUrl = `${environment.API_URL}/api/proveedor/`; 

    // aceptamos el ISBN opcionalmente y cambiamos el retorno para incluir la sugerencia
  listProveedores(isbn?: string): Observable<{ lista: Proveedor[], sugeridoId: number | null }> {
    
    // Si viene el isbn, lo pegamos como query param: /api/proveedor/?isbn=123456
    const url = isbn ? `${this.apiUrl}?isbn=${isbn}` : this.apiUrl;

    return this.http.get<any>(url).pipe(
      map((res) => {
        return {
          lista: ProveedorMapper.mapRestUsuarioArrayToProveedorArrayFront(res.proveedores || []),
          sugeridoId: res.proveedorSugeridoId || null
        };
      })
    );
  }

}
