import { Decimal } from "@prisma/client/runtime/client";

export class Libro {
  id: number;
  isbn: string;
  nombre: string;
  autor: string;
  precio: Decimal;
  stock: number;
  estado: string;

  constructor(datos: { id: number, isbn: string, nombre: string, autor: string, precio: Decimal, stock: number | null, estado: string | null }) {
    this.id = datos.id;
    this.isbn = datos.isbn;
    this.nombre = datos.nombre;
    this.autor = datos.autor;
    this.precio = (datos.precio); 
    this.stock = datos.stock ?? 0;
    this.estado = datos.estado ?? 'DISPONIBLE';
  }


  tieneStockDisponible(cantidadRequerida: number): boolean {
    return this.stock >= cantidadRequerida && this.estado === 'DISPONIBLE';
  }
}