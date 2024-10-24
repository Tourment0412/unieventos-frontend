import { Component } from '@angular/core';
import { AbstractControlOptions, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-cambiar-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './cambiar-password.component.html',
  styleUrl: './cambiar-password.component.css'
})
export class CambiarPasswordComponent {

  changePasswordForm!: FormGroup;
  constructor(private formBuilder: FormBuilder) {
    this.createForm();
  }

  public changePassword() {
    console.log(this.changePasswordForm.value);
  }

  private createForm() {
    //TODO: verificar que en estas validaciones se incluyan las que ya se tenian escritas en DTO respectivo
    this.changePasswordForm = this.formBuilder.group({
        code: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(7)]],
        passwordConfirmation: ['', [Validators.required]]
      },
      { validators: this.passwordsMatchValidator } as AbstractControlOptions

    );
  }

  passwordsMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmaPassword = formGroup.get('confirmaPassword')?.value;
    // Si las contraseñas no coinciden, devuelve un error, de lo contrario, null
    return password == confirmaPassword ? null : { passwordsMismatch: true };

  }

}
