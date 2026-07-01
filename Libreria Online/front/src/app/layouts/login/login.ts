import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { UsuarioService } from '../../api/services/usuario/usuario-service';

import { Router } from '@angular/router';
import { AuthService } from '../../services/Auth/auth-service';
import { MessageService } from 'primeng/api';
import { Toast } from "primeng/toast";
import { IftaLabelModule } from 'primeng/iftalabel';

@Component({
  selector: 'app-login',
  standalone:true,
  imports: [
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    Toast,
    IftaLabelModule
],
  providers: [MessageService], 
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {

  private fb = inject(FormBuilder);

  private usuarioService = inject(UsuarioService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  public form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });
  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const datos = {
      email: this.form.get('email')?.value,
      contrasena: this.form.get('password')?.value,
    };

    this.usuarioService.login(datos).subscribe({
      next: (respuesta) => {
        console.log(respuesta.tipo_usuario_id);
        this.authService.setSesion(respuesta.tipo_usuario_id, respuesta);
        console.log(localStorage.getItem('usuario'));
        
        this.router.navigate(['']);
      },
      error: (err) => {

        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Usuario o Contraseña incorrectos, por favor vuelva a intentarlo.',
            life: 3000,
          });
        console.error('Credenciales incorrectas', err);
      },
    });
  }
}
