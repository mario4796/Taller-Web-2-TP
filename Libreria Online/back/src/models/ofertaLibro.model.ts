import { Decimal } from "@prisma/client/runtime/client";
import { EstadoOferta, CategoriaLibro } from "../prisma/enums";

export class OfertaLibro {
  id!: number;
  isbn!: string;
  nombre!: string;
  autor!: string;
  precioProveedor!: Decimal;
  cantidadAdmin!: number;
  cantidadProveedor!: number;
  estado!: EstadoOferta;
  createdAt!: Date;
  libroId?: number | null;
  sinopsis!: string;
  categoria!: CategoriaLibro;
}
