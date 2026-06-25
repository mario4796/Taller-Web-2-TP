import { Component, inject, Input, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Button } from 'primeng/button';
import { Avatar } from 'primeng/avatar';
import { AuthService } from '../../../services/Auth/auth-service';
interface NavItem {
  label: string;
  icon: string;
  active?: boolean;
  link?: string;
}

@Component({
  selector: 'app-nav',
  imports: [CommonModule, Button, Avatar, RouterLink],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav implements OnInit, OnChanges {
  @Input() logueado: boolean = true;
  @Input() role: string = '';
  @Input() userName: string = '';
  @Input() activeItem: string = '';

  isDark = signal(false);
  mobileNavOpen = signal(false);
  private authService = inject(AuthService);

  navItems: NavItem[] = [];

  ngOnInit(): void {
    console.log(localStorage.getItem('role'));
    const savedTheme = localStorage.getItem('theme');
    const shouldUseDark = savedTheme === 'dark';

    this.isDark.set(shouldUseDark);
    document.documentElement.classList.toggle('app-dark', shouldUseDark);

    this.setNavItems();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['logueado'] || changes['role'] || changes['activeItem']) {
      this.setNavItems();
    }
  }

  toggleTheme(): void {
    const newValue = !this.isDark();

    this.isDark.set(newValue);
    document.documentElement.classList.toggle('app-dark', newValue);

    localStorage.setItem('theme', newValue ? 'dark' : 'light');
  }

  toggleMobileNav(): void {
    this.mobileNavOpen.set(!this.mobileNavOpen());
  }

  logout() {
    this.authService.logout();
  }

  private setNavItems(): void {
    if (!this.logueado) {
      this.navItems = [
        { label: 'Inicio', icon: 'home', active: this.activeItem === 'Inicio' },
        { label: 'Categorías', icon: 'category', active: this.activeItem === 'Categorías' },
        { label: 'Ofertas', icon: 'sell', active: this.activeItem === 'Ofertas' },
      ];
      return;
    }

    switch (this.role) {
      case 'admin':
        this.navItems = [
          { label: 'Inicio', icon: 'home', link: '/admin', active: this.activeItem === 'Inicio' },
          { label: 'Usuarios', icon: 'people', active: this.activeItem === 'Usuarios' },
          { label: 'Libros', icon: 'book', active: this.activeItem === 'Libros' },
          {
            label: 'Ofertas',
            icon: 'sell',
            link: '/admin/ofertas',
            active: this.activeItem === 'Ofertas',
          },
          { label: 'Stock', icon: 'inventory', active: this.activeItem === 'Stock' },
          { label: 'Reportes', icon: 'description', active: this.activeItem === 'Reportes' },
        ];
        break;

      case 'proveedor':
        this.navItems = [
          {
            label: 'Mis Recomendaciones',
            icon: 'auto_stories',
            link: '/proveedor',
            active: this.activeItem === 'Mis Recomendaciones' || this.activeItem === 'Inicio',
          },
          { label: 'Peticiones', icon: 'assignment', active: this.activeItem === 'Peticiones' },
          {
            label: 'Estadisticas',
            icon: 'monitoring',
            link: '/proveedor/estadisticas',
            active: this.activeItem === 'Estadisticas',
          },
          { label: 'Ventas', icon: 'shopping_cart', active: this.activeItem === 'Ventas' },
          {
            label: 'Ventas',
            icon: 'shopping_cart',
            link: '/proveedor/ventas',
            active: this.activeItem === 'Ventas'
          }
        ];
        break;

      case 'comprador':
      default:
        this.navItems = [
          { label: 'Inicio', icon: 'home', active: this.activeItem === 'Inicio' },
          { label: 'Categorías', icon: 'category', active: this.activeItem === 'Categorías' },
          { label: 'Ofertas', icon: 'sell', active: this.activeItem === 'Ofertas' },
          {
            label: 'Mis pedidos',
            icon: 'shopping_cart',
            active: this.activeItem === 'Mis pedidos',
          },
        ];
        break;
    }
  }
}
