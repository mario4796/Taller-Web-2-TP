import { create } from "node:domain";
import { prisma } from "../prisma";
import { Carritos, Prisma } from "../prisma/client";

type CarritoConDetalles = Prisma.CarritosGetPayload<{
  include: { detalles: true };
}>;
export class TransaccionRepository {
  async crear(
    compradorId: number,
    metodoPagoId: number,
    carrito: any,
    tx: any,
  ) {
    return await tx.transacciones.create({
      data: {
        comprador_id: compradorId,
        metodo_pago_id: metodoPagoId,
        monto_total: carrito.precio_total,
        detalles: {
          create: carrito.detalles.map((d: any) => ({
            libro_id: d.libro_id,
            cantidad: d.cantidad,
            precio_unitario: d.precio,
          })),
        },
      },
    });
  }
}
