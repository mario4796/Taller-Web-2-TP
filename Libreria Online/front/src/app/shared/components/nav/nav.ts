import { Component, Input, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Button } from 'primeng/button';
import { Avatar } from 'primeng/avatar';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { InputText } from 'primeng/inputtext';

interface NavItem {
  label: string;
  icon: string;
  active?: boolean;
  link?: string;
}

@Component({
  selector: 'app-nav',
  imports: [CommonModule, Button, Avatar, InputGroup, InputGroupAddon, InputText, RouterLink],
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

  navItems: NavItem[] = [];

  ngOnInit(): void {
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

  private setNavItems(): void {
  if (!this.logueado) {
    this.navItems = [
      { label: 'Inicio', icon: 'home', active: this.activeItem === 'Inicio' },
      { label: 'Categorías', icon: 'category', active: this.activeItem === 'Categorías' },
      { label: 'Ofertas', icon: 'sell', active: this.activeItem === 'Ofertas' }
    ];
    return;
  }

  switch (this.role) {
    case 'admin':
      this.navItems = [
        { label: 'Inicio', icon: 'home', active: this.activeItem === 'Inicio' },
        { label: 'Usuarios', icon: 'people', active: this.activeItem === 'Usuarios' },
        { label: 'Libros', icon: 'book', active: this.activeItem === 'Libros' },
        { label: 'Stock', icon: 'inventory', active: this.activeItem === 'Stock' },
        { label: 'Reportes', icon: 'description', active: this.activeItem === 'Reportes' }
      ];
      break;

    case 'proveedor':
      this.navItems = [
        { label: 'Inicio', icon: 'home', link: '/proveedor', active: this.activeItem === 'Inicio' },
        { label: 'Peticiones', icon: 'assignment', active: this.activeItem === 'Peticiones' },
        { label: 'Ofertas', icon: 'sell', active: this.activeItem === 'Ofertas' },
        { label: 'Estadísticas', icon: 'monitoring', active: this.activeItem === 'Estadísticas' },
        { label: 'Ventas', icon: 'shopping_cart', active: this.activeItem === 'Ventas' },
        {
          label: 'Recomendar libro',
          icon: 'auto_stories',
          link: '/proveedor/proveedor-recomendacion',
          active: this.activeItem === 'Recomendar libro'
        }
      ];
      break;

    case 'comprador':
    default:
      this.navItems = [
        { label: 'Inicio', icon: 'home', active: this.activeItem === 'Inicio' },
        { label: 'Categorías', icon: 'category', active: this.activeItem === 'Categorías' },
        { label: 'Ofertas', icon: 'sell', active: this.activeItem === 'Ofertas' },
        { label: 'Mis pedidos', icon: 'shopping_cart', active: this.activeItem === 'Mis pedidos' },
        {
          label: 'Libros Digitales',
          icon: 'menu_book',
          link: '/comprador/libros-digitales',
          active: this.activeItem === 'Libros Digitales'
        }
      ];
      break;
  }
}
}
