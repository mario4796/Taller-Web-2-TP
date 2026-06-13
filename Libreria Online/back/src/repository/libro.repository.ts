import { prisma } from '../prisma.js';
import { Libro } from '../models/libro.model.js';


export class LibroRepository {


        async findAllLibros() {
        const libros = await prisma.libros.findMany({});

          return libros;
        }

       async findLibroById(id: number): Promise<Libro | null> {
    const data = await prisma.libros.findUnique({ where: { id } });

    if (!data) return null;

    // Mapeo manual para cumplir con tu modelo Libro
    const libro = new Libro();
    libro.id = data.id;
    libro.nombre = data.nombre;
    libro.isbn = data.isbn;
    libro.autor = data.autor;
    libro.precio = Number(data.precio); // Convertimos Decimal a number
    libro.stock = data.stock ?? 0;      // Si es null, ponemos 0
    
    return libro;
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
}