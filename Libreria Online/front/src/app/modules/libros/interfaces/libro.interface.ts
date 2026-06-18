export interface Libro {
  id: number;
  nombre: string;
  isbn: string;
  autor: string;
  precio: number;
  stock: number;

  sinopsis?: string;
  categoria?: string;
}
