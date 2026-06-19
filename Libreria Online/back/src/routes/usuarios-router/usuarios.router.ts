import { Router } from 'express';
import { UsuarioController } from '../../controller/usuario.controller.js';


const usuarioRouter = Router();

const usuarioController = new UsuarioController();

usuarioRouter.get('/proveedores', usuarioController.getProveedores.bind(usuarioController));


export default usuarioRouter;
