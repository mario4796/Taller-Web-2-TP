import { Libro } from '../../libros/interfaces/libro.interface';

export interface DetalleCarrito {
  id: number;
  carrito_id: number;
  libro_id: number;
  cantidad: number;
  precio: number;
  Libros: Libro;
}
