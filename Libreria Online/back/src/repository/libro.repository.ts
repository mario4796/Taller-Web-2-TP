import { prisma } from '../prisma.js';
import { Libro } from '../models/libro.model.js';


export class LibroRepository {


        async findAllLibros() {
        const libros = await prisma.libros.findMany({});

          return libros;
        }

        async findLibroById(id: number) {
            const libro = await prisma.libros.findUnique({
                where: { id : id }
            });

            return libro;
            }

        async findLibroByIsbn(isbn: string) {
            return await prisma.libros.findUnique({
                where: { isbn }
            });
        }

        async createLibro(data: { nombre: string; isbn: string; precio: number; autor: string;  stock: number }){
            return await prisma.libros.create({ data });
        }

        async updateLibro(id: number, data:  { nombre: string; isbn: string; precio: number; autor: string;}) {

            return await prisma.libros.update({
                where: { id },
                data
            });
        }

        async deleteLibro(id: number) {
            return await prisma.libros.delete({
                where: { id }
            });
        }

        async incrementarStock(id: number, cantidad: number) {
            return await prisma.libros.update({
                where: { id },
                data: { stock: { increment: cantidad } }
            });
        }
}
