import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Button } from 'primeng/button';
import { Avatar } from 'primeng/avatar';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { InputText } from 'primeng/inputtext';

@Component({
  selector: 'app-proveedor-home',
  standalone: true,
  imports: [
    CommonModule,
    Button,
    Avatar,
    InputText,
    InputGroup,
    InputGroupAddon
  ],
  templateUrl: './proveedor-home.html',
  styleUrls: ['./proveedor-home.css']
})
export class ProveedorHome implements OnInit {
  isDark = signal(false);
  mobileNavOpen = signal(false);

  navItems = [
    { label: 'Inicio', icon: 'home', active: true },
    { label: 'Peticiones', icon: 'assignment' },
    { label: 'Ofertas', icon: 'sell' },
    { label: 'Estadísticas', icon: 'monitoring' },
    { label: 'Ventas', icon: 'shopping_cart' },
    { label: 'Recomendar libro', icon: 'auto_stories' }
  ];

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
}
