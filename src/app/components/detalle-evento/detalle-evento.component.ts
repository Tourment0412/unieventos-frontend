import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';
import { EventoDTO } from '../../dto/eventoDTO';
import { MensajeDTO } from '../../dto/mensaje-dto';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, FormArray, Validators, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import Swal from 'sweetalert2';
import { CarItemDTO } from '../../dto/car-item-dto';
import { UpdateCarItemDTO } from '../../dto/update-car-item-dto';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-detalle-evento',
  templateUrl: './detalle-evento.component.html',
  styleUrls: ['./detalle-evento.component.css'],
  standalone: true,
  imports: [CommonModule,  FormsModule],
})
export class DetalleEventoComponent  {
  evento?: EventoDTO;
  carItem?: CarItemDTO;
  localidadesCantidad: { quantity: number }[] = [];
  detailEventForm: FormGroup;

  constructor (
    private route: ActivatedRoute,
    private clienteService: ClienteService,
    private formBuilder: FormBuilder,
    private router: Router,
    private tokenService: TokenService
  ) {

    const id = this.route.snapshot.paramMap.get('id');
    console.log("Evento ID:", id);

    if (id) {
      this.getEvent(id);
    }

    this.detailEventForm = this.formBuilder.group({
      name: [''],
      address: [''],
      city: [''],
      date: [''],
      description: [''],
      type: [''],
      status: [''],
      coverImage: [''],
      localitiesImage: [''],
      locations: this.formBuilder.array([])  // El array de localidades
    });
  }


  public getEvent(id: string): void {
    this.clienteService.obtenerEvento(id).subscribe({
      next: (data) => {
        this.evento = data.reply;
        console.log(this.evento);
        this.loadEventData()



      },
      error: (error) => {
        console.error(error);
      },
    })
  }

  private loadEventData(): void {
    if (this.evento) {
      this.localidadesCantidad = this.evento.locations.map(() => ({ quantity: 0 }));
      this.detailEventForm.patchValue({
        name: this.evento.name,
        address: this.evento.address,
        city: this.evento.city,
        date: this.evento.date,
        description: this.evento.description,
        type: this.evento.type,
        status: this.evento.status,
        coverImage: this.evento.coverImage,
        localitiesImage: this.evento.localitiesImage
      });

      const locationsArray = this.detailEventForm.get('locations') as FormArray;

      if (this.evento.locations) {
        this.evento.locations.forEach(location => {
          locationsArray.push(this.createLocalityShow(location));
        });
      }
    }
  }

  private createLocalityShow(localidad: any): FormGroup {
    return this.formBuilder.group({
      id: [localidad.id],
      name: [localidad.name, Validators.required],
      price: [localidad.price, [Validators.required, Validators.min(0)]],
      maxCapacity: [localidad.maxCapacity, [Validators.required, Validators.min(1)]],
      quantity: [0, [Validators.required, Validators.min(1)]], // Definimos una cantidad inicial
      total: [0], // Total basado en la cantidad seleccionada
    });
  }


  updateTotal(localidad: any, index: number): void {
    const quantity = this.localidadesCantidad[index].quantity;
    localidad.total = localidad.price * quantity;

  }

  agregarAlCarrito(localidad: any, index: number): void {
    // Verificar si la cantidad es mayor que cero
    const cantidad = this.localidadesCantidad[index].quantity;
    if (cantidad <= 0) {
      Swal.fire("Error!", "Debe seleccionar al menos una entrada", "error");
      return;
    }

    // Crear el objeto del carrito
    const carItem: CarItemDTO = {
      idUser: this.obtenerIdUsuario(),
      idEvent: this.evento?.id ?? '',
      locationName: localidad.name,
      eventName: this.evento?.name ?? '',
      price: localidad.price,
      eventType: this.evento?.type ?? '',
      quantity: cantidad,
      total: localidad.price * cantidad,
    };

    this.clienteService.obtenerItemsCarrito(this.obtenerIdUsuario()).subscribe({
      next: (response: MensajeDTO) => {
        const items: CarItemDTO[] = response.reply;
        const existingItem = items.find(item => item.idEvent === carItem.idEvent && item.locationName === carItem.locationName);
        if (existingItem) {
          const updatedItem: UpdateCarItemDTO = {
            idUser: carItem.idUser,
            idEvent: carItem.idEvent,
            locationName: carItem.locationName,
            amount: existingItem.quantity + carItem.quantity,
          };

          this.clienteService.actualizarItemCarrito(updatedItem).subscribe({
            next: () => {
              Swal.fire("Éxito!", "La cantidad ha sido actualizada en el carrito", "success");
            },
            error: (error) => {
              Swal.fire("Error!", "Hubo un error al actualizar el carrito", "error");
            }
          });
        } else {
          this.clienteService.agregarItemCarrito(carItem).subscribe({
            next: () => {
              Swal.fire("Éxito!", "Se ha agregado el item al carrito", "success");
            },
            error: (error) => {
              Swal.fire("Error!", error.error.respuesta, "error");
            }
          });
        }
      },
      error: (error) => {
        console.error("Error al obtener los items del carrito", error);
        Swal.fire("Error!", "Hubo un problema al verificar el carrito", "error");
      }
    });
  }


  private obtenerIdUsuario(): string {
    return this.tokenService.getIDCuenta();
  }
}
