import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { dropdown } from '@primeuix/themes/aura/autocomplete';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { ProveedoresService } from '../../../../api/services/usuarios/proveedores';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { ToastService } from '../../../../shared/services/toast.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-pedir-stock-admin',
  imports: [
    FormsModule, 
    DialogModule, 
    ButtonModule, 
    InputNumberModule, 
    FloatLabelModule, 
    InputGroupModule, 
    InputGroupAddonModule,
    SelectModule,
    ToastModule,
    
    
  ],
  templateUrl: './pedir-stock-admin.html',
  styleUrl: './pedir-stock-admin.css',
})
export class PedirStockAdmin {
  //mock
  proveedoresMock = input<any[]>([]);
 

  // Inputs y Outputs con sintaxis de Signals
  visible = input<boolean>(false);
  libro = input<any | null>(null);
  proveedores = input<any[]>([]);
  
  visibleChange = output<boolean>();
  alGuardarPedido = output<{ cantidad: number; proveedor: any }>();
  cantidadInput = signal<number | null>(null);
  proveedorSeleccionado = signal<any | null>(null);

  constructor() {
    // 🚦 Efecto Reactivo: Corre cada vez que cambia el libro seleccionado en la tabla
    effect(() => {
      const libroActual = this.libro();
      const listaProveedores = this.proveedores();

      if (libroActual && libroActual.proveedorId) {
        // Busca si coincide con la FK del modelo de la DB
        const encontrado = listaProveedores.find(p => p.id === libroActual.proveedorId);
        this.proveedorSeleccionado.set(encontrado || null);
      } else {
        this.proveedorSeleccionado.set(null); // Limpio si no tiene historial
      }
    });
  }
enviarPedido(): void {
    if (!this.cantidadInput() || this.cantidadInput()! <= 0 || !this.proveedorSeleccionado()) return;

    // Emitimos el paquete tipado hacia el padre
    this.alGuardarPedido.emit({
      cantidad: this.cantidadInput()!,
      proveedor: this.proveedorSeleccionado()
    });

    this.cerrar();
  }

 cerrar(): void {
    this.visibleChange.emit(false);
    this.cantidadInput.set(null);
    this.proveedorSeleccionado.set(null);
  }

}
