import { Libro } from '../../../../modules/libros/interfaces/libro.interface';
import { LibroRest } from '../../../../services/libros/mapping/libro.interface.rest';

export interface DetalleCarritoRest {
  id: number;
  carrito_id: number;
  libro_id: number;
  cantidad: number;
  precio: number;
  Libros: Libro;
}
