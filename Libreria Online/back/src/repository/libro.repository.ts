import { Libro } from "../entities/Libro";
import { prisma } from "../prisma"
import { Prisma } from "../prisma/client"

export class LibroRepository{
    async  findAllEmpleados() {

        const empleados = await prisma.usuarios.findMany();
        
        return empleados;
        
    }

    async  findLibroById(id:number) {

        const libro = await prisma.libros.findUnique({
            where:{
                id:id,
            }
        });

        if (!libro) {
            return null; 
        }
        
        return new Libro(libro);
        
    }
}