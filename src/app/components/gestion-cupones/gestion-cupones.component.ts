import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
import Swal from 'sweetalert2';
import { Validators, FormBuilder } from '@angular/forms';
import { CouponItemDTO } from '../../dto/coupon-item-dto';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-gestion-cupones',
  templateUrl: './gestion-cupones.component.html',
  styleUrls: ['./gestion-cupones.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class GestionCuponesComponent {
  cupones: CouponItemDTO[];
  nuevoCupon: any = { codigo: '', nombre: '', descuento: 0, fechaVencimiento: new Date(), estado: 'Activo', tipo: 'Porcentaje' };
  cuponSeleccionado: any | null = null;
  crearCuponForm!: FormGroup;

  pages: number[] = [];
  currentPage: number = 0;

  couponsAvailable: boolean = true;

  tipos: string[];
  estados: string[];

  constructor(private formBuilder: FormBuilder, private adminService: AdminService) {
    this.cupones = [];
    this.tipos=[];
    this.estados= [];

    this.listarTiposCupones();
    this.listarEstadosCupones();
    this.couponForm();
  
    this.cargarCupones(this.currentPage);
    
  }



  private couponForm() {
    this.crearCuponForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      discount: ['', [Validators.required,this.numberLengthValidator(1,3),Validators.min(0), Validators.max(100)]],
      expirationDate: ['', [Validators.required]],
      type: ['', [Validators.required]],
      status: ['']
    });
  }

  numberLengthValidator(minLength: number, maxLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value && (value.toString().length < minLength || value.toString().length > maxLength)) {
        return { numberLength: true };
      }
      return null;
    };
  }

  cargarCupones(page: number) {
    this.adminService.obtenerCuponesAdmin(page).subscribe({
      next: (data) => {
        this.pages = new Array(data.reply.totalPages);
        this.cupones = data.reply.coupons;
        this.currentPage = page;
        this.actualizarCuponesAvailable();
      }, error: (error) => {

      },
    });
  }

  public listarTiposCupones(){
    this.adminService.listarTiposCupon().subscribe({
      next: (data) => {
        this.tipos = data.reply;
      }, error: (error) => {
        console.log(error);
      },
    });
  }

  public listarEstadosCupones(){
    this.adminService.listarEstadosCupon().subscribe({  
      next: (data) => {
        this.estados = data.reply;
      }, error: (error) => {
        console.log(error);
      },
    });
  }

  public actualizarCuponesAvailable() {
    this.couponsAvailable = this.currentPage < this.pages.length - 1;
  }
  public previousPage() {
    this.currentPage--;
    this.cargarCupones(this.currentPage);
  }

  public nextPage() {
    this.currentPage++;
    this.cargarCupones(this.currentPage);
    this.actualizarCuponesAvailable();
  }

  crearCupon() {
    Swal.fire({
      title: '¿Desea crear el cupón?',
      showDenyButton: true,
      confirmButtonText: 'Crear',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        const cuponData= this.crearCuponForm.value as CouponItemDTO;
        cuponData.discount= cuponData.discount/100;
        
        this.adminService.crearCupon(cuponData).subscribe({
          next: (data) => {
            Swal.fire('¡Cupón creado!', 'El cupón ha sido creado exitosamente', 'success');
            this.cargarCupones(this.currentPage);
            this.resetForm();
          },
          error: (error) => {
            Swal.fire('¡Error!', 'Ha ocurrido un error al crear el cupón', 'error');
          }
        });
        
      }
    });
  }

  actualizarCupon() {
    Swal.fire({
      title: '¿Desea actualizar el cupón?',
      showDenyButton: true,
      confirmButtonText: 'Actualizar',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        const cuponData= this.crearCuponForm.value as CouponItemDTO;
        cuponData.discount= cuponData.discount/100;
        cuponData.id= this.cuponSeleccionado.id;
        this.adminService.actualizarCupon(cuponData).subscribe({
          next: (data) => {
            Swal.fire('¡Cupón actualizado!', 'El cupón ha sido actualizado exitosamente', 'success');
            this.cargarCupones(this.currentPage);
            this.resetForm();
          },
          error: (error) => {
            Swal.fire('¡Error!', 'Ha ocurrido un error al actualizar el cupón', 'error');
          }
        });
      }
    });
  }

  eliminarCupon(id: string) {
    this.adminService.eliminarCupon(id).subscribe({
      next: (data) => {
        Swal.fire('¡Cupón eliminado!', 'El cupón ha sido eliminado exitosamente', 'success');
        this.cargarCupones(this.currentPage);
        this.resetForm();
      },error: (error) => {
        Swal.fire('¡Error!', 'Ha ocurrido un error al eliminar el cupón', 'error');
      },
    })

  }

  seleccionarCupon(cupon: any) {
    this.cuponSeleccionado = cupon;
    this.crearCuponForm.patchValue({
      name: cupon.name,
      discount: cupon.discount*100,
      expirationDate: cupon.expirationDate, // Asegúrate de que este sea un string en formato 'YYYY-MM-DD'
      type: cupon.type,
      status: cupon.status
    });
  }

 

  resetForm() {
    this.crearCuponForm.reset();
    this.crearCuponForm.patchValue({
      name: '',
      discount: 0,
      expirationDate: '', // Dejarlo vacío para que no haya problemas con el formato
    });
    this.cuponSeleccionado = null;
  }
}
