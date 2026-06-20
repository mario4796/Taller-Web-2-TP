import { Router } from "express";
import librosRouter from "./libros-router/libros.router.js";
import ofertaLibroRouter from "./ofertaLibro-router/ofertaLibro.router.js";
import usuarioRouter from "./usuario-router/usuario.router.js";
import compradorRouter from "./compradores-router/compradores.router.js";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.use("/api/libros", librosRouter);
    router.use("/api/ofertas", ofertaLibroRouter);
    router.use("/api/usuarios", usuarioRouter);

    router.use("/api/comprador", compradorRouter);

    return router;
  }
}
