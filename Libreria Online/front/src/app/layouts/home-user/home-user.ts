import { Component, signal } from '@angular/core';
import { Nav } from '../../shared/components/nav/nav';
import { Home } from '../../shared/components/home/home';

@Component({
  selector: 'app-home-user',
  imports: [Nav, Home],
  templateUrl: './home-user.html',
  styleUrl: './home-user.css',
})
export class HomeUser {
  logueado = signal(false);

  imageBanner = signal('img/libreria_banner_transparente.svg');
  eyebrow = signal('Bienvenido a la Librería Online');
  title = signal('Descubrí tu próximo libro favorito');
  description = signal('Explorá miles de titulos de todos los géneros. leé. aprendé e inspirate.');
  buttonText = signal('Explorar libros');
  buttonLink = signal('Crear cuenta');
}
