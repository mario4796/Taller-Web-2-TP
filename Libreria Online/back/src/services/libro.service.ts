import type { LibroRepository } from '../repository/libro.repository.js';
import { Libro } from '../models/libro.model.js';


export class LibroService {


        constructor(private libroRepository: LibroRepository) {

            }
        async obtenerLibros() {
          return await this.libroRepository.findAllLibros();
        }

        async obtenerLibroPorId(id: number) {
            return await this.libroRepository.findLibroById(id);
        }

        async crearLibro(libro: Libro) {
            const { nombre, isbn, precio, autor, stock, archivoDigital } = libro;

            if (!nombre || !isbn || !autor) {
                throw new Error('Faltan campos obligatorios para crear el libro');
            }

            return await this.libroRepository.createLibro({ nombre, isbn, precio, autor, stock, archivoDigital });
        }

        async actualizarLibro(id: number, data: { nombre: string, isbn: string, precio: number, autor: string }) {

            return await this.libroRepository.updateLibro(id, data);
        }

        async eliminarLibro(id: number) {

            try {
                await this.libroRepository.deleteLibro(id);
                return { message: 'Libro eliminado correctamente' };
            } catch (error:any) {
                if (error.code === 'P2025') {
                    throw new Error('Libro no encontrado. No se pudo eliminar.');
                }
                throw new Error('Error al eliminar el libro: ' + error.message);
            }
        }

}       