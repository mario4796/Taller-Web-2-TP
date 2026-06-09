import { Router } from "express";
import librosRouter from "./libros-router/libros.router.js";

export class AppRoutes {

    static get routes():Router{
        const router = Router();

        router.use("/api/libros", librosRouter)

        return router;
    }
}