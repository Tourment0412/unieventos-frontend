import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-gestion-cupones',
  templateUrl: './gestion-cupones.component.html',
  styleUrls: ['./gestion-cupones.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class GestionCuponesComponent implements OnInit {
  cupones: any[] = [];
  nuevoCupon: any = { codigo: '', nombre: '', descuento: 0, fechaVencimiento: new Date(), estado: 'Activo', tipo: 'Porcentaje' };
  cuponSeleccionado: any | null = null;
  crearCuponForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.couponForm();
  }

  ngOnInit(): void {
    this.cargarCupones();
  }

  private couponForm() {
    this.crearCuponForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      descuento: ['', [Validators.required, Validators.maxLength(10)]],
      fechaVencimiento: ['', [Validators.required]],
      tipo: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(7)]],
    });
  }

  cargarCupones() {
    this.cupones = [
      { codigo: 'CUPON1', nombre: 'Descuento Verano', descuento: 20, fechaVencimiento: new Date('2024-12-31'), estado: 'Activo', tipo: 'Porcentaje' },
      { codigo: 'CUPON2', nombre: 'Descuento Invierno', descuento: 15, fechaVencimiento: new Date('2025-01-31'), estado: 'Inactivo', tipo: 'Monto Fijo' },
    ];
  }

  crearCupon() {
    Swal.fire({
      title: '¿Desea crear el cupón?',
      showDenyButton: true,
      confirmButtonText: 'Crear',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.cupones.push(this.nuevoCupon);
        this.resetForm();
      }
    });
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

  seleccionarCupon(cupon: any) {
    this.cuponSeleccionado = cupon;
    this.nuevoCupon = { ...cupon };
  }

  resetForm() {
    this.nuevoCupon = { codigo: '', nombre: '', descuento: 0, fechaVencimiento: new Date(), estado: 'Activo', tipo: 'Porcentaje' };
    this.cuponSeleccionado = null;
  }
}