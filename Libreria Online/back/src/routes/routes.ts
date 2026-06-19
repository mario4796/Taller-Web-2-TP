import { Router } from "express";
import librosRouter from "./libros-router/libros.router.js";
import ofertaLibroRouter from "./ofertaLibro-router/ofertaLibro.router.js";
import usuariosRouter from "./usuarios-router/usuarios.router.js";


export class AppRoutes {

    static get routes():Router{
        const router = Router();

        router.use("/api/libros", librosRouter)
        router.use("/api/ofertas", ofertaLibroRouter)
        router.use("/api/usuarios", usuariosRouter)

        return router;
    }
}
