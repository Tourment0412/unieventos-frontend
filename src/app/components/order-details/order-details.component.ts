import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';  // Importa el servicio
import { OrderItemDTO } from '../../dto/order-item-dto';
import { CommonModule } from '@angular/common'; // Asegúrate de que la ruta sea correcta

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {
  order: any;
  ordenDetalle: OrderItemDTO | null = null;  // Aquí se almacenan los detalles de la orden

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
  this.ordenDetalle = this.dataService.getData();
  if (this.ordenDetalle) {
    this.order = this.ordenDetalle;
  } else {
    console.error("No se encontraron detalles de la orden.");
  }
  }
}
