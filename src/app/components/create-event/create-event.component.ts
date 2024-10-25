import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { EventosService } from '../../servicios/EventosService';
import Swal from 'sweetalert2';
import { EventoDTO } from '../../dto/eventoDTO';
import { LocalidadDTO } from '../../dto/localidadDTO';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';




@Component({

  selector: 'app-create-event',
  standalone: true,
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.css',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,

  ]

})


export class CreateEventComponent implements OnChanges{

  @Input() event: EventoDTO | undefined;
  @Input() readOnly: boolean = false;
  @Input() updateOnly: boolean = false
  eventTypes: string[];
  createEventForm!: FormGroup;
  eventosService: EventosService = new EventosService;
  coverImage: string | ArrayBuffer | null = null;
  localitiesImage: string | ArrayBuffer | null = null;

  constructor(private formBuilder: FormBuilder) {
    this.createForm();
    this.eventTypes = ['SPORT', 'CONCERT', 'CULTURAL', 'FASHION', 'BEAUTY', 'OTHER'];
  }

  private createForm() {
    this.createEventForm = this.formBuilder.group({
      name: [{ value: '', disabled: this.readOnly }, [Validators.required]],
      address: [{ value: '', disabled: this.readOnly }, [Validators.required]],
      city: [{ value: '', disabled: this.readOnly }, [Validators.required]],
      coverImage: [{ value: '', disabled: this.readOnly }, [Validators.required]],
      localitiesImage: [{ value: '', disabled: this.readOnly }, [Validators.required]],
      date: [{ value: '', disabled: this.readOnly }, [Validators.required]],
      description: [{ value: '', disabled: this.readOnly }, [Validators.required]],
      type: [{ value: '', disabled: this.readOnly }, [Validators.required]],
      locations: this.formBuilder.array([])
    });
  }

// Método para actualizar el evento
public mostrarActualizarEvento() {
  this.updateOnly=true;
  this.readOnly = false;
  this.toggleFormControls(this.readOnly);
}

public guardarCambios(){
  if (this.createEventForm.valid) {
    // Obtén el ID del evento actual, asegurándote de que exista
    const id = this.event?.id; // Asegúrate de que este ID exista en tu objeto EventoDTO

    if (!id) {
      Swal.fire("Error!", "No se puede actualizar el evento. ID no encontrado.", "error");
      return;
    }

    // Obtén los valores del formulario
    const updatedEvent: EventoDTO = this.createEventForm.value as EventoDTO;

    // Llama al método del servicio para actualizar el evento
    this.eventosService.actualizar(id, updatedEvent);

    // Notifica al usuario sobre el éxito de la operación
    Swal.fire("Éxito!", "El evento ha sido actualizado.", "success");
    this.readOnly = true;
    this.updateOnly = false;
    this.toggleFormControls(this.readOnly);
  } else {
    Swal.fire("Advertencia!", "Por favor, completa todos los campos requeridos.", "warning");
  }

}


  ngOnChanges(changes: SimpleChanges) {
    if (changes['event'] && this.event) {
      this.loadEventData();
    }
    if (changes['readOnly']) {
      this.toggleFormControls(this.readOnly);
    }

  }

  private toggleFormControls(disabled: boolean) {
    if (disabled) {
      this.createEventForm.disable();
    } else {
      this.createEventForm.enable();
    }
  }

  private loadEventData() {
    if (this.event) {
      this.createEventForm.patchValue({
        name: this.event.nombre,
        address: this.event.direccion,
        city: this.event.ciudad,
        date: this.convertToDateTimeLocalString(this.event.fecha),
        description: this.event.descripcion,
        type: this.event.tipo,
        coverImage: this.event.imagenPortada,
        localitiesImage: this.event.imagenLocalidades
      });
      // Limpiar el FormArray antes de añadir nuevas localidades
      const locationsArray = this.createEventForm.get('locations') as FormArray;

      if (this.event.localidades) {
        this.event.localidades.forEach(location => {
          locationsArray.push(this.createLocalityShow(location));
          console.log(location)
          console.log(locationsArray.value)
        });
      }
    }
  }

  convertToDateTimeLocalString(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }



  //Por ahora esta funcion solo imprime en conosola, luego será una que haga la solicitus HTTP
  public crearEvento() {
    if (this.createEventForm.valid) {
      this.eventosService.crear(this.createEventForm.value as EventoDTO);
      Swal.fire("Exito!", "Se ha creado un nuevo evento.", "success");
    } else {
      Swal.fire("Advertencia!", "Por favor, completa todos los campos requeridos.", "warning");
    }
  }


   public onFileChange(event: any, tipo: string) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (e: any) => {
        switch (tipo) {
          case 'locations':
            this.createEventForm.get('localitiesImage')?.setValue(file);
            this.localitiesImage = e.target.result;
            break;
          case 'cover':
            this.createEventForm.get('coverImage')?.setValue(file);
            this.coverImage = e.target.result;
            break;
        }
      };

      reader.readAsDataURL(file);
    }
  }

  private createLocalityShow(localidad: LocalidadDTO): FormGroup {  // Método para crear localidad
    return this.formBuilder.group({
      name: [localidad.nombre, Validators.required],
      price: [localidad.precio, [Validators.required, Validators.min(0)]],
      maxCapacity: [localidad.capacidad, [Validators.required, Validators.min(1)]]
    });
  }

  // Método que crea un subformulario para una localidad
private createLocality(): FormGroup {
  return this.formBuilder.group({
    name: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
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
