import { Component } from '@angular/core';
import { AbstractControl, AbstractControlOptions, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Validators } from '@angular/forms'
import { AuthService } from '../../services/auth.service';
import { CrearCuentaDTO } from '../../dto/crear-cuenta-dto';
import Swal from 'sweetalert2';
import { Router, RouterModule } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
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
      dni: ['', [Validators.required, Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.maxLength(255)]],
      phoneNumber: ['', [Validators.required, this.numberLengthValidator(10, 15)]],
      password: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(7)]],
      confirmaPassword: ['', [Validators.required]]
    },
      { validators: this.passwordsMatchValidator } as AbstractControlOptions

    );
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

  public register() {
    this.isLoading = true;
    const crearCuenta = this.registerForm.value as CrearCuentaDTO;
    console.log(crearCuenta);
    
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
        this.isLoading = false;
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
