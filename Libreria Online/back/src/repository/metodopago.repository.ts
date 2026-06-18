import { prisma } from "../prisma.js";

export class MetodoPagoRepository {
  async crearMetodoPago(
    compradorId: number,
    tipo: "TARJETA" | "BILLETERA_VIRTUAL",
    nombreProvider: string,
  ) {
    return await prisma.metodoPago.create({
      data: {
        comprador_id: compradorId,
        tipo: tipo,
        nombre_provider: nombreProvider,
        es_predeterminado: true,
      },
    });
  }

  async findMetodoPagoById(id: number) {
    return await prisma.metodosPago.findUnique({ where: { id } });
  }
}
