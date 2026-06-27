import type { OfertaLibroRepository } from '../repository/ofertaLibro.repository.js';
import { EstadoOferta } from '../prisma/enums.js';
import { LibroService } from './libro.service.js';
import { OfertaLibro } from '../prisma/client.js';



export class OfertaLibroService {

    constructor(private ofertaLibroRepository: OfertaLibroRepository, private libroService: LibroService) {

    }


    async obtenerOfertas() {
        return await this.ofertaLibroRepository.obtenerTodasLasOfertas();
    }

    async obtenerOfertaPorId(id: number) {
        return await this.ofertaLibroRepository.obtenerOfertaPorId(id);

    }

   async crearOferta(oferta: OfertaLibro) {
        const { isbn, nombre, autor, precioProveedor, cantidadProveedor, libroId, categoria, sinopsis, imagenUrl } = oferta;

        if (!isbn || !nombre || !autor || precioProveedor == null || cantidadProveedor == null || !categoria) {
            throw new Error('Faltan campos obligatorios para crear la oferta');
        }

        if (Number(precioProveedor) <= 0 || Number(cantidadProveedor) <= 0) {
            throw new Error('El precio y la cantidad deben ser mayores a 0');
        }

        return await this.ofertaLibroRepository.crearOferta({ 
            isbn, 
            nombre, 
            autor, 
            precioProveedor: Number(oferta.precioProveedor),
            cantidadProveedor, 
            libroId,
            categoria,
            sinopsis,
            imagenUrl
        });
    }

    async contraofertaAdmin(id: number, nuevaCantidad: number, nuevoPrecio?: number) {
        if (nuevaCantidad <= 0) throw new Error('La cantidad debe ser mayor a 0');
        if (nuevoPrecio !== undefined && nuevoPrecio <= 0) throw new Error('El precio debe ser mayor a 0');

        return await this.ofertaLibroRepository.actualizarOferta(id, {
            cantidadAdmin: nuevaCantidad,
            ...(nuevoPrecio !== undefined ? { precioProveedor: nuevoPrecio } : {}),
            estado: EstadoOferta.ESPERANDO_PROVEEDOR 
        });
    }

    async contraofertaProveedor(id: number, nuevaCantidad: number) {
        if (nuevaCantidad <= 0) throw new Error('La cantidad debe ser mayor a 0');

        return await this.ofertaLibroRepository.actualizarOferta(id, {
            cantidadProveedor: nuevaCantidad,
            estado: EstadoOferta.ESPERANDO_ADMIN
        });
    }

    async aceptarOferta(id: number) {
       
        const oferta = await this.ofertaLibroRepository.obtenerOfertaPorId(id);

        if (!oferta) {
            throw new Error('La oferta no existe');
        }

        let cantidadFinal = 0;

        if (oferta.estado === EstadoOferta.ESPERANDO_ADMIN) {
            cantidadFinal = oferta.cantidadProveedor;

        } else if (oferta.estado === EstadoOferta.ESPERANDO_PROVEEDOR) {
            cantidadFinal = oferta.cantidadAdmin!; 
        } else {
            throw new Error('La oferta ya fue cerrada o no se puede aceptar en este estado');
        }
        const libroExistente = await this.libroService.obtenerLibroPorIsbn(oferta.isbn);

        if (libroExistente) {
            await this.libroService.sumarStock(libroExistente.id, cantidadFinal);
        } else {
            await this.libroService.crearLibro({
                id: 0,
                isbn: oferta.isbn,
                nombre: oferta.nombre,
                autor: oferta.autor,
                precio: oferta.precioProveedor.toNumber(),
                stock: cantidadFinal,
                categoria:oferta.categoria,
                sinopsis: oferta.sinopsis || "",
                imagenUrl: oferta.imagenUrl,
            });
        }

        return await this.ofertaLibroRepository.actualizarOferta(id, {
            estado: EstadoOferta.ACEPTADA 
        });
    }

    async rechazarOferta(id: number) {
        const oferta = await this.ofertaLibroRepository.obtenerOfertaPorId(id);

        if (!oferta) {
            throw new Error('La oferta no existe');
        }

        return await this.ofertaLibroRepository.actualizarOferta(id, {
            estado: EstadoOferta.RECHAZADA
        });
    }

    async eliminarLibro(id: number) {

            try {
                await this.ofertaLibroRepository.eliminarOferta(id);
                return { message: 'Oferta eliminada correctamente' };
            } catch (error:any) {
                if (error.code === 'P2025') {
                    throw new Error('Oferta no encontrada. No se pudo eliminar.');
                }
                throw new Error('Error al eliminar la oferta: ' + error.message);
            }
        }

   
}
