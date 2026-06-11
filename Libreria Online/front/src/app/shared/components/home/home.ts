import { Component, Input } from '@angular/core';
import { Button } from 'primeng/button';
import { AgregarLibro } from '../../../modules/proveedor/components/agregar-libro/agregar-libro';

@Component({
  selector: 'app-home',
  imports: [Button, AgregarLibro],
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
  @Input() role: string = '';
}
