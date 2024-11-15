import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { OrderItemDTO } from '../../dto/order-item-dto';
import { CommonModule } from '@angular/common';
import { PublicoService } from '../../services/publico.service';
import { EventoDTO } from '../../dto/eventoDTO';
import { TokenService } from '../../services/token.service';
import { ClienteService } from '../../services/cliente.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {
  order: any;
  nombreCliente: string = '';
  coupon: any;
  eventos: { [key: string]: string } = {};
  ordenDetalle: OrderItemDTO | null = null;
  constructor(private dataService: DataService, private publicoService: PublicoService, private tokenService: TokenService, private clienteService: ClienteService) {}


  ngOnInit(): void {
    this.ordenDetalle = this.dataService.getData();
    this.order = this.ordenDetalle;
    this.nombreCliente = this.tokenService.getNombre();

    if(this.order.couponId){
      this.clienteService.obtenerInfoCuponId(this.order.couponId).subscribe({
        next: (data) => {
          this.coupon = data.reply;
        },
        error: (err) => {
          console.error(`Error al obtener el cupón con ID ${this.order.couponId}:`, err);
        },
      });
    }
    if (this.order && this.order.items) {
      this.order.items.forEach((item: any) => {
        if (!this.eventos[item.eventId]) {
          this.publicoService.obtenerEvento(item.eventId).subscribe({
            next: (data) => {
              this.eventos[item.eventId] = data.reply.name;
            },
            error: (err) => {
              console.error(`Error al obtener el evento con ID ${item.eventId}:`, err);
            },
          });
        }
      });
    }
  }
}
