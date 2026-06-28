-- CreateTable
CREATE TABLE "Administradores" (
    "usuario_id" INTEGER NOT NULL,

    CONSTRAINT "Administradores_pkey" PRIMARY KEY ("usuario_id")
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
    "archivoDigital" VARCHAR(500),

    CONSTRAINT "Libros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LibroDigitalAdquirido" (
    "id" SERIAL NOT NULL,
    "comprador_id" INTEGER NOT NULL,
    "libro_id" INTEGER NOT NULL,
    "fecha_adquisicion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LibroDigitalAdquirido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proveedores" (
    "usuario_id" INTEGER NOT NULL,

    CONSTRAINT "Proveedores_pkey" PRIMARY KEY ("usuario_id")
);

-- CreateTable
CREATE TABLE "Usuarios" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "contrasena" VARCHAR(255) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "apellido" VARCHAR(100) NOT NULL,
    "direccion" VARCHAR(255) NOT NULL,
    "tipo_usuario" VARCHAR(50) NOT NULL,

    CONSTRAINT "Usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Libros_isbn_key" ON "Libros"("isbn");

-- CreateIndex
CREATE UNIQUE INDEX "LibroDigitalAdquirido_comprador_id_libro_id_key" ON "LibroDigitalAdquirido"("comprador_id", "libro_id");

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_email_key" ON "Usuarios"("email");

-- AddForeignKey
ALTER TABLE "Administradores" ADD CONSTRAINT "Administradores_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Compradores" ADD CONSTRAINT "Compradores_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "LibroDigitalAdquirido" ADD CONSTRAINT "LibroDigitalAdquirido_comprador_id_fkey" FOREIGN KEY ("comprador_id") REFERENCES "Compradores"("usuario_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "LibroDigitalAdquirido" ADD CONSTRAINT "LibroDigitalAdquirido_libro_id_fkey" FOREIGN KEY ("libro_id") REFERENCES "Libros"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Proveedores" ADD CONSTRAINT "Proveedores_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
