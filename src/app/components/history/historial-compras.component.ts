import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'
import { EventosService } from '../../services/EventosService';
import { RouterModule } from '@angular/router';
import { EventoDTO } from '../../dto/eventoDTO';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-historial-compras',
  templateUrl: './historial-compras.component.html',
  imports: [RouterModule, CommonModule],
  standalone: true,
  styleUrls: ['./historial-compras.component.css']
})

export class HistorialComprasComponent {
  historialCompras = [
    // Ejemplo de datos para mostrar el formato en el HTML
    { fecha: new Date(), metodoPago: 'Tarjeta', descuento: 10, total: 50000, estado: 'Aprobado', seleccionado: false },
    { fecha: new Date(), metodoPago: 'Efectivo', descuento: 5, total: 30000, estado: 'Pendiente', seleccionado: false },
  ];

  comprasSeleccionadas: any[] = [];


  isEnviarEntradasDisabled() {
    return !this.comprasSeleccionadas.some(compra => compra.estado.toLowerCase() === 'aprobado');
  }

  seleccionarCompra(compra: any, event: Event) {
    const isSelected = (event.target as HTMLInputElement).checked;

    // Actualizar el estado de "seleccionado" en el objeto de compra
    compra.seleccionado = isSelected;

    if (isSelected) {
      this.comprasSeleccionadas.push(compra);
    } else {
      const index = this.comprasSeleccionadas.indexOf(compra);
      if (index > -1) {
        this.comprasSeleccionadas.splice(index, 1);
      }
    }
  }

  enviarEntradasAmigo() {
    console.log("Entradas enviadas:", this.comprasSeleccionadas);
  }

  verDetalles(compra: any) {
    console.log("Detalles de la compra:", compra);
  }
  cancelarCompras() {
    const comprasACancelar = this.historialCompras.filter(compra => compra.seleccionado);
    comprasACancelar.forEach(compra => {
      compra.estado = 'Cancelado';
    });

    // Opcional: Actualiza el estado de las compras seleccionadas
    this.historialCompras = [...this.historialCompras]; // Forzar actualización de la vista
  }

  hayComprasSeleccionadas() {
    return this.historialCompras.some(compra => compra.seleccionado);
  }
}
