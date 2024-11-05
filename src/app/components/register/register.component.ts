import { Component } from '@angular/core';
import { AbstractControlOptions, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Validators } from '@angular/forms'
import { AuthService } from '../../services/auth.service';
import { CrearCuentaDTO } from '../../dto/crear-cuenta-dto';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {


  showValidationCodeComponent = false;
  isLoading=false;

  registerForm!: FormGroup;
  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router, private dataService: DataService) {
    this.createForm();
  }

  private createForm() {
    //TODO: verificar que en estas validaciones se incluyan las que ya se tenian escritas en DTO respectivo  
    this.registerForm = this.formBuilder.group({
      dni: ['', [Validators.required]],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.maxLength(10)]],
      password: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(7)]],
      confirmaPassword: ['', [Validators.required]]
    },
      { validators: this.passwordsMatchValidator } as AbstractControlOptions

    );
  }

  public register() {
    this.isLoading = true;
    const crearCuenta = this.registerForm.value as CrearCuentaDTO;
    this.authService.crearCuenta(crearCuenta).subscribe({
      next: (data) => {
        this.isLoading = false;
        Swal.fire({
          title: 'Cuenta creada',
          text: 'La cuenta se ha creado correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        })
        console.log(this.registerForm.get('email')?.value);
        this.dataService.setData(this.registerForm.get('email')?.value);
        console.log(this.dataService.getData());
        this.router.navigate(['/validar-cuenta']);
      },
      error: (error) => {
        Swal.fire({
          title: 'Error',
          text: error.error.respuesta,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        })
      }
    });
  }

  passwordsMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmaPassword = formGroup.get('confirmaPassword')?.value;
    // Si las contraseñas no coinciden, devuelve un error, de lo contrario, null
    return password == confirmaPassword ? null : { passwordsMismatch: true };

  }




}
