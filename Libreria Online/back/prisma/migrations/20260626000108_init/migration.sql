-- CreateEnum
CREATE TYPE "TipoMetodoPago" AS ENUM ('TARJETA', 'BILLETERA_VIRTUAL');

-- CreateEnum
CREATE TYPE "EstadoOferta" AS ENUM ('ESPERANDO_ADMIN', 'ESPERANDO_PROVEEDOR', 'ACEPTADA', 'RECHAZADA');

-- CreateEnum
CREATE TYPE "CategoriaLibro" AS ENUM ('FICCION', 'FANTASIA', 'TERROR', 'HISTORIA', 'INFANTIL', 'GENERAL');

-- CreateTable
CREATE TABLE "Administradores" (
    "usuario_id" INTEGER NOT NULL,

    CONSTRAINT "Administradores_pkey" PRIMARY KEY ("usuario_id")
);

-- CreateTable
CREATE TABLE "MetodosPago" (
    "id" SERIAL NOT NULL,
    "comprador_id" INTEGER NOT NULL,
    "tipo" "TipoMetodoPago" NOT NULL,
    "nombre_provider" VARCHAR(100) NOT NULL,
    "token_externo" VARCHAR(255),
    "es_predeterminado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MetodosPago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Compradores" (
    "usuario_id" INTEGER NOT NULL,

    CONSTRAINT "Compradores_pkey" PRIMARY KEY ("usuario_id")
);

-- CreateTable
CREATE TABLE "Libros" (
    "id" SERIAL NOT NULL,
    "isbn" VARCHAR(20) NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "autor" VARCHAR(255) NOT NULL,
    "precio" DECIMAL(10,2) NOT NULL,
    "stock" INTEGER DEFAULT 0,
    "estado" VARCHAR(50) DEFAULT 'DISPONIBLE',
    "sinopsis" TEXT,
    "categoria" "CategoriaLibro" NOT NULL DEFAULT 'GENERAL',

    CONSTRAINT "Libros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proveedores" (
    "usuario_id" INTEGER NOT NULL,

    CONSTRAINT "Proveedores_pkey" PRIMARY KEY ("usuario_id")
);

-- CreateTable
CREATE TABLE "TiposUsuario" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,

    CONSTRAINT "TiposUsuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListaProveedor" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "es_proveedor" BOOLEAN NOT NULL DEFAULT false,
    "fecha_solicitud" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListaProveedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuarios" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "contrasena" VARCHAR(255) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "apellido" VARCHAR(100) NOT NULL,
    "direccion" VARCHAR(255) NOT NULL,
    "tipo_usuario_id" INTEGER NOT NULL,

    CONSTRAINT "Usuarios_pkey" PRIMARY KEY ("id")
);

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
    "sinopsis" TEXT,
    "categoria" "CategoriaLibro" NOT NULL DEFAULT 'GENERAL',
    "libroId" INTEGER,

    CONSTRAINT "OfertaLibro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Carritos" (
    "id" SERIAL NOT NULL,
    "comprador_id" INTEGER NOT NULL,
    "precio_total" DECIMAL(10,2) NOT NULL DEFAULT 0.00,

    CONSTRAINT "Carritos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetallesCarrito" (
    "id" SERIAL NOT NULL,
    "carrito_id" INTEGER NOT NULL,
    "libro_id" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "precio" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "DetallesCarrito_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MetodosPago_comprador_id_idx" ON "MetodosPago"("comprador_id");

-- CreateIndex
CREATE UNIQUE INDEX "Libros_isbn_key" ON "Libros"("isbn");

-- CreateIndex
CREATE UNIQUE INDEX "TiposUsuario_nombre_key" ON "TiposUsuario"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "ListaProveedor_usuario_id_key" ON "ListaProveedor"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_email_key" ON "Usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Carritos_comprador_id_key" ON "Carritos"("comprador_id");

-- CreateIndex
CREATE UNIQUE INDEX "DetallesCarrito_carrito_id_libro_id_key" ON "DetallesCarrito"("carrito_id", "libro_id");

-- AddForeignKey
ALTER TABLE "Administradores" ADD CONSTRAINT "Administradores_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "MetodosPago" ADD CONSTRAINT "MetodosPago_comprador_id_fkey" FOREIGN KEY ("comprador_id") REFERENCES "Compradores"("usuario_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compradores" ADD CONSTRAINT "Compradores_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Proveedores" ADD CONSTRAINT "Proveedores_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ListaProveedor" ADD CONSTRAINT "ListaProveedor_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuarios" ADD CONSTRAINT "Usuarios_tipo_usuario_id_fkey" FOREIGN KEY ("tipo_usuario_id") REFERENCES "TiposUsuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfertaLibro" ADD CONSTRAINT "OfertaLibro_libroId_fkey" FOREIGN KEY ("libroId") REFERENCES "Libros"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Carritos" ADD CONSTRAINT "Carritos_comprador_id_fkey" FOREIGN KEY ("comprador_id") REFERENCES "Compradores"("usuario_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetallesCarrito" ADD CONSTRAINT "DetallesCarrito_carrito_id_fkey" FOREIGN KEY ("carrito_id") REFERENCES "Carritos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetallesCarrito" ADD CONSTRAINT "DetallesCarrito_libro_id_fkey" FOREIGN KEY ("libro_id") REFERENCES "Libros"("id") ON DELETE CASCADE ON UPDATE CASCADE;
