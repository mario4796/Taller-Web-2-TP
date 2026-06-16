import { LibroRest } from "./libro.interface.rest";
import { Libro } from "../../../shared/interfaces/libro.interface";

export class LibroMapper{

  static mapRestLibrotoLibroFrontU(libroRest: LibroRest): Libro {
      return {
        id: libroRest.id,
        nombre: libroRest.nombre,
        isbn: libroRest.isbn,
        autor: libroRest.autor,
        precio: Number(libroRest.precio),
        stock: libroRest.stock,
        sinopsis: libroRest.sinopsis ?? '',
        categoria: libroRest.categoria ?? 'GENERAL',
      }
  }

  static mapRestLibroArrayToLibroArrayFront(librosRest: LibroRest[]): Libro[] {
    return librosRest.map(this.mapRestLibrotoLibroFrontU);
  }

}
