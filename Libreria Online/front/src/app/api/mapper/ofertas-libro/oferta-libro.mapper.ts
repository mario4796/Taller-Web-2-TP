import { OfertaLibro } from "../../../shared/interfaces/oferta-libro.interface";
import { OfertaLibroRest } from "./oferta-libro.interface.rest";

export class OfertaLibroMapper {
  static mapRestOfertaToOfertaFront(ofertaRest: OfertaLibroRest): OfertaLibro {
    return {
      ...ofertaRest,
      precioProveedor: Number(ofertaRest.precioProveedor),
      categoria: ofertaRest.categoria ?? 'GENERAL',
      sinopsis: ofertaRest.sinopsis ?? '',
    };
  }

  static mapRestOfertaArrayToOfertaArrayFront(ofertasRest: OfertaLibroRest[]): OfertaLibro[] {
    return ofertasRest.map(this.mapRestOfertaToOfertaFront);
  }
}
