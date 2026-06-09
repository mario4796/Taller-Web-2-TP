import 'dotenv/config';
import express, {type  Request, type  Response } from "express";
import cors from "cors";
import { AppRoutes } from "./routes/routes.js";
import { config } from "./config/config.js";

const app =express();

const port = config.PORT;;

app.use(express.json());

app.use(cors());  

app.use(AppRoutes.routes);

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});

