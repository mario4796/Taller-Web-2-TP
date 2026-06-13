import { prisma } from '../prisma.js';
import { EstadoOferta } from '../models/ofertaLibro.model.js';

export class OfertaLibroRepository {
    
    async crearOferta(data: {nombre: string; isbn: string; autor: string; precioProveedor: number; cantidadProveedor: number; libroId?: number | null}) {
        return await prisma.ofertaLibro.create({ data });
    }

    async obtenerOfertaPorId(id: number) {
            const oferta = await prisma.ofertaLibro.findUnique({
                where: { id : id }
            });

            return oferta;
            }

    async obtenerTodasLasOfertas() {
        const ofertas = await prisma.ofertaLibro.findMany({
  
            include: {
                Libro: true 
            }
        });
        return ofertas;
    }

    async actualizarOferta(id: number, data: { 
    cantidadProveedor?: number; 
    cantidadAdmin?: number; 
    estado?: EstadoOferta; 
    }) {
    return await prisma.ofertaLibro.update({
        where: { id },
        data
    });
    }   

         async eliminarOferta(id: number) {
        return await prisma.ofertaLibro.delete({    
            where: { id: id }
        });
    }

    /*
    async obtenerOfertasPorProveedor(proveedorId: number) {
        return await prisma.ofertaLibro.findMany({
            where: { proveedorId: proveedorId },
            include: { Libro: true } 
        });
    }*/
}
