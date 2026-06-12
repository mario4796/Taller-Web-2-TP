import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { LibrosService } from '../../../../services/libros/libros.services';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-agregar-libro',
  standalone: true,
  imports: [Button, ReactiveFormsModule, InputText, DialogModule, InputGroupModule, InputGroupAddonModule, FloatLabelModule, InputNumberModule],
  templateUrl: './agregar-libro.html',
  styleUrl: './agregar-libro.css',
})
export class AgregarLibro implements OnInit {
  bookForm!: FormGroup;
  visible: boolean = false;
  isLoading: boolean = false;
  @Output() libroCreado = new EventEmitter<void>();

  // Inyectamos tu servicio acá
  constructor(private fb: FormBuilder, private librosService: LibrosService, private toastService: ToastService) {}

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm() {
    this.bookForm = this.fb.group({
      // Agregamos el nombre y pasamos todo al español para que matchee con el backend
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      isbn: ['', [Validators.required, Validators.pattern(/^[0-9-]{10,20}$/)]],
      autor: ['', [Validators.required, Validators.minLength(3)]],
      precio: [null, [Validators.required, Validators.min(0)]],
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
    console.error('❌ ERROR: El formulario es inválido. Deteniendo ejecución.');
    return;
  }

  console.log('✅ 2. Formulario válido. Preparando envío al backend...');
  this.isLoading = true;
  const formData = this.bookForm.value;

  console.log('Datos exactos que viajan al servicio:', formData);

  this.librosService.crearLibro(formData).subscribe({
    next: (response) => {
      console.log('🟢 3. ÉXITO: El backend respondió que todo salió bien', response);
      this.closeDialog();
      this.isLoading = false;
        this.toastService.created('Libro');
      this.libroCreado.emit();
    },
    error: (error: any) => {
      console.error('🔴 3. ERROR DEL BACKEND:', error);
      this.isLoading = false;
        this.toastService.error('No se pudo crear el libro.');
    }
  });
}

  private resetForm() {
    this.bookForm.reset();
  }

  // Getters actualizados
  get nombre() { return this.bookForm.get('nombre'); }
  get isbn() { return this.bookForm.get('isbn'); }
  get autor() { return this.bookForm.get('autor'); }
  get precio() { return this.bookForm.get('precio'); }
  get stock() { return this.bookForm.get('stock'); }
}
