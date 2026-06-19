import { type Request, type Response } from 'express';
import { UsuariosService } from '../services/usuario.service.ts';
import { UsuarioService } from '../service/usuario.service.ts';
import { UsuarioRepository } from '../repository/usuario.repository.ts';
import { prisma } from "../prisma.js";
import { EmpleadoRepository } from "../repository/empleado.repository.js";
import { EmpleadoService } from "../service/empleado.service.js";


const empleadoRepository = new EmpleadoRepository();
const usuarioRepository = new UsuarioRepository();
const empleadoService = new EmpleadoService(empleadoRepository);
const usuariosService = new UsuariosService(usuarioRepository);
const usuarioService = new UsuarioService(usuarioRepository);

//por ahora hay dos services usuario que hay que juntar

export class UsuarioController {
  constructor() {
  }

  public getProveedores = async (req: Request, res: Response) => {
    try {
      const proveedores = await usuariosService.obtenerProveedores();
      
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


  public getEmpleados = async (req: Request, res: Response) => {
    try {
      const empleados = await empleadoService.obtenerEmpleados();

      console.log(empleados);

      res.status(200).json(empleados);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al obtener los empleados", error });
    }
  };

  public iniciarSesion = async (req: Request, res: Response) => {
    try {
      console.log("Datos recibidos en el Body:", req.body);
      const { email, contrasena } = req.body;

      const usuario = await usuarioService.iniciarSesion(email, contrasena);

      if (!usuario) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }

      res.status(200).json(usuario);
    } catch (error) {
      res.status(500).json({ message: "Error al iniciar sesion", error });
    }
  };

  public crearUsuario = async (req: Request, res: Response) => {
    try {
      console.log("Datos recibidos en el Body:", req.body);
      const { email, contrasena, nombre, apellido, direccion, tipo_usuario } =
        req.body;
      const usuario = await usuarioService.crearUsuario(
        email,
        contrasena,
        nombre,
        apellido,
        direccion,
        tipo_usuario,
      );
      if (!usuario) {
        return res.status(401).json({ message: "Error al crear el usuario" });
      }

      res.status(200).json(usuario);
    } catch (error) {
      res.status(500).json({ message: "Error al crear el usuario ", error });
    }
  };
}
