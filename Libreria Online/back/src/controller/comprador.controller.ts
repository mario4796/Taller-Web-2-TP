import { type Request, type Response } from "express";
import { prisma } from "../prisma.js";
import { CompradorRepository } from "../repository/comprador.repository.js";

import { CarritoRepository } from "../repository/carrito.repository.js";
import { LibroRepository } from "../repository/libro.repository.js";
import { TransaccionRepository } from "../repository/transaccion.repository.js";
import { CompradorService } from "../services/comprador.service.js";

const compradorRepository = new CompradorRepository();
const carritoRepository = new CarritoRepository();
const libroRepository = new LibroRepository();
const transaccionRepository = new TransaccionRepository();
const compradorService = new CompradorService(
  compradorRepository,
  libroRepository,
  carritoRepository,
  transaccionRepository,
);

export class CompradorController {
  constructor() {}

  public getCompradores = async (req: Request, res: Response) => {
    try {
      const compradores = await compradorService.obtenerCompradores();

      console.log(compradores);

      res.status(200).json(compradores);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al obtener los compradores", error });
    }
  };

  public agregarProductoAlCarrito = async (req: Request, res: Response) => {
    try {
      const { comprador_id, libro_id, cantidad } = req.body;
      const producto = await compradorService.agregarProducto(
        comprador_id,
        libro_id,
        cantidad,
      );

      console.log(producto);

      res.status(200).json(producto);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los producto", error });
    }
  };

  public borrarProductoDelCarrito = async (req: Request, res: Response) => {
    try {
      const { comprador_id, libro_id } = req.body;
      const producto = await compradorService.borrarProducto(
        comprador_id,
        libro_id,
      );

      console.log(producto);

      res.status(200).json(producto);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los producto", error });
    }
  };

  public comprarProductos = async (req: Request, res: Response) => {
    try {
      const { comprador_id, metodo_pago_id } = req.body;
      const compra = await compradorService.procesarAbono(
        comprador_id,
        metodo_pago_id,
      );

      console.log(compra);

      res.status(200).json(compra);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al realizar la transaccion", error });
    }
  };

  public obtenerCarritoComprador = async (req: Request, res: Response) => {
    try {
      const comprador_id: number = Number(req.params.comprador_id);

      if (isNaN(comprador_id)) {
        return res.status(400).json("ID inválido");
      }
      const carrito = await compradorService.obtenerCarrito(comprador_id);

      res.status(200).json(carrito);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al obtener carrito del comprador", error });
    }
  };
}
