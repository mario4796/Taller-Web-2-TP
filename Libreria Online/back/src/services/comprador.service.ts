import { prisma } from "../prisma.js";
import { CarritoRepository } from "../repository/carrito.repository.js";
import { CompradorRepository } from "../repository/comprador.repository.js";
import { LibroRepository } from "../repository/libro.repository.js";
import { TransaccionRepository } from "../repository/transaccion.repository.js";

export class CompradorService {
  constructor(
    private compradorRepository: CompradorRepository,
    private libroRepository: LibroRepository,
    private carritoRepository: CarritoRepository,
    private transaccionRepository: TransaccionRepository,
  ) {}

  async obtenerCompradores() {
    return await this.compradorRepository.findAllComppradores();
  }
  async obtenerCarrito(comprador_id: number) {
    return await this.carritoRepository.findCarritoConDetalles(comprador_id);
  }

  async agregarProducto(
    compradorId: number,
    libroId: number,
    cantidad: number,
  ) {
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
    const carrito = await this.carritoRepository.findCarrito(compradorId);

    // 4. Validar existencia estricta (no creamos nada nuevo)
    if (!carrito || !carrito.id) {
      throw new Error("Carrito no encontrado para este comprador.");
    }

    return await this.carritoRepository.agregarLibroAlCarrito(
      carrito.id,
      libro,
      cantidad,
    );
  }

  async borrarProducto(compradorId: number, libroId: number) {
    const libro = await this.libroRepository.findLibroById(libroId);
    if (!libro) {
      throw new Error("El libro no existe.");
    }
    const carrito = await this.carritoRepository.findCarrito(compradorId);

    if (!carrito || !carrito.id) {
      throw new Error("Carrito no encontrado para este comprador.");
    }

    return await this.carritoRepository.eliminarProductoDelCarrito(
      carrito.id,
      libro.id,
    );
  }

  async procesarAbono(compradorId: number, metodoPagoId: number) {
    return await prisma.$transaction(async (tx) => {
      const carrito = await this.carritoRepository.findCarritoByIdComprador(
        compradorId,
        tx,
      );

      const transaccion = await this.transaccionRepository.crear(
        compradorId,
        metodoPagoId,
        carrito,
        tx,
      );

      await this.libroRepository.actualizarStockTrasCompra(
        carrito.detalles,
        tx,
      );
      await this.carritoRepository.limpiarCarrito(carrito.id, tx);

      return transaccion;
    });
  }

  private validarStock(carrito: any) {
    if (carrito.detalles.length === 0) throw new Error("El carrito está vacío");

    for (const item of carrito.detalles) {
      if ((item.Libros.stock || 0) < item.cantidad) {
        throw new Error(`Stock insuficiente para: ${item.Libros.nombre}`);
      }
    }
  }
}
