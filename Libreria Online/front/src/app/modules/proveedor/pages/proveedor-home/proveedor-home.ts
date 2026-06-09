import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Nav } from '../../../../shared/components/nav/nav';
import { Home } from '../../../../shared/components/home/home';

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
    //Button,
    //Avatar,
    //InputText,
    //InputGroup,
    //InputGroupAddon,
    Nav,
    Home
  ],
  templateUrl: './proveedor-home.html',
  styleUrls: ['./proveedor-home.css']
})
export class ProveedorHome {
  //Nav//
  userName = 'María Rodríguez';
  role = 'proveedor';
  //Home//
  eyebrow: string = 'Panel del proveedor'
  title: string = 'Bienvenido al panel de control del proveedor'
  description: string = 'Desde aquí puedes gestionar tus productos, pedidos y estadísticas de ventas.'
  buttonText: string = 'Ver mis productos'
  buttonLink: string = 'Recomendar un libro'

}
