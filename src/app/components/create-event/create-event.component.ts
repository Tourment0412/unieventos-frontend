import { Component } from '@angular/core';
import { AbstractControlOptions, FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { EventosService } from '../../servicios/EventosService';
import Swal from 'sweetalert2';
import { EventoDTO } from '../../dto/eventoDTO';

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
  eventosService: EventosService = new EventosService;

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
  public crearEvento(){
    this.eventosService.crear(this.createEventForm.value as EventoDTO);
    Swal.fire("Exito!", "Se ha creado un nuevo evento.", "success");
   }


  public onFileChange(event: any, tipo: string) {
    if (event.target.files.length > 0) {
      const files = event.target.files;
      switch (tipo) {
        case 'locations':
          this.createEventForm.get('localitiesImage')?.setValue(files[0]);
          break;
        case 'cover':
          this.createEventForm.get('coverImage')?.setValue(files[0]);
          break;
      }
    }
  }

  // Método que crea un subformulario para una localidad
private createLocality(): FormGroup {
  return this.formBuilder.group({
    name: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    tickersSold: [0, [Validators.required, Validators.min(0)]],
    maxCapacity: [1, [Validators.required, Validators.min(1)]]
  });
}

// Método para obtener el FormArray de localidades
get locations(): FormArray {
  return this.createEventForm.get('locations') as FormArray;
}

// Método para añadir una nueva localidad
public addLocality() {
  this.locations.push(this.createLocality());
}

// Método para eliminar una localidad específica
public removeLocality(index: number) {
  this.locations.removeAt(index);
}




}
