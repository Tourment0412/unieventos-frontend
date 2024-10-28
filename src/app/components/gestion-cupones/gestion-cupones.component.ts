import { Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-cupones',
  templateUrl: './gestion-cupones.component.html',
  styleUrls: ['./gestion-cupones.component.css'],
  standalone: true,
  imports: [BrowserModule, FormsModule]
})


export class GestionCuponesComponent implements OnInit {
  cupones: any[] = [];
  nuevoCupon: any = { codigo: '', nombre: '', descuento: 0, fechaVencimiento: new Date(), estado: 'Activo', tipo: 'Porcentaje' };
  cuponSeleccionado: any | null = null;

  constructor() {}

  ngOnInit(): void {
    this.cargarCupones();
  }

  cargarCupones() {
   this.cupones = [
      { codigo: 'CUPON1', nombre: 'Descuento Verano', descuento: 20, fechaVencimiento: new Date('2024-12-31'), estado: 'Activo', tipo: 'Porcentaje' },
      { codigo: 'CUPON2', nombre: 'Descuento Invierno', descuento: 15, fechaVencimiento: new Date('2025-01-31'), estado: 'Inactivo', tipo: 'Monto Fijo' },
    ];

  }

  crearCupon() {

    const codigoGenerado = `CUPON${this.cupones.length + 1}`;
    const nuevoCuponCreado = { ...this.nuevoCupon, codigo: codigoGenerado };
    this.cupones.push(nuevoCuponCreado);
    this.resetForm();

  }

  actualizarCupon() {

    if (this.cuponSeleccionado) {
      const index = this.cupones.findIndex(c => c.codigo === this.cuponSeleccionado!.codigo);
      if (index !== -1) {
        this.cupones[index] = { ...this.nuevoCupon, codigo: this.cuponSeleccionado.codigo };
        this.resetForm();
      }
    }

  }

  eliminarCupon(codigo: string) {

    this.cupones = this.cupones.filter(c => c.codigo !== codigo);

  }

  seleccionarCupon(cupon: any) { //Coupon

    this.cuponSeleccionado = cupon;
    this.nuevoCupon = { ...cupon };

  }

  resetForm() {

    this.nuevoCupon = { codigo: '', nombre: '', descuento: 0, fechaVencimiento: new Date(), estado: 'Activo', tipo: 'Porcentaje' };
    this.cuponSeleccionado = null;
  }
}
