import { CategoriaLibro } from '../prisma/enums';
 
export class Libro {
    id!: number;
    nombre!: string;
    isbn!: string;
    autor!: string;
    precio!: number;
    stock!  : number;
    sinopsis!: string;
    categoria!: CategoriaLibro;
}

