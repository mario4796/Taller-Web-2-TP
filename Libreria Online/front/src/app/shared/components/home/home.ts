import { Component, Input, OnInit, signal } from '@angular/core';
import { Nav } from '../nav/nav';
import { Button } from 'primeng/button';
import { Avatar } from 'primeng/avatar';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { InputText } from 'primeng/inputtext';

@Component({
  selector: 'app-home',
  imports: [Nav, Button, Avatar, InputGroup, InputGroupAddon, InputText],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  @Input() imageBanner: string = '';
  @Input() eyebrow: string = '';
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() buttonText: string = '';
  @Input() buttonLink: string = '';
}
