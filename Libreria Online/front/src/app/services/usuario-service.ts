import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  usuarios: any[] = [];
  constructor(){}
  agregarUsuario(usuario: any ) : void {
    this.usuarios.push(usuario);
    console.log('Usuario agregado:' , usuario);
    console.log('DB temp actualizado:' , this.usuarios );
  }

  
}
