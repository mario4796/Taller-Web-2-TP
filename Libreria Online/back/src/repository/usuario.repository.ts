import { equal } from "node:assert";
import { prisma } from "../prisma";
import { Prisma } from "../prisma/client";

export class UsuarioRepository {
  async findAllUsuarios() {
    const usuarios = await prisma.usuarios.findMany();

    return usuarios;
  }

  async findByEmailAndContrasenia(email: string, contrasenia: string) {
    const usuario = await prisma.usuarios.findFirst({
      where: {
        email: email,
        contrasena: contrasenia,
      },
    });

    console.log(usuario);

    return usuario;
  }

  async createUsuario(
    email: string,
    contrasena: string,
    nombre: string,
    apellido: string,
    direccion: string,
    tipo_usuario: number,
  ) {
    return await prisma.usuarios.create({
      data: {
        email: email,
        contrasena: contrasena,
        nombre: nombre,
        apellido: apellido,
        direccion: direccion,
        tipo_usuario_id: tipo_usuario,
      },
    });
  }

  async createProveedor(id_usuario: number) {
    return await prisma.listaProveedor.create({
      data: {
        usuario_id: id_usuario,
        es_proveedor: false,
      },
    });
  }
}
