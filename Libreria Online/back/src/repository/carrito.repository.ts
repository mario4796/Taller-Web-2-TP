import { Libro } from "../entities/Libro";
import { prisma } from "../prisma";
import { Prisma } from "../prisma/client";

export class CarritoRepository {
  async findCarritoByID(id: number) {
    const carrito = await prisma.carritos.findUnique({
      where: {
        id: id,
      },
    });

    return carrito;
  }
  async agregarLibroAlCarrito(
    carritoId: number,
    libro: Libro,
    cantidad: number,
  ) {
    const subtotal = Number(libro.precio) * cantidad;

    return await prisma.detallesCarrito.upsert({
      where: {
        carrito_id_libro_id: {
          carrito_id: carritoId,
          libro_id: libro.id,
        },
      },
      update: {
        cantidad: { increment: cantidad },
        precio: { increment: subtotal },
      },
      create: {
        carrito_id: carritoId,
        libro_id: libro.id,
        cantidad: cantidad,
        precio: subtotal,
      },
    });
  }

  async findCarritoByIdComprador(id: number) {
    const carrito = await prisma.carritos.findUnique({
      where: {
        comprador_id: id,
      },
    });

    if (!carrito) {
      return null;
    }

    return carrito;
  }
}
