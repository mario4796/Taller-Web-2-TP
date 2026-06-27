import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/prisma/client.js';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
    await prisma.tiposUsuario.createMany({
        data: [
            { nombre: 'ADMIN' },
            { nombre: 'PROVEEDOR' },
            { nombre: 'COMPRADOR' },
        ],
        skipDuplicates: true,
    });

    const tipoAdmin = await prisma.tiposUsuario.findFirst({ where: { nombre: 'ADMIN' } });

    await prisma.usuarios.upsert({
        where: { email: 'admin@libreria.com' },
        update: {},
        create: {
            email: 'admin@libreria.com',
            contrasena: 'Admin1234',
            nombre: 'Admin',
            apellido: 'Sistema',
            direccion: 'Sin dirección',
            tipo_usuario_id: tipoAdmin!.id,
            Administradores: { create: {} },
        },
    });
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
