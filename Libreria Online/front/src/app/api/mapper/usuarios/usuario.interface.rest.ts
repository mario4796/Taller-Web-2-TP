export interface Proveedor{
  id: number;       
  email: string;
  nombre: string;
  apellido: string; 
  tipoUsuario: string;
}

export interface Usuario {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  tipo_usuario: string; 
}