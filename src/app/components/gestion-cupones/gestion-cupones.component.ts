import { Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormGroup, FormsModule, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-cupones',
  templateUrl: './gestion-cupones.component.html',
  styleUrls: ['./gestion-cupones.component.css'],
  standalone: true,
  imports: [BrowserModule, FormsModule, ReactiveFormsModule]
})

export class GestionCuponesComponent implements OnInit {
  cupones: any[] = [];
  cuponSeleccionado: any | null = null;
  crearCuponForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.cargarCupones();
    this.couponForm();
  }

  private couponForm() {
    this.crearCuponForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      descuento: ['', [Validators.required, Validators.maxLength(10)]],
      fechaVencimiento: ['', [Validators.required]],
      tipo: ['', [Validators.required]]
    });
  }

  cargarCupones() {
    this.cupones = [
      { codigo: 'CUPON1', nombre: 'Descuento Verano', descuento: 20, fechaVencimiento: new Date('2024-12-31'), estado: 'Activo', tipo: 'Porcentaje' },
      { codigo: 'CUPON2', nombre: 'Descuento Invierno', descuento: 15, fechaVencimiento: new Date('2025-01-31'), estado: 'Inactivo', tipo: 'Monto Fijo' }
    ];
  }

  crearCupon() {
    if (this.crearCuponForm.invalid) return;

    const nuevoCupon = this.crearCuponForm.value;
    if (this.cuponSeleccionado) {
      // Actualizar cupón existente
      const index = this.cupones.findIndex(c => c.codigo === this.cuponSeleccionado.codigo);
      if (index !== -1) this.cupones[index] = { ...nuevoCupon, codigo: this.cuponSeleccionado.codigo };
    } else {
      // Crear nuevo cupón
      nuevoCupon.codigo = `CUPON${this.cupones.length + 1}`;
      this.cupones.push(nuevoCupon);
    }

    Swal.fire('Operación exitosa', `El cupón ha sido ${this.cuponSeleccionado ? 'actualizado' : 'creado'}.`, 'success');
    this.resetForm();
  }

  seleccionarCupon(cupon: any) {
    this.cuponSeleccionado = cupon;
    this.crearCuponForm.patchValue(cupon);
  }

  eliminarCupon(codigo: string) {
    this.cupones = this.cupones.filter(c => c.codigo !== codigo);
  }

  resetForm() {
    this.crearCuponForm.reset();
    this.cuponSeleccionado = null;
  }
}
