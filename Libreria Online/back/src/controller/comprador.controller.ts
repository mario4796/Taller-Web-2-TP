import { type Request, type Response } from 'express';
import { prisma } from '../prisma.js';
import { CompradorRepository } from '../repository/comprador.repository.js';
import { CompradorService } from '../services/compradores.service.js';
import { CarritoRepository } from '../repository/carrito.repository.js';
import { LibroRepository } from '../repository/libro.repository.js';

const compradorRepository = new CompradorRepository();
const carritoRepository = new CarritoRepository();
const libroRepository = new LibroRepository();
const compradorService = new CompradorService(compradorRepository,libroRepository,carritoRepository);


export class CompradorController {
    constructor() {
    
    }
    

    public getCompradores = async (req: Request, res: Response) => {
        try {
            const compradores = await compradorService.obtenerCompradores();

            console.log(compradores);


            res.status(200).json(compradores)

        } catch (error) {
            res.status(500).json({ message: "Error al obtener los compradores", error })
        }
    }

    public agregarProductoAlCarrito = async (req: Request, res: Response) =>{

         try {
            const producto = await compradorService.agregarProducto(1,1,1);

            console.log(producto);


            res.status(200).json(producto)

        } catch (error) {
            res.status(500).json({ message: "Error al obtener los producto", error })
        }

    }

}