import { Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { UsuarioService } from '../../api/services/usuario/usuario-service';

import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  // inyecta servicio de angular que construye forms
  private fb = inject (FormBuilder);

  private usuarioService = inject(UsuarioService);
  private router = inject(Router);

  public form: FormGroup = this.fb.group({
    email:['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  })
  submit(){
  if (this.form.invalid){
    this.form.markAllAsTouched();
    return;
  }
  const datos = {
    email: this.form.get('email')?.value,
    contrasena: this.form.get('password')?.value 
  };

  this.usuarioService.login(datos).subscribe({
    next: (respuesta) => {

      localStorage.setItem('usuario', JSON.stringify(respuesta));
      
      this.router.navigate(['']);
    },
    error: (err) => {
      console.error("Credenciales incorrectas", err);
    }
  });
}
 
}
