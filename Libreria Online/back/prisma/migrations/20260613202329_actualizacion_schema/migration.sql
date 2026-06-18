-- CreateEnum
CREATE TYPE "EstadoOferta" AS ENUM ('ESPERANDO_ADMIN', 'ESPERANDO_PROVEEDOR', 'ACEPTADA', 'RECHAZADA');

-- CreateTable
CREATE TABLE "OfertaLibro" (
    "id" SERIAL NOT NULL,
    "isbn" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "precioProveedor" DECIMAL(10,2) NOT NULL,
    "cantidadProveedor" INTEGER NOT NULL,
    "cantidadAdmin" INTEGER,
    "estado" "EstadoOferta" NOT NULL DEFAULT 'ESPERANDO_ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "libroId" INTEGER,

    CONSTRAINT "OfertaLibro_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OfertaLibro" ADD CONSTRAINT "OfertaLibro_libroId_fkey" FOREIGN KEY ("libroId") REFERENCES "Libros"("id") ON DELETE SET NULL ON UPDATE CASCADE;
