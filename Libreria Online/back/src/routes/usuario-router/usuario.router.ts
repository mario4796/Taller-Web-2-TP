import { Router } from "express";
import { UsuarioController } from "../../controller/usuario.controller.js";

const usuarioRouter = Router();

const usuarioController = new UsuarioController();

usuarioRouter.get("/", usuarioController.getEmpleados.bind(usuarioController));
usuarioRouter.get('/proveedores', usuarioController.getProveedores.bind(usuarioController));
usuarioRouter.post(
  "/iniciarSesion",
  usuarioController.iniciarSesion.bind(usuarioController),
);
usuarioRouter.post(
  "/registrarse",
  usuarioController.crearUsuario.bind(usuarioController),
);

export default usuarioRouter;
