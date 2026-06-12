import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';

import { LibrosService } from '../../../../services/libros/libros.services';
import { Libro } from '../../../libros/interfaces/libro.interface';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-actualizar-libro',
  standalone: true,
  imports: [Button, ReactiveFormsModule, InputText, DialogModule, InputGroupModule, InputGroupAddonModule, FloatLabelModule, InputNumberModule],
  templateUrl: './actualizar-libro.html',
  styleUrl: './actualizar-libro.css',
})
export class ActualizarLibro {
  bookForm: FormGroup;
  visible = false;
  isLoading = false;
  libroSeleccionado: Libro | null = null;

  @Output() libroActualizado = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private librosService: LibrosService, private toastService: ToastService) {
    this.bookForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      isbn: ['', [Validators.required, Validators.pattern(/^[0-9-]{10,20}$/)]],
      autor: ['', [Validators.required, Validators.minLength(3)]],
      precio: [null, [Validators.required, Validators.min(0)]],
    });
  }

  showDialog(libro: Libro): void {
    this.libroSeleccionado = libro;
    this.bookForm.patchValue({
      nombre: libro.nombre,
      isbn: libro.isbn,
      autor: libro.autor,
      precio: libro.precio,
    });
    this.visible = true;
  }

  closeDialog(): void {
    this.visible = false;
    this.libroSeleccionado = null;
    this.bookForm.reset();
  }

  guardarLibro(): void {
    if (this.bookForm.invalid || !this.libroSeleccionado) {
      return;
    }

    this.isLoading = true;
    const libro = this.bookForm.getRawValue();

    this.librosService.updateLibro(this.libroSeleccionado.id, {
      nombre: String(libro.nombre ?? ''),
      isbn: String(libro.isbn ?? ''),
      autor: String(libro.autor ?? ''),
      precio: Number(libro.precio ?? 0),
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.closeDialog();
        this.toastService.updated('Libro');
        this.libroActualizado.emit();
      },
      error: (error) => {
        console.error('Error al actualizar el libro', error);
        this.isLoading = false;
        this.toastService.error('No se pudo actualizar el libro.');
      }
    });
  }

  get nombre() { return this.bookForm.get('nombre'); }
  get isbn() { return this.bookForm.get('isbn'); }
  get autor() { return this.bookForm.get('autor'); }
  get precio() { return this.bookForm.get('precio'); }
}
