import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../services/cliente.service';
import { CarItemDTO } from '../../dto/car-item-dto';
import { TokenService } from '../../services/token.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shopping-car',
  templateUrl: './shopping-car.component.html',
  styleUrls: ['./shopping-car.component.css'],
  standalone: true,
  imports: [CommonModule],  // Agrega CommonModule aquí
})
export class ShoppingCarComponent  {
  itemsCarrito: CarItemDTO[] = [];
  subtotal: number = 0;
  descuento: number = 0;
  total: number = 0;

  constructor(private clienteService: ClienteService, private tokenService: TokenService) {
    this.obtenerItemsCarrito();
  }


  obtenerItemsCarrito(): void {
    console.log("Obteniendo items del carrito...");
    const clienteId = this.tokenService.getIDCuenta();
    this.clienteService.obtenerItemsCarrito(clienteId).subscribe({
      next: (response) => {
        this.itemsCarrito = response.reply;
        console.log("Items del carrito:", this.itemsCarrito);
        this.calcularTotales();
      },
      error: (error) => {
        console.error("Error al obtener los items del carrito:", error);
      }
    });
  }

  calcularTotales(): void {
    this.subtotal = this.itemsCarrito.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    this.total = this.subtotal - this.descuento;
  }

  actualizarCantidad(item: CarItemDTO, cantidad: number): void {
    if (cantidad > 0) {
      item.quantity = cantidad;
      this.calcularTotales();
    }
  }

  eliminarItem(index: number): void {
    this.itemsCarrito.splice(index, 1);
    this.calcularTotales();
  }

  aplicarDescuento(codigo: string): void {
    // Aquí puedes implementar la lógica para aplicar un descuento con un código
    // Por ahora asumiremos un descuento fijo de 10%
    this.descuento = this.subtotal * 0.1;
    this.calcularTotales();
  }
}
