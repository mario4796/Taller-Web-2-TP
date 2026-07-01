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
import { CheckboxModule } from 'primeng/checkbox';
import { IftaLabelModule } from 'primeng/iftalabel';
import { MessageService } from 'primeng/api';
import { Toast } from "primeng/toast";
import { NotificationService } from '../../services/NotificationService/notification-service';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CardModule,
    CheckboxModule,
    IftaLabelModule,
    Toast
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register {
  strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private notificationService = inject(NotificationService);

  public form: FormGroup = this.fb.group(
    {
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      direccion: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(this.strongPasswordPattern)]],
      confirmPassword: ['', Validators.required],
      serProveedor: [false],
    },
    { validators: (control) => this.matchPasswords(control) },
  );

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { confirmPassword, password, serProveedor, ...datosBase } = this.form.value;

    const tipoUsuario = serProveedor ? 2 : 3;

    const usuarioPayload = {
      ...datosBase,
      contrasena: password,
      tipo_usuario: tipoUsuario,
    };

    this.usuarioService.registrar(usuarioPayload).subscribe({
      next: () => {
        console.log('Usuario registrado con éxito como tipo:', tipoUsuario);
        this.notificationService.setPendingMessage({
          severity: 'success',
           summary: 'Registro Exitoso',
          detail: 'Usuario registrado correctamente',
              life: 3000, 
        });
        this.router.navigate(['']);

      },
      error: (err) => {
        console.error('Error al registrar:', err)
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ya existe un usuario registrado con ese Email.',
          life: 3000,
        });
      },
    });
  }
  private matchPasswords(control: AbstractControl): ValidationErrors | null {

    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    if (confirmPassword.hasError('required')) {
      return null;
    }

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({
        ...confirmPassword.errors,
        noMatch: true
      });
    } else {

      if (confirmPassword.hasError('noMatch')) {

        const errors = { ...confirmPassword.errors };
        delete errors['noMatch'];

        confirmPassword.setErrors(
          Object.keys(errors).length ? errors : null
        );
      }

    }

    return null;

  }
}
