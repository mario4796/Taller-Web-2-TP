
import type { EmpleadoRepository } from "../repository/empleado.repository.js"
import { UsuarioRepository } from "../repository/usuario.repository.js";

export class UsuarioService {


    constructor(private usuarioRepository: UsuarioRepository) { }

    async obtenerEmpleados() {
        return await this.usuarioRepository.findAllUsuarios();
    }

    async iniciarSesion(email: string, contrasenia: string){
       const usuario =  await this.usuarioRepository.findByEmailAndContrasenia(email,contrasenia);
       if(usuario != null){
        return usuario;
       }
    }



}