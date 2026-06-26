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
  private apiUrl = `${environment.API_URL}/api/usuarios/proveedores`; 

  listProveedores(): Observable<Proveedor[]> {
    console.log("Pidiéndole los proveedores de la BD a Prisma...");

    return this.http.get<{ message: string, data: Usuario[] }>(this.apiUrl).pipe(
      map((res) => {
        console.log('✅ [GET] Proveedores de la base de datos mapeados:');
        return ProveedorMapper.mapRestUsuarioArrayToProveedorArrayFront(res.data);
      })
    );
  }

}
