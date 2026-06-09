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
    if (changes['logueado'] || changes['role']) {
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
        { label: 'Inicio', icon: 'home', active: true },
        { label: 'Categorías', icon: 'category' },
        { label: 'Ofertas', icon: 'sell' }
      ];
      return;
    }

    switch (this.role) {
      case 'admin':
        this.navItems = [
          { label: 'Inicio', icon: 'home', active: true },
          { label: 'Usuarios', icon: 'people' },
          { label: 'Libros', icon: 'book' },
          { label: 'Stock', icon: 'inventory' },
          { label: 'Reportes', icon: 'description' }
        ];
        break;

      case 'proveedor':
        this.navItems = [
          { label: 'Inicio', icon: 'home', active: true },
          { label: 'Peticiones', icon: 'assignment' },
          { label: 'Ofertas', icon: 'sell' },
          { label: 'Estadísticas', icon: 'monitoring' },
          { label: 'Ventas', icon: 'shopping_cart' },
          { label: 'Recomendar libro', icon: 'auto_stories' }
        ];
        break;

      case 'comprador':
      default:
        this.navItems = [
          { label: 'Inicio', icon: 'home', active: true },
          { label: 'Categorías', icon: 'category' },
          { label: 'Ofertas', icon: 'sell' },
          { label: 'Mis pedidos', icon: 'shopping_cart' }
        ];
        break;
    }
  }
}
