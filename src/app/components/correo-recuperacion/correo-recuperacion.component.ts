import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-correo-recuperacion',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './correo-recuperacion.component.html',
  styleUrls: ['./correo-recuperacion.component.css']
})
export class correoRecuperacionComponent {

  recoveryForm!: FormGroup;
  isLoading: boolean=false;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private dataService: DataService, private router: Router) {
    this.createForm();
  }

  // Método para crear el formulario con las validaciones
  private createForm() {
    this.recoveryForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  public sendValidationCode() {
    this.isLoading = true;
    this.authService.enviarCodigoRecuperacion(this.recoveryForm.get('email')?.value).subscribe({
      next: (data) => {
        this.isLoading = false;
        Swal.fire({
          title: 'Correo enviado',
          text: 'Codigo de recuperacion enviado con exito',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        })
        this.dataService.setData(this.recoveryForm.get('email')?.value);
        this.router.navigate(['/cambiar-password']);
      },
      error: error => {
        if(this.recoveryForm.get('email')?.value === '') {
          this.isLoading = false;
          Swal.fire({
            title: 'Error',
            text: 'No se ha ingresado un correo electronico',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          })
        }else{
          Swal.fire({
            title: 'Error',
            text: error.error.reply,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          })
        }
        this.isLoading = false;

      }
    })
  }

}




