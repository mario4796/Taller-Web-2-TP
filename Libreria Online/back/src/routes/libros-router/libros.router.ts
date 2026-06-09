import { Router } from 'express';
import { LibroController } from '../../controller/libro.controller.js';


const librosRouter = Router();

const libroController = new LibroController();

librosRouter.get('/', libroController.getLibros.bind(libroController));

export default librosRouter;