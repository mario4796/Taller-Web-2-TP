import { Router } from "express";
import librosRouter from "./libros-router/libros.router.js";
import libroDigitalRouter from "./libro-digital-router/libro-digital.router.js";

export class AppRoutes {

    static get routes(): Router {
        const router = Router();

        router.use("/api/libros", librosRouter);
        router.use("/api/libros-digitales", libroDigitalRouter);

        return router;
    }
}
