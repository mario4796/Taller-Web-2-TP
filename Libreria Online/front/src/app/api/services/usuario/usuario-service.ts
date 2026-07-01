import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environmets/environmet.development';

interface UsuarioListadoRest {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  direccion: string;
  tipo_usuario_id: number;
  tipo_usuario_descripcion: string;
}

export interface UsuarioListado {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  direccion: string;
  tipoUsuarioId: number;
  tipoUsuarioDescripcion: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  http = inject(HttpClient);

  listUsuarios(): Observable<UsuarioListado[]> {
    return this.http.get<UsuarioListadoRest[]>(`${environment.API_URL}/usuarios`).pipe(
      map((usuarios) =>
        usuarios.map((usuario) => ({
          id: usuario.id,
          email: usuario.email,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          direccion: usuario.direccion,
          tipoUsuarioId: usuario.tipo_usuario_id,
          tipoUsuarioDescripcion: usuario.tipo_usuario_descripcion,
        })),
      ),
    );
  }

  login(datos: { email: string; contrasena: string }): Observable<any> {
    console.log('esto se ejecuto');
    return this.http.post(`${environment.API_URL}/usuarios/iniciarSesion`, datos);
  }

  registrar(datos: any): Observable<any> {
    return this.http.post(`${environment.API_URL}/usuarios/registrarse`, datos);
  }
}
