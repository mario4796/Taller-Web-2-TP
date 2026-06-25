import { LibroRest } from "./libro.interface.rest";
import { Libro } from "../../../modules/libros/interfaces/libro.interface";

export class LibroMapper{

  static mapRestLibrotoLibroFrontU(libroRest: LibroRest): Libro {
      return {
        id: libroRest.id,
        nombre: libroRest.nombre,
        isbn: libroRest.isbn,
        autor: libroRest.autor,
        precio: libroRest.precio,
        stock: libroRest.stock,
        archivoDigital: libroRest.archivoDigital
      }
  }

  static mapRestLibroArrayToLibroArrayFront(librosRest: LibroRest[]): Libro[] {
    return librosRest.map(this.mapRestLibrotoLibroFrontU);
  }

}
