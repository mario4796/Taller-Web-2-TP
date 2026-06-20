import { type Request, type Response } from "express";
import { prisma } from "../prisma.js";
import { UsuarioService } from "../services/usuario.service.js";

import { UsuarioRepository } from "../repository/usuario.repository.js";
const usuarioRepository = new UsuarioRepository();
const usuarioService = new UsuarioService(usuarioRepository);

export class UsuarioController {
  constructor() {}

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
