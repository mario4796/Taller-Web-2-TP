export enum EstadoOferta {
    ESPERANDO_ADMIN = 'ESPERANDO_ADMIN',
    ESPERANDO_PROVEEDOR = 'ESPERANDO_PROVEEDOR',
    ACEPTADA = 'ACEPTADA',
    RECHAZADA = 'RECHAZADA'
}


export class OfertaLibro {
    id!: number;
    isbn!: string;
    nombre!: string;
    autor!: string;
    precioProveedor!: number;
    cantidadAdmin!: number;
    cantidadProveedor!: number;
    estado!: EstadoOferta;
    createdAt!: Date;
    libroId?: number | null; 
}