import { Router } from 'express';
import { UsuarioController } from '../../controller/usuario.controller.js';
import { CompradorController } from '../../controller/comprador.controller.js';


const compradorRouter = Router();

const compradorController = new CompradorController();

compradorRouter.get('/', compradorController.getCompradores.bind(compradorController));

compradorRouter.get('/comprar', compradorController.agregarProductoAlCarrito.bind(compradorController));

export default compradorRouter;