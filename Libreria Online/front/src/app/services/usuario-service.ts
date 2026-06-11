import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {

  usuarios: any[] = [
    {
      nombre: "qweqw",
      apellido: "qweq",
      direccion: "wqeqw",
      email: "ejemplo@gmail.com",
      password: "Pepepica2"
    }
  ];
  constructor(){}
  agregarUsuario(usuario: any ) : void {
    this.usuarios.push(usuario);
    console.log('Usuario agregado:' , usuario);
    console.log('DB temp actualizado:' , this.usuarios );
  }
  emailRepetido(nuevoUsuario: any): { exito: boolean, mensaje: string } {
    const existeEmail = this.usuarios.some(user => user.email === nuevoUsuario.email);
    if (existeEmail){
      return {
        exito: false,
        mensaje: "correo dentro de DB, normalmente no se debe decir esta info por seguridad "
      }
    }
    return { 
      exito: true, 
      mensaje: "" 
    };
  }
  
  login(emailForm: string, passwordForm: string) {
    const usuarioEncontrado = this.usuarios.find(
      user => user.email === emailForm && user.password === passwordForm
    );
    
    return usuarioEncontrado;
  }

  
}
