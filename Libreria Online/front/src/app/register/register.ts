import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors} from '@angular/forms';
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
  strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/
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
      password: ['', [Validators.required, Validators.pattern(this.strongPasswordPattern)]],
      confirmPassword: ['', Validators.required]
    },{
      validators: this.matchPasswords
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
  
  matchPasswords(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get ('confirmPassword')?.value;
    if (password !== confirmPassword){
      control.get('confirmPassword')?.setErrors({ noMatch:true});
      return {passwordsDoNotMatch:true}
    }
    return null;
  }


}
