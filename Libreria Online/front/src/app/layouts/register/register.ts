import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
  FormGroup,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { UsuarioService } from '../../api/services/usuario/usuario-service';
import { Router } from '@angular/router';
import { FloatLabel } from 'primeng/floatlabel';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CardModule,
    FloatLabel,
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register {
  strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);

  public form: FormGroup = this.fb.group(
    {
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      direccion: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(this.strongPasswordPattern)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: (control) => this.matchPasswords(control) },
  );

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { confirmPassword, password, ...otros } = this.form.value;
    const usuarioPayload = { ...otros, contrasena: password, tipo_usuario: 3 };

    this.usuarioService.registrar(usuarioPayload).subscribe({
      next: () => {
        console.log('Usuario registrado con éxito');
        this.router.navigate(['']);
      },
      error: (err) => console.error('Error al registrar:', err),
    });
  }
  private matchPasswords(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ noMatch: true });
      return { passwordsDoNotMatch: true };
    }
    return null;
  }
}
