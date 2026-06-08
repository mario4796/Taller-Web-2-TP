import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Nav } from '../../shared/components/nav/nav';
import { Home } from '../../shared/components/home/home';

@Component({
  selector: 'app-home-user',
  imports: [CommonModule, Nav, Home],
  templateUrl: './home-user.html',
  styleUrl: './home-user.css',
})
export class HomeUser {
  //nav//

  logueado = false;
  //home//

  //imageBanner = 'img/HomeUser-Banner.webp';
  eyebrow = 'Bienvenido a la Librería Online';
  title = 'Descubrí tu próximo libro favorito';
  description = 'Explorá miles de titulos de todos los gégneros. leé. aprendé e inspirate.';
  buttonText = 'Explorar libros';
  buttonLink = 'Crear cuenta';
}
