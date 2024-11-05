import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { EventosService } from '../../services/eventos.service';
import Swal from 'sweetalert2';
import { EventoDTO } from '../../dto/eventoDTO';
import { LocalidadDTO } from '../../dto/localidadDTO';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PublicoService } from '../../services/publico.service';
import { AdminService } from '../../services/admin.service';
import { CrearEventoDTO } from '../../dto/crear-evento-dto';
import { ActivatedRoute } from '@angular/router';




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


export class CreateEventComponent implements OnChanges {

  @Input() event: EventoDTO | undefined;
  @Input() readOnly: boolean = false;
  @Input() updateOnly: boolean = false
  eventTypes: string[];
  ciudades: string[];
  codigoEvento: string = '';
  createEventForm!: FormGroup;

  eventosService: EventosService = new EventosService;

  imagenPortada?: File;
  imagenLocalidades?: File;

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, private publicoService: PublicoService, private adminService: AdminService) {
    
    this.route.params.subscribe((params) => {
      this.codigoEvento = params['id'];
      this.getEvent();
      //usar update only
    });

    this.createForm();
    this.eventTypes = [];
    this.ciudades = [];
    this.listarCiudades();
    this.listarTipos();
  }

  public getEvent(){
    this.adminService.obtenerEvento(this.codigoEvento).subscribe({
      next: (data) => {
        this.event = data.reply;
        this.createForm();
      },
      error: (error) => {
        console.error(error);
      },
    })
  }

  private createForm() {
    this.createEventForm = this.formBuilder.group({
      name: [{ value: this.event != null ? this.event.name : "" , disabled: this.readOnly }, [Validators.required]],
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
    this.updateOnly = true;
    this.readOnly = false;
    this.toggleFormControls(this.readOnly);
  }

  public guardarCambios() {
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
        name: this.event.name,
        address: this.event.direccion,
        city: this.event.ciudad,
        date: this.convertToDateTimeLocalString(this.event.fecha),
        description: this.event.descripcion,
        type: this.event.tipo,
        coverImage: this.event.coverImage,
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



  public crearEvento() {
    const crearEventoDTO = this.createEventForm.value as CrearEventoDTO;
    this.adminService.crearEvento(crearEventoDTO).subscribe({
      next: data => {
        Swal.fire("Exito!", "Se ha creado un nuevo evento.", "success");
      },
      error: error => {
        Swal.fire("Error!", error.error.respuesta, "error");
      }
    });
  }


  public onFileChange(event: any, tipo: string) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      tipo == 'localidades' ? (this.imagenLocalidades = file) : (this.imagenPortada = file);
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
  public listarTipos() {
    this.publicoService.listarTipos().subscribe({
      next: (data) => {
        this.eventTypes = data.reply
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  public listarCiudades() {
    this.publicoService.listarCiudades().subscribe({
      next: (data) => {
        this.ciudades = data.reply
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  public subirImagen(tipo: string) {
    const formData = new FormData();
    const imagen = tipo == 'portada' ? this.imagenPortada : this.imagenLocalidades;
    console.log(imagen);
    const formControl = tipo == 'portada' ? 'coverImage' : 'localitiesImage';
    formData.append('image', imagen!);
    this.adminService.subirImagen(formData).subscribe({
      next: (data) => {
        this.createEventForm.get(formControl)?.setValue(data.reply);
        Swal.fire("Exito!", "Se ha subido la imagen.", "success");
      },
      error: (error) => {
        Swal.fire("Error!", error.error.respuesta, "error");
      }
    });
  }


}
