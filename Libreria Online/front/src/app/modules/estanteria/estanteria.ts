import { Component, inject, OnInit, signal } from '@angular/core';


import { DataViewModule } from 'primeng/dataview';

import { LibrosService } from '../../services/libros/libros.services';
import { LibroEstanteria } from '../libro-estanteria/libro-estanteria';
import { Libro } from '../libros/interfaces/libro.interface';

@Component({
  selector: 'app-estanteria',
  standalone:true,
  imports: [LibroEstanteria,DataViewModule],
  templateUrl: './estanteria.html',
  styleUrl: './estanteria.css',
})
export class Estanteria implements OnInit {

  libroService = inject(LibrosService);
   libros = signal<Libro[]>([]);
  ngOnInit(): void {

    this.cargarLibros();
    
  }

  cargarLibros(){
    this.libroService.listLibros().subscribe({
      next: (data) => {console.log("Lo que recibí del servicio:", data); // <-- MIRÁ ESTO EN LA CONSOLA
      this.libros.set(data);},
      error: (err) => console.error(err)
    })
  }


}

