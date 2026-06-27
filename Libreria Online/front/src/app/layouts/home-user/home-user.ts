import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Nav } from '../../shared/components/nav/nav';
import { Home } from '../../shared/components/home/home';
import { CarouselModule, CarouselResponsiveOptions } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { Libro } from '../../shared/interfaces/libro.interface';
import { LibrosService } from '../../api/services/libros/libros.services';
import { Card } from 'primeng/card';
import { AuthService } from '../../services/Auth/auth-service';

@Component({
  selector: 'app-home-user',
  standalone: true,
  imports: [CommonModule, Nav, Home, CarouselModule, ButtonModule],
  templateUrl: './home-user.html',
  styleUrl: './home-user.css',
})
export class HomeUser {
  libroService = inject(LibrosService);
  libros = signal<Libro[]>([]);
  private authService = inject(AuthService);

  logueado = computed(() => this.authService.tipoUsuario() !== null);

  // Propiedades del banner
  imageBanner = 'img/libreria_banner_transparente.svg';
  eyebrow = 'Bienvenido a la Librería Online';
  title = 'Descubrí tu próximo libro favorito';
  description = 'Explorá miles de títulos de todos los géneros. Leé, aprendé e inspirate.';
  buttonText = 'Explorar libros';
  buttonLink = 'Crear Cuenta';
  rutaExplorar = '/libros';

  ngOnInit(): void {
    this.verificarLogin();
    this.cargarLibrosDestacados();
  }

  verificarLogin() {
    this.logueado = !!localStorage.getItem('usuario');
  }

  cargarLibrosDestacados() {
    this.libroService.listLibros().subscribe({
      next: (data) => {
        console.log('DATA:', data);
        this.libros.set(data);

        console.log('SIGNAL:', this.libros());
      },
      error: (err) => {
        console.error('❌ Error al cargar libros:', err);
      },
    });
  }

  responsiveOptions = [
    {
      breakpoint: '1400px',
      numVisible: 4,
      numScroll: 1,
    },
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 1,
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1,
    },
  ];
}
