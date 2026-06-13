import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Usuario } from '../../../modules/usuario/usuario-component/usuario';
import { UsuarioRest } from './mapping/usuario.interface.rest';
import { environment } from '../../../enviroments/enviroments.development';
import { UsuarioMapper } from './mapping/usuario.mapper';
import { UsuarioPrueba } from '../../../modules/usuario/usuario.interface';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
    http = inject(HttpClient);

  listUsuarios(): Observable<UsuarioPrueba[]> {
    console.log("entro al servicio");
    
  
    return this.http.get<UsuarioRest[]>(`${environment.API_URL}/usuarios`).pipe(
      map((res) => {
        return UsuarioMapper.mapRestUsuarioArrayToUsuarioArrayFront(res);
      })
    ); 
  }

  login(datos: {email:string, contrasena:string}): Observable<any>{
    console.log("esto se ejecuto");
    return this.http.post(`${environment.API_URL}/usuarios/iniciarSesion`, datos);

  }
}

  
    