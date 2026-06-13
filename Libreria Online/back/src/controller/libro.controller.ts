import { type Request, type Response } from 'express';
import { prisma } from '../prisma.js';

export class LibroController {
    constructor() {
        // Constructor vacío
    }

    
    public getLibros = async (req: Request, res: Response ) => {
        try {

            const libros = await prisma.libros.findMany({});

            res.status(200).json(libros);
    }
    catch (error) {
            res.status(500).json({ error: 'Error al obtener los libros', errorDetails: error });

            }
    }

    
}