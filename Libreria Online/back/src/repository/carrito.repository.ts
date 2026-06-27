import { Libro } from "../models/libro.model";
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

    return await prisma.$transaction(async (tx) => {
      const detalle = await tx.detallesCarrito.upsert({
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

      await tx.carritos.update({
        where: { id: carritoId },
        data: {
          precio_total: { increment: subtotal },
        },
      });

      await tx.libros.update({
        where: { id: libro.id },
        data: {
          stock: { decrement: cantidad },
        },
      });

      return detalle;
    });
  }
  async findCarrito(id: number) {
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

  async findCarritoConDetalles(id: number) {
    const carrito = await prisma.carritos.findUnique({
      where: {
        comprador_id: id,
      },
      include: {
        detalles: {
          include: {
            Libros: true,
          },
        },
      },
    });

    if (!carrito) {
      return null;
    }

    return carrito;
  }

  async findCarritoByIdComprador(compradorId: number, tx: any) {
    return await tx.carritos.findUniqueOrThrow({
      where: { comprador_id: compradorId },
      include: { detalles: { include: { Libros: true } } },
    });
  }

  async limpiarCarrito(carritoId: number, tx: any) {
    await tx.detallesCarrito.deleteMany({ where: { carrito_id: carritoId } });
    await tx.carritos.update({
      where: { id: carritoId },
      data: { precio_total: 0 },
    });
  }
  async eliminarProductoDelCarrito(carritoId: number, libroId: number) {
    return await prisma.$transaction(async (tx) => {
      const detalle = await tx.detallesCarrito.findUnique({
        where: {
          carrito_id_libro_id: {
            carrito_id: carritoId,
            libro_id: libroId,
          },
        },
      });

      if (!detalle) throw new Error("Producto no encontrado en el carrito");

      await tx.detallesCarrito.delete({
        where: {
          carrito_id_libro_id: {
            carrito_id: carritoId,
            libro_id: libroId,
          },
        },
      });

      await tx.carritos.update({
        where: { id: carritoId },
        data: {
          precio_total: { decrement: detalle.precio },
        },
      });

      return { message: "Producto eliminado correctamente" };
    });
  }
}
