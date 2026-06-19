import { prisma } from '../prisma.js';
import { Usuario } from '../models/usuario.model.js';

export class UsuarioRepository {
    async obtenerProveedores(): Promise<any[]> {
        
        const proveedores = await prisma.usuarios.findMany({
            where: {
                tipo_usuario: 'PROVEEDOR' 
            }
        });

        return proveedores;
    }
}