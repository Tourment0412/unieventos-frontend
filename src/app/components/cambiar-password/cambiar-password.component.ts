import { Component } from '@angular/core';
import { AbstractControlOptions, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { C, N } from '@angular/cdk/keycodes';
import { DataService } from '../../services/data.service';
import { CambiarContraDTO } from '../../dto/cambiar-contra-dto';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cambiar-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './cambiar-password.component.html',
  styleUrls: ['./cambiar-password.component.css']
})
export class CambiarPasswordComponent {
  changePasswordForm!: FormGroup;
  email: string;

  constructor(private formBuilder: FormBuilder, private dataService: DataService, private authService: AuthService, private router: Router) {
    this.email = this.dataService.getData()
    this.createForm();
  }

  public changePassword() {
    const cambiarContra = this.changePasswordForm.value as CambiarContraDTO
    this.authService.cambiarContrasenia(cambiarContra).subscribe({
      next: (data) => {
        Swal.fire({
          title: 'Contraseña cambiada',
          text: 'La contraseña se ha cambiado, intente ingresar de nuevo',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        })
        this.router.navigate(['/']);
      },
      error: (error) => {
        Swal.fire({
          title: 'Error',
          text: error.error.reply,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        })
      }
    });

  }

  private createForm() {
    this.changePasswordForm = this.formBuilder.group(
      {
        email: [this.email, [Validators.required, Validators.email]],
        verificationCode: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(7)]],
        passwordConfirmation: ['', [Validators.required]]
      },
      { validators: this.passwordsMatchValidator } as AbstractControlOptions
    );
  }

  // Validador para confirmar que las contraseñas coincidan
  passwordsMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('newPassword')?.value;
    const passwordConfirmation = formGroup.get('passwordConfirmation')?.value;
    // Devuelve un error si las contraseñas no coinciden
    return password === passwordConfirmation ? null : { passwordsMismatch: true };
  }
}
