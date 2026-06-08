import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Button } from 'primeng/button';
import { Avatar } from 'primeng/avatar';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { InputText } from 'primeng/inputtext';

@Component({
  selector: 'app-nav',
  imports: [CommonModule, Button, Avatar, InputGroup, InputGroupAddon, InputText],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav implements OnInit{

  isDark = signal(false);
  mobileNavOpen = signal(false);

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

   navItems = [
    { label: 'Inicio', icon: 'home', active: true },
    { label: 'Peticiones', icon: 'assignment' },
    { label: 'Ofertas', icon: 'sell' },
    { label: 'Estadísticas', icon: 'monitoring' },
    { label: 'Ventas', icon: 'shopping_cart' },
    { label: 'Recomendar libro', icon: 'auto_stories' }
  ];

  @Input() logueado: boolean = true;
  @Input() role: string = '';
  @Input() userName: string = '';
}
