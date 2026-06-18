import { OfertaLibro } from "../../../modules/proveedor/interfaces/oferta-libro.interface";

export interface OfertaLibroRest extends Omit<OfertaLibro, 'precioProveedor'> {
  precioProveedor: number | string;
}
