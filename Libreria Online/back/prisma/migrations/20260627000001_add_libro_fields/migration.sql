-- Add sinopsis, imagenUrl, categoria columns to Libros if they don't exist

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Libros' AND column_name='sinopsis') THEN
    ALTER TABLE "Libros" ADD COLUMN "sinopsis" TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Libros' AND column_name='imagenUrl') THEN
    ALTER TABLE "Libros" ADD COLUMN "imagenUrl" TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Libros' AND column_name='categoria') THEN
    -- Create enum if not exists
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'CategoriaLibro') THEN
      CREATE TYPE "CategoriaLibro" AS ENUM ('FICCION', 'FANTASIA', 'TERROR', 'HISTORIA', 'INFANTIL', 'GENERAL');
    END IF;
    ALTER TABLE "Libros" ADD COLUMN "categoria" "CategoriaLibro" NOT NULL DEFAULT 'GENERAL';
  END IF;
END $$;
