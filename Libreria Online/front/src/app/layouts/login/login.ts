import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { IftaLabelModule } from 'primeng/iftalabel';

import { UsuarioService } from '../../api/services/usuario/usuario-service';
import { AuthService } from '../../services/Auth/auth-service';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    IftaLabelModule,
    ToastModule,
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  isLoading = false;

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const datos = {
      email: this.form.value.email,
      contrasena: this.form.value.password,
    };

    this.usuarioService.login(datos).subscribe({
      next: (respuesta) => {
        this.isLoading = false;

        this.authService.setSesion(respuesta.tipo_usuario_id, respuesta);

        if (respuesta.tipo_usuario_id === 1) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['']);
        }
      },
      error: (err) => {
        console.error('Credenciales incorrectas', err);

        this.isLoading = false;

        this.toastService.error(
          'Revisa el email y la contraseña ingresados.',
          'No se pudo iniciar sesión',
        );
      },
    });
  }
}
