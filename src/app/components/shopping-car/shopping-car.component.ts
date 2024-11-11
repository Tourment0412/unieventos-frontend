import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../services/cliente.service';
import { CarItemDTO } from '../../dto/car-item-dto';
import { TokenService } from '../../services/token.service';
import { CommonModule } from '@angular/common';
import { DeleteCarDetailDTO } from '../../dto/delete-car-detail-dto';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { UpdateCarItemDTO } from '../../dto/update-car-item-dto';
import { MensajeDTO } from '../../dto/mensaje-dto';
import { CouponItemClientDTO } from '../../dto/coupon-item-client-dto';

@Component({
  selector: 'app-shopping-car',
  templateUrl: './shopping-car.component.html',
  styleUrls: ['./shopping-car.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],

})
export class ShoppingCarComponent  {
  itemsCarrito: CarItemDTO[] = [];
  subtotal: number = 0;
  descuento: number = 0;
  total: number = 0;
  couponCode: string = '';
  cuponesDisponibles: CouponItemClientDTO[] = [];
  cuponInvalido: boolean = false;


  constructor(private clienteService: ClienteService, private tokenService: TokenService) {
    this.obtenerItemsCarrito();
    this.obtenerCuponesDisponibles();
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
    this.total = this.subtotal - (this.descuento);
  }

  actualizarCantidad(item: CarItemDTO, event: any): void {
    const nuevaCantidad = event.target.value;

    if (nuevaCantidad < 1) {
      Swal.fire('Error', 'La cantidad debe ser al menos 1', 'error');
      return;
    }

    const updateCarItemDTO: UpdateCarItemDTO = {
      amount: nuevaCantidad,
      locationName: item.locationName,
      idEvent: item.idEvent,
      idUser: this.tokenService.getIDCuenta()
    };

    this.clienteService.actualizarItemCarrito(updateCarItemDTO).subscribe({
      next: (data) => {
        Swal.fire('Éxito', 'Cantidad actualizada en el carrito', 'success');
        this.obtenerItemsCarrito();
        this.aplicarCupon();
      },
      error: (error) => {
        console.error('Error al actualizar la cantidad', error);
        Swal.fire('Error', 'Hubo un problema al actualizar la cantidad', 'error');
      }
    });
  }


eliminarItem(index: number): void {
  const item = this.itemsCarrito[index];
  const idUser = this.tokenService.getIDCuenta();

  const deleteCarDetailDTO: DeleteCarDetailDTO = {
    locationName: item.locationName,
    idEvent: item.idEvent,
    idUser: idUser
  };
  this.clienteService.eliminarItemCarrito(deleteCarDetailDTO).subscribe({
    next: () => {
      this.itemsCarrito.splice(index, 1);
      this.calcularTotales();
    },
    error: (error) => {
      console.error('Error al eliminar el ítem:', error);
      Swal.fire('Error', 'Hubo un problema al eliminar el item del carrito, intente nuevamente', 'error');
    }
  });
}


public confirmarEliminacion(index: number) {
  Swal.fire({
    title: "Estas seguro?",
    text: "Tendrá que seleccionar nuevamente las entradas desde la página!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, eliminalo!"
  }).then((result) => {
    if (result.isConfirmed) {
      this.eliminarItem(index);
      Swal.fire({
        title: "Eliminado!",
        text: "Se han eliminado las entradas de su carrito.",
        icon: "success"
      });
    }
  });
}

  obtenerCuponesDisponibles(): void {
    this.clienteService.obtenerCuponesDisponibles(1).subscribe({
      next: (data) => {
        const response: MensajeDTO = data;
        if (response && response.reply) {
          this.cuponesDisponibles = response.reply as CouponItemClientDTO[];
        } else {
          Swal.fire('Error', 'No se encontraron cupones disponibles.', 'error');
        }
      },
      error: (err) => {
        console.error('Error al obtener cupones', err);
        Swal.fire('Error', 'Hubo un problema al obtener los cupones disponibles.', 'error');
      }
    });
  }

  aplicarCupon(): void {
    if (!this.couponCode) {
      Swal.fire('Error', 'Por favor ingresa un código de cupón', 'error');
      return;
    }

    this.clienteService.obtenerInfoCupon(this.couponCode).subscribe({
      next: (data) => {
        const response: MensajeDTO = data;
        if (response && response.reply) {
          const couponInfo: CouponItemClientDTO = response.reply as CouponItemClientDTO;

          if (couponInfo) {
            this.descuento = couponInfo.discount*this.subtotal;
            this.cuponInvalido = false;
            this.calcularTotales();
            Swal.fire('Éxito', `Cupón aplicado. Descuento: ${couponInfo.discount*100}%`, 'success');
          } else {
            this.cuponInvalido = true;
            Swal.fire('Error', 'El cupón no es válido o ha expirado', 'error');
          }
        } else {
          this.cuponInvalido = true;
          Swal.fire('Error', 'No se encontró información del cupón', 'error');
        }
      },
      error: (error) => {
        console.error('Error al verificar el cupón', error);
        this.cuponInvalido = true;
        Swal.fire('Error', 'Hubo un problema al verificar el cupón', 'error');
      }
    });
  }

}
