import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-agregar-libro',
  imports: [Button, ReactiveFormsModule, InputText, DialogModule, InputGroupModule, InputGroupAddonModule, FloatLabelModule, InputNumberModule],
  templateUrl: './agregar-libro.html',
  styleUrl: './agregar-libro.css',
})
export class AgregarLibro implements OnInit {
  bookForm!: FormGroup;
  visible: boolean = false;
  isLoading: boolean = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm() {
    this.bookForm = this.fb.group({
      isbn: ['', [Validators.required, Validators.pattern(/^[0-9-]{10,20}$/)]],
      author: ['', [Validators.required, Validators.minLength(3)]],
      price: [null, [Validators.required, Validators.min(0)]],
      stock: [null, [Validators.required, Validators.min(0), Validators.pattern(/^[0-9]+$/)]],
    });
  }

  showDialog() {
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
    this.resetForm();
  }

  guardarLibro() {
    if (this.bookForm.invalid) {
      console.error('Formulario inválido', this.bookForm.errors);
      return;
    }

    this.isLoading = true;
    const formData = this.bookForm.value;

    console.log('Datos del libro a guardar:', formData);

    // this.libroService.agregarLibro(formData).subscribe(
    //   (response) => {
    //     console.log('Libro guardado exitosamente', response);
    //     this.closeDialog();
    //     this.isLoading = false;
    //   },
    //   (error) => {
    //     console.error('Error al guardar el libro', error);
    //     this.isLoading = false;
    //   }
    // );

    // test
    setTimeout(() => {
      console.log('Libro guardado (simulado)');
      this.closeDialog();
      this.isLoading = false;
    }, 1000);
  }

  private resetForm() {
    this.bookForm.reset();
  }

  get isbn() {
    return this.bookForm.get('isbn');
  }

  get author() {
    return this.bookForm.get('author');
  }

  get price() {
    return this.bookForm.get('price');
  }

  get stock() {
    return this.bookForm.get('stock');
  }
}
