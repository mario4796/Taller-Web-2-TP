import { Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { UsuarioService } from '../../services/usuarios/usuario-service';
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
      //para mostrar al usuario porque el form es invalido
      this.form.markAllAsTouched();
      return;
    }
    const { email, password } = this.form.value;
    const usuarioLogueado = this.usuarioService.login(email, password);
    if (usuarioLogueado){
      alert(`¡Bienvenido de nuevo, ${usuarioLogueado.nombre}! Acceso concedido.`);
      this.router.navigate(['']);
    }else {
      alert('Error: Email o contraseña incorrectos.');
    }


  }

}
