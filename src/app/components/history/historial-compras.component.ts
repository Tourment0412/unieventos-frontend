import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';
import { TokenService } from '../../services/token.service';
import Swal from 'sweetalert2';
import { OrderItemDTO } from '../../dto/order-item-dto';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { GiftDTO } from '../../dto/gift-dto';

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
  isLoading: boolean=false;
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
    const comprasAprobadas = this.comprasSeleccionadas.filter(compra => compra.estado.toLowerCase() === 'approved');
    const comprasNoPagadas = this.comprasSeleccionadas.filter(compra => compra.estado.toLowerCase() !== 'approved');

    if (comprasAprobadas.length === 0) {
      Swal.fire("Atención", "Selecciona al menos una compra aprobada para enviar como regalo.", "info");
      return;
    }


    if (comprasNoPagadas.length > 0) {
      Swal.fire("Aviso", "Algunas órdenes seleccionadas no están aprobadas y no se enviarán como regalo.", "warning");
    }

  if (comprasAprobadas.length === 0) {
    Swal.fire("Atención", "Selecciona al menos una compra aprobada para enviar como regalo.", "info");
    return;
  }


  Swal.fire({
    title: 'Introduce el correo de tu amigo',
    input: 'email',
    inputLabel: 'Correo del destinatario',
    inputPlaceholder: 'nombre@ejemplo.com',
    showCancelButton: true,
    confirmButtonText: 'Enviar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed && result.value) {
      const friendEmail = result.value;

      comprasAprobadas.forEach((compra) => {
        const gift: GiftDTO = {
          friendEmail: friendEmail,
          idOrder: compra.id
        };
        this.isLoading = true;
        this.clienteService.sendGift(gift).subscribe({
          next: (response) => {
            if (!response.error) {
              Swal.fire("Enviado", `Las entradas fueron enviadas a ${friendEmail}`, "success");
              this.isLoading = false;
            } else {
              Swal.fire("Error", "No se pudo enviar el regalo. Inténtalo de nuevo.", "error");
              this.isLoading = false;
            }
          },
          error: (error) => {
            if(error.error.reply === "You cannot give tickets more than once"){
              Swal.fire("Error", "No puedes regalar nuevamente estas entradas.", "error")
            }else{
              Swal.fire("Error", "Hubo un problema al enviar el regalo.", "error");
            }
            this.isLoading = false;
          }
        });
      });
    } else if (result.isDismissed) {
      Swal.fire("Cancelado", "No se envió el regalo.", "info");
    }
  });
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

    if (comprasACancelar.length === 0) {
      Swal.fire("Atención", "No has seleccionado ninguna compra para cancelar.", "info");
      return;
    }

    comprasACancelar.forEach(compra => {
      this.clienteService.cancelarOrder(compra.id).subscribe({
        next: (response) => {
          if (!response.error) {
            compra.estado = 'Cancelado';
            Swal.fire("Cancelación exitosa", `La compra con ID ${compra.id} ha sido cancelada.`, "success");
            this.listarHistorialOrdenesCompra();
          } else {
            Swal.fire("Error", `No se pudo cancelar la compra con ID ${compra.id}.`, "error");
          }
        },
        error: () => {
          Swal.fire("Error", `Ocurrió un problema al intentar cancelar la compra con ID ${compra.id}.`, "error");
        }
      });
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
