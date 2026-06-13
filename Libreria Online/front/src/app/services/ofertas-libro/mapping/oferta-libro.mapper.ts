import { OfertaLibro } from "../../../modules/proveedor/interfaces/oferta-libro.interface";
import { OfertaLibroRest } from "./oferta-libro.interface.rest";

export class OfertaLibroMapper {
  static mapRestOfertaToOfertaFront(ofertaRest: OfertaLibroRest): OfertaLibro {
    return {
      ...ofertaRest,
      precioProveedor: Number(ofertaRest.precioProveedor),
    };
  }

  static mapRestOfertaArrayToOfertaArrayFront(ofertasRest: OfertaLibroRest[]): OfertaLibro[] {
    return ofertasRest.map(this.mapRestOfertaToOfertaFront);
  }
}
