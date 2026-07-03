import { error } from "node:console";
import { prisma } from "../prisma.js";

export class UsuarioRepository {
  async obtenerProveedores(): Promise<any[]> {
    const proveedores = await prisma.usuarios.findMany({
      where: {
        tipo_usuario_id: 2,
      },
    });

    return proveedores;
  }
  async obtenerProveedorPrevioPorIsbn(isbn: string): Promise<number | null> {
    const ofertaPrevia = await prisma.ofertaLibro.findFirst({
      where: {
        isbn: isbn,
        // Opcional: podés filtrar por estado si solo querés las 'ACEPTADA'
      },
      select: {
        proveedorId: true,
      },
    });

    return ofertaPrevia ? ofertaPrevia.proveedorId : null;
  }

  async findAllUsuarios() {
    const usuarios = await prisma.usuarios.findMany({
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        direccion: true,
        tipo_usuario_id: true,
        TipoUsuario: {
          select: {
            nombre: true,
          },
        },
      },
    });

    return usuarios.map((usuario) => ({
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      direccion: usuario.direccion,
      tipo_usuario_id: usuario.tipo_usuario_id,
      tipo_usuario_descripcion: usuario.TipoUsuario.nombre,
    }));
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
    const esProveedor = tipo_usuario === 2;
    const relacionPorTipo = esProveedor
      ? { Proveedores: { create: {} } }
      : { Compradores: { create: { Carrito: { create: {} } } } };

    try {
      return await prisma.usuarios.create({
        data: {
          email,
          contrasena,
          nombre,
          apellido,
          direccion,
          tipo_usuario_id: tipo_usuario,
          ...relacionPorTipo,
        },
      });
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new Error("El correo electrónico ya se encuentra registrado.");
      }
      throw error;
    }
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
