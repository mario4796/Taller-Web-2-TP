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
        
   
       // 1. Buscar libro
    const libro = await this.libroRepository.findLibroById(libroId);
    if (!libro) {
        throw new Error("El libro no existe.");
    }
    
    // 2. Validar stock (usando tu modelo)
    if (libro.stock < cantidad) {
        throw new Error("No hay stock suficiente.");
    }

    // 3. Buscar carrito
    const carrito = await this.carritoRepository.findCarritoByIdComprador(compradorId);
    
    // 4. Validar existencia estricta (no creamos nada nuevo)
    if (!carrito || !carrito.id) {
        throw new Error("Carrito no encontrado para este comprador.");
    }

    return await this.carritoRepository.agregarLibroAlCarrito(carrito.id, libro, cantidad);
    }
}