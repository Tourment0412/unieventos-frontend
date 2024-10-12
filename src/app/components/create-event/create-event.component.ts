import { Component } from '@angular/core';
import { AbstractControlOptions, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.css'
})
export class CreateEventComponent {

  eventTypes: string[];
  createEventForm!: FormGroup;
  constructor(private formBuilder: FormBuilder) {
    this.createForm();
    this.eventTypes = ['SPORT', 'CONCERT', 'CULTURAL', 'FASHION', 'BEAUTY', 'OTHER'];
  }

  private createForm() {
    this.createEventForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      coverImage: ['', [Validators.required]],
      localitiesImage: ['', [Validators.required]],
      date: ['', [Validators.required]],
      description: ['', [Validators.required]],
      type: ['', [Validators.required]],
      locations: this.formBuilder.array([])
    });
  }

  //Por ahora esta funcion solo imprime en conosola, luego será una que haga la solicitus HTTP
  public createEvent() {
    console.log(this.createEventForm.value);
  }

  public onFileChange(event: any, tipo: string) {
    if (event.target.files.length > 0) {
      const files = event.target.files;
      switch (tipo) {
        case 'locations':
          this.createEventForm.get('localitiesImage')?.setValue(files[0]);
          // Mostrar información del archivo en la consola
          console.log('Archivo de localizaciones:', files[0]);
          console.log('Nombre:', files[0].name);
          console.log('Tamaño:', files[0].size);
          console.log('Tipo:', files[0].type);
          console.log('Última modificación:', files[0].lastModified);
          console.log('coso:', this.createEventForm.get('localitiesImage'));
          break;
        case 'cover':
          this.createEventForm.get('coverImage')?.setValue(files[0]);
          break;
      }
    }
  }


}
