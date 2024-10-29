import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-correo-recuperacion',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './correo-recuperacion.component.html',
  styleUrls: ['./correo-recuperacion.component.css']
})
export class correoRecuperacionComponent {
recovery() {
throw new Error('Method not implemented.');
}
  recoveryForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.createForm();
  }

  // Método para crear el formulario con las validaciones
  private createForm() {
    this.recoveryForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  public sendVerificationCode() {
    if (this.recoveryForm.valid) {
      const email = this.recoveryForm.get('email')?.value;
      console.log(`Enviando código de verificación al correo: ${email}`);
    } else {
      console.log("Formulario inválido");
    }
  }


  public redirectToForm() {
    window.location.href = '/cambiar-password';
  }
}
