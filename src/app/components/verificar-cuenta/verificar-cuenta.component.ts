import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { ActivateAccountDTO } from '../../dto/activate-account-dto';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-verificar-cuenta',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './verificar-cuenta.component.html',
  styleUrl: './verificar-cuenta.component.css'
})
export class VerificarCuentaComponent {

  verificarCuentaForm!: FormGroup;
  email: string;
  isLoading: boolean=false;

  constructor(private formbuilder: FormBuilder, private dataService: DataService, private authService: AuthService) {

    this.email = this.dataService.getData();
    this.createForm();
  }

  public createForm() {
    console.log(this.email);
    this.verificarCuentaForm = this.formbuilder.group({
      email: [this.email, [Validators.required, Validators.email]],
      registrationValidationCode: ['', [Validators.required, Validators.maxLength(6)]]
    })
  }

  public activarCuenta(){
    this.isLoading=true;
    const activarCuenta = this.verificarCuentaForm.value as ActivateAccountDTO;
    this.authService.validarCodigoRegistro(activarCuenta).subscribe({
      next: (data) => {
        this.isLoading=false;
        Swal.fire({
          title: 'Cuenta activada',
          text: 'La cuenta se ha activada correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        })
      },
      error: error => {
        Swal.fire({
          title: 'Error',
          text: error.error.respuesta,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        })
      }
    });
  }

}