import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Nav } from '../../../../shared/components/nav/nav';
import { Home } from '../../../../shared/components/home/home';

// 1. Imports de PrimeNG para la tabla
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

// 2. Importamos el componente de la ventanita (subimos dos niveles y entramos a components)
import { AgregarLibro } from '../../components/agregar-libro/agregar-libro';

// 3. Importamos tu servicio y la interfaz (ajustando las rutas hacia arriba)
import { LibrosService } from '../../../../services/libros/libros.services';
import { Libro } from '../../../libros/interfaces/libro.interface';

@Component({
  selector: 'app-proveedor-home',
  standalone: true,
  imports: [
    CommonModule,
    Nav,
    Home,
    // Agregamos los nuevos módulos acá
    AgregarLibro,
    TableModule,
    ButtonModule
  ],
  templateUrl: './proveedor-home.html',
  styleUrls: ['./proveedor-home.css'] // Corregido a styleUrls (con 's' al final)
})
export class ProveedorHome implements OnInit {
  // --- Variables originales de tu compañero ---
  userName = 'María Rodríguez';
  role = 'proveedor';
  eyebrow: string = 'Panel del proveedor';
  title: string = 'Bienvenido al panel de control del proveedor';
  description: string = 'Desde aquí puedes gestionar tus productos, pedidos y estadísticas de ventas.';
  buttonText: string = 'Ver mis productos';
  buttonLink: string = 'Recomendar un libro';

  // --- Nuestras variables para la tabla ---
  libros: Libro[] = [];
  cargando: boolean = true;

  // Inyectamos el servicio
  constructor(private librosService: LibrosService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.obtenerLibros();
  }

  obtenerLibros() {
    this.cargando = true;
    this.librosService.listLibros().subscribe({
      next: (data) => {
        console.log('Libros obtenidos de la BD:', data);
        this.libros = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Error al traer los libros', error);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }
}
