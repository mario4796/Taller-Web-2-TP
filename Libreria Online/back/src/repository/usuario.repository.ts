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
        proveedorId: true
      }
    });

    return ofertaPrevia ? ofertaPrevia.proveedorId : null;
  }

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
    const esProveedor = tipo_usuario === 2;
    const relacionPorTipo = esProveedor
      ? {
          Proveedores: {
            create: {},
          },
        }
      : {
          Compradores: {
            create: {
              Carrito: {
                create: {},
              },
            },
          },
        };

    return await prisma.usuarios.create({
      data: {
        email: email,
        contrasena: contrasena,
        nombre: nombre,
        apellido: apellido,
        direccion: direccion,
        tipo_usuario_id: tipo_usuario,
        ...relacionPorTipo,
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
