import { type Request, type Response } from 'express';
import { UsuarioService } from '../services/usuario.service.ts';
import { UsuarioRepository } from '../repository/usuario.repository.ts';

const usuarioRepository = new UsuarioRepository();
const usuarioService = new UsuarioService(usuarioRepository);

export class UsuarioController {
  constructor() {
  }

  public getProveedores = async (req: Request, res: Response) => {
    try {
      const proveedores = await usuarioService.obtenerProveedores();
      
      res.status(200).json({ 
        message: 'Proveedores obtenidos correctamente', 
        data: proveedores 
      });
    } 
    catch (error) {
      console.error('Error en getProveedores:', error);
      res.status(500).json({ 
        error: 'Error al obtener los proveedores', 
        errorDetails: error 
      });
    }
  };
}