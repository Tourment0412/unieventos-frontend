import { Component } from '@angular/core';
import { AbstractControlOptions, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { C, N } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-cambiar-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './cambiar-password.component.html',
  styleUrls: ['./cambiar-password.component.css']
})
export class CambiarPasswordComponent {
  changePasswordForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.createForm();
  }

  public changePassword() {
    if (this.changePasswordForm.valid) {
      console.log(this.changePasswordForm.value);
    } else {
      console.error("Formulario inválido.");
    }
  }

  private createForm() {
    this.changePasswordForm = this.formBuilder.group(
      {
        code: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(7)]],
        passwordConfirmation: ['', [Validators.required]]
      },
      { validators: this.passwordsMatchValidator } as AbstractControlOptions
    );
  }

  // Validador para confirmar que las contraseñas coincidan
  passwordsMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const passwordConfirmation = formGroup.get('passwordConfirmation')?.value;
    // Devuelve un error si las contraseñas no coinciden
    return password === passwordConfirmation ? null : { passwordsMismatch: true };
  }
}
