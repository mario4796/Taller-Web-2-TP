import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Avatar } from 'primeng/avatar';
import { Button } from 'primeng/button';

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
export class Nav implements OnInit {
  logueado = input(true);
  role = input('');
  userName = input('');
  activeItem = input('');

  isDark = signal(false);
  mobileNavOpen = signal(false);

  navItems = computed(() => this.buildNavItems());

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme');
    const shouldUseDark = savedTheme === 'dark';

    this.isDark.set(shouldUseDark);
    document.documentElement.classList.toggle('app-dark', shouldUseDark);
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

  private buildNavItems(): NavItem[] {
    const activeItem = this.activeItem();

    if (!this.logueado()) {
      return [
        { label: 'Inicio', icon: 'home', active: activeItem === 'Inicio' },
        { label: 'Categorías', icon: 'category', active: activeItem === 'Categorías' },
        { label: 'Ofertas', icon: 'sell', active: activeItem === 'Ofertas' },
      ];
    }

    switch (this.role()) {
      case 'admin':
        return [
          { label: 'Inicio', icon: 'home', link: '/admin', active: activeItem === 'Inicio' },
          { label: 'Usuarios', icon: 'people', active: activeItem === 'Usuarios' },
          { label: 'Libros', icon: 'book', active: activeItem === 'Libros' },
          { label: 'Ofertas', icon: 'sell', link: '/admin/ofertas', active: activeItem === 'Ofertas' },
          { label: 'Stock', icon: 'inventory', active: activeItem === 'Stock' },
          { label: 'Reportes', icon: 'description', active: activeItem === 'Reportes' },
          { label: 'Subastas', icon: 'description', link: '/admin/subastaAdmin', active: activeItem === 'Reportes' },
        ];

      case 'proveedor':
        return [
          { label: 'Inicio', icon: 'home', link: '/proveedor', active: activeItem === 'Inicio' },
          { label: 'Peticiones', icon: 'assignment', active: activeItem === 'Peticiones' },
          { label: 'Estadísticas', icon: 'monitoring', active: activeItem === 'Estadísticas' },
          { label: 'Ventas', icon: 'shopping_cart', active: activeItem === 'Ventas' },
          {
            label: 'Recomendar libro',
            icon: 'auto_stories',
            link: '/proveedor/proveedor-recomendacion',
            active: activeItem === 'Recomendar libro',
          },
        ];

      case 'comprador':
      default:
        return [
          { label: 'Inicio', icon: 'home', active: activeItem === 'Inicio' },
          { label: 'Categorías', icon: 'category', active: activeItem === 'Categorías' },
          { label: 'Ofertas', icon: 'sell', active: activeItem === 'Ofertas' },
          { label: 'Mis pedidos', icon: 'shopping_cart', active: activeItem === 'Mis pedidos' },
        ];
    }
  }
}
