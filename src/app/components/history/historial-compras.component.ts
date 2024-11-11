import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';
import { TokenService } from '../../services/token.service';
import Swal from 'sweetalert2';
import { OrderItemDTO } from '../../dto/order-item-dto';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-historial-compras',
  templateUrl: './historial-compras.component.html',
  imports: [RouterModule, CommonModule],
  standalone: true,
  styleUrls: ['./historial-compras.component.css']
})
export class HistorialComprasComponent implements OnInit {

  historialCompras: any[] = [];
  comprasSeleccionadas: any[] = [];
  constructor(private clienteService: ClienteService, private tokenService: TokenService, private router: Router, private dataService: DataService) {}

  ngOnInit() {
    this.listarHistorialOrdenesCompra();
  }

  isEnviarEntradasDisabled() {
    return !this.comprasSeleccionadas.some(compra => compra.estado && compra.estado.toLowerCase() === 'approved');
  }

  seleccionarCompra(compra: any, event: Event) {
    const isSelected = (event.target as HTMLInputElement).checked;
    compra.seleccionado = isSelected;

    if (isSelected) {
      this.comprasSeleccionadas.push(compra);
    } else {
      const index = this.comprasSeleccionadas.indexOf(compra);
      if (index > -1) {
        this.comprasSeleccionadas.splice(index, 1);
      }
    }

    this.historialCompras = [...this.historialCompras];
  }

  seleccionarTodo(event: Event) {
    const seleccionado = (event.target as HTMLInputElement).checked;

    this.comprasSeleccionadas = [];

    this.historialCompras.forEach(compra => {
      compra.seleccionado = seleccionado;

      if (seleccionado) {
        this.comprasSeleccionadas.push(compra);
      }
    });
  }


todosSeleccionados() {
  return this.historialCompras.every(compra => compra.seleccionado);
}

  enviarEntradasAmigo() {
    console.log("Entradas enviadas:", this.comprasSeleccionadas);
    // Aquí puedes implementar la lógica de envío de entradas
  }

  verDetalles(idOrden: string) {
    console.log("Detalles de la compra:", idOrden);
    const orden = this.historialCompras.find(order => order.id === idOrden);
    if (orden) {
      this.dataService.setData(orden);
      this.router.navigate(['/order-details', idOrden]);
    } else {
      console.error("Orden no encontrada");
    }
  }

  cancelarCompras() {
    const comprasACancelar = this.historialCompras.filter(compra => compra.seleccionado);
    comprasACancelar.forEach(compra => {
      compra.estado = 'Cancelado';
    });

    this.historialCompras = [...this.historialCompras];
  }

  hayComprasSeleccionadas() {
    return this.historialCompras.some(compra => compra.seleccionado);
  }

  public listarHistorialOrdenesCompra() {
    const codigoCliente = this.tokenService.getIDCuenta();
    this.clienteService.listarHistorialCompras(codigoCliente).subscribe({
      next: (data) => {

        this.historialCompras = data.reply.map((orderItemDTO: OrderItemDTO) => ({
          ...orderItemDTO,
          estado: orderItemDTO.status || 'No Pagada',
          seleccionado: false
        }));
      },
      error: (error) => {
        Swal.fire("Error!", error.error.respuesta, "error");
      }
    });
  }



}
