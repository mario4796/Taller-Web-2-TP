import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule, FormBuilder, Validators} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {UsuarioService} from '../services/usuario-service';
import {Router} from '@angular/router'


@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CardModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})

export class Register implements OnInit {
  form: any;
  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router : Router,
  ){}

  ngOnInit() {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      direccion: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  submit(){
    if (this.form.invalid){
      this.form.markAllAsTouched();
      return;
    }
      const { confirmPassword, ...usuario } = this.form.value;

      this.usuarioService.agregarUsuario(usuario);

      console.log('Usuario registrado');
      this.router.navigate(['']);
    }
  


}
