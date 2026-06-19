import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Usuario } from '../../../modules/usuario/usuario-component/usuario';
import { UsuarioMapper } from '../usuario/mapping/usuario.mapper';
import { UsuarioRest } from '../usuario/mapping/usuario.interface.rest';

@Injectable({
  providedIn: 'root',
})
export class CompradorService {
}
