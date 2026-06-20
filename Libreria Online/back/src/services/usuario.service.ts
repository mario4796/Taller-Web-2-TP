import { dir } from "node:console";
import type { EmpleadoRepository } from "../repository/empleado.repository.js";
import { UsuarioRepository } from "../repository/usuario.repository.js";

export class UsuarioService {
  constructor(private usuarioRepository: UsuarioRepository) {}

  async obtenerEmpleados() {
    return await this.usuarioRepository.findAllUsuarios();
  }

  async iniciarSesion(email: string, contrasenia: string) {
    const usuario = await this.usuarioRepository.findByEmailAndContrasenia(
      email,
      contrasenia,
    );
    if (usuario != null) {
      return usuario;
    }
  }

  async crearUsuario(
    email: string,
    contrasena: string,
    nombre: string,
    apellido: string,
    direccion: string,
    tipo_usuario: number,
  ) {
    return this.usuarioRepository.createUsuario(
      email,
      contrasena,
      nombre,
      apellido,
      direccion,
      tipo_usuario,
    );
  }
}
