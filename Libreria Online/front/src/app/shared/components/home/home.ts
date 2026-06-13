import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Button, RouterLink],
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
  @Input() buttonRoute: string = '';
  @Input() role: string = '';
}
