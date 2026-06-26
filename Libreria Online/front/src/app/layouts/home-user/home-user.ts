import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Nav } from '../../shared/components/nav/nav';
import { Home } from '../../shared/components/home/home';
import { AuthService } from '../../services/Auth/auth-service';

@Component({
  selector: 'app-home-user',
  imports: [CommonModule, Nav, Home],
  templateUrl: './home-user.html',
  styleUrl: './home-user.css',
})
export class HomeUser {
  private authService = inject(AuthService);

  logueado = computed(() => this.authService.tipoUsuario() !== null);

  imageBanner = 'img/libreria_banner_transparente.svg';
  eyebrow = 'Bienvenido a la Librería Online';
  title = 'Descubrí tu próximo libro favorito';
  description = 'Explorá miles de titulos de todos los gégneros. leé. aprendé e inspirate.';
  buttonText = 'Explorar libros';
  buttonLink = 'Crear cuenta';
}
