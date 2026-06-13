import { equal } from "node:assert";
import { prisma } from "../prisma"
import { Prisma } from "../prisma/client"

export class UsuarioRepository{
    async  findAllUsuarios() {

        const usuarios = await prisma.usuarios.findMany();
        
        return usuarios;
        
        
    }

    async findByEmailAndContrasenia(email: string, contrasenia: string) {
        const usuario = await prisma.usuarios.findFirst({
         where: {
          email: email,
          contrasena : contrasenia,
            },
        });

        console.log(usuario);

  return usuario;
}
}