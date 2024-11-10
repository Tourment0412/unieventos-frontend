import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css'
})
export class UserInfoComponent {

  userInforForm!: FormGroup;
  isEditing: boolean = false;

  constructor(private formBuilder: FormBuilder) {
    // Create the form group when the component is initialized.
    this.createForm();
  }

  private createForm() {
    this.userInforForm = this.formBuilder.group({
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      dni: [{ value: '', disabled: true }, [Validators.required]],
      name: [{ value: '', disabled: true }, [Validators.required]],
      phone: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(10)]],
      address: [{ value: '', disabled: true }, [Validators.required]],
    });
  }

  enableEditing() {
    this.isEditing = true;
    this.userInforForm.enable();
  }

  saveChanges() {
    // Logic to save changes
    this.isEditing = false;
    this.userInforForm.disable();
  }
}