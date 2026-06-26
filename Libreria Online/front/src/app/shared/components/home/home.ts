import { Component, input } from '@angular/core';
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
  imageBanner = input('');
  eyebrow = input('');
  title = input('');
  description = input('');
  buttonText = input('');
  buttonLink = input('');
  buttonRoute = input('');
  buttonLinkRoute = input('');
  role = input('');
}
