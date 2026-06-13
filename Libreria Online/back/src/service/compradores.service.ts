import { CarritoRepository } from "../repository/carrito.repository.js";
import { CompradorRepository } from "../repository/comprador.repository.js";
import { LibroRepository } from "../repository/libro.repository.js";

export class CompradorService {

    constructor(
        private compradorRepository: CompradorRepository, 
        private libroRepository: LibroRepository, 
        private carritoRepository: CarritoRepository
    ) { }

    async obtenerCompradores() {
        return await this.compradorRepository.findAllComppradores();
    }

    async agregarProducto(compradorId: number, libroId: number, cantidad: number) {
        
        // 1. Busco el libro para saber el precio y si hay stock disponible
        const libro = await this.libroRepository.findLibroById(libroId);
        if (!libro || libro.stock < cantidad) {
            throw new Error("No hay stock suficiente o el libro no existe");
        }

        // 2. Busco el carrito del comprador
        let carrito = await this.carritoRepository.findCarritoByIdComprador(compradorId);
        

        // Control de seguridad extra para TypeScript
        if (carrito?.id === undefined) {
            throw new Error("Error crítico: El carrito no posee un ID válido.");
        }

        // 3. Agrego el libro al carrito (Ya no usamos 'carrito?.id' sino 'carrito.id' seguro)
        return await this.carritoRepository.agregarLibroAlCarrito(carrito.id, libro, cantidad);
    }
}