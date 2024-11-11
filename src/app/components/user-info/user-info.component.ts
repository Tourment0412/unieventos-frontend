import { Component } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TokenService } from '../../services/token.service';
import { InfoCuentaDTO } from '../../dto/info-cuenta-dto';
import { AccountService } from '../../services/account.service';
import { ActualizarCuentaDTO } from '../../dto/actualizar-cuenta-dto';
import Swal from 'sweetalert2';
import { S } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css'
})
export class UserInfoComponent {

  account?: InfoCuentaDTO;
  userInforForm!: FormGroup;
  isEditing: boolean = false;

  constructor(private formBuilder: FormBuilder, private tokenService: TokenService, private accountService: AccountService) {
    // Create the form group when the component is initialized.
    this.obtenerInformacionUsuario();
    this.createForm();
  }

  private createForm() {
    this.userInforForm = this.formBuilder.group({
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      dni: [{ value: '', disabled: true }, [Validators.required]],
      name: [{ value: '', disabled: true }, [Validators.required]],
      phoneNumber: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(10)]],
      address: [{ value: '', disabled: true }, [Validators.required]],
      password: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(7)]],
      confirmaPassword: ['', [Validators.required]]
    },
    { validators: this.passwordsMatchValidator } as AbstractControlOptions);
  }

  passwordsMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmaPassword = formGroup.get('confirmaPassword')?.value;
    // Si las contraseñas no coinciden, devuelve un error, de lo contrario, null
    return password == confirmaPassword ? null : { passwordsMismatch: true };

  }

  enableEditing() {
    this.isEditing = true;
    Object.keys(this.userInforForm.controls).forEach(controlName => {
      if (controlName !== 'email' && controlName !== 'dni') {
        this.userInforForm.controls[controlName].enable();
      }
    });
  }

  public deleteAccount() {
    this.accountService.eliminarCuenta(this.account!.id).subscribe({
      next: (data) => {
        Swal.fire({
          title: 'Cuenta eliminada',
          text: 'La cuenta se ha eliminado correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        })
        setTimeout(() => {
          this.tokenService.logout();
        }, 1000);
      }, error: (error) => {
        Swal.fire({
          title: 'Error',
          text: error.error.reply,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        })
      },
    });
    
  }

  public disableEditing() {
    this.loadAccountData();
    this.isEditing = false;
    this.userInforForm.disable();
  }
  saveChanges() {
    
    const cuentaActualizar= this.userInforForm.value as ActualizarCuentaDTO;
    cuentaActualizar.id = this.account!.id;

    console.log(cuentaActualizar);
    

    if(cuentaActualizar.password === ''){
      Swal.fire({
        title: 'Error',
        text: 'La contraseña no puede estar vacía',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      })
      this.resetForm();
      this.loadAccountData();
      return;
    }

    this.accountService.actualizarCuenta(cuentaActualizar).subscribe({
      next: (data) => {
        
        Swal.fire({
          title: 'Datos Actualizados',
          text: 'La cuenta se ha actualiado correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        })
        this.isEditing = false;
        this.userInforForm.disable();
        this.resetForm();
        this.loadAccountData();
      }, error: (error) => {
        Swal.fire({
          title: 'Error',
          text: error.error.reply,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        })
      },
    });
  }

  public loadAccountData() {
    if (this.account) {
      this.userInforForm.patchValue({
        email: this.account.email,
        dni: this.account.dni,
        name: this.account.name,
        phoneNumber: this.account.phoneNumber,
        address: this.account.address,
      });
    }
  }

  public obtenerInformacionUsuario() {
    const id = this.tokenService.getIDCuenta();
    const role= this.tokenService.getRol();
    console.log(role);
    
    this.accountService.obtenerInformacion(id).subscribe({
      next: (data) => {
        this.account = data.reply;
        console.log(this.account);
        this.loadAccountData();
      }, error: (error) => {
        console.log(error);
      },
    });
  }


  public resetForm() {
    this.userInforForm.reset();
  }


}