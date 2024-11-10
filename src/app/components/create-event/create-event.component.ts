import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { EventosService } from '../../services/eventos.service';
import Swal from 'sweetalert2';
import { EventoDTO } from '../../dto/eventoDTO';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PublicoService } from '../../services/publico.service';
import { AdminService } from '../../services/admin.service';
import { CrearEventoDTO } from '../../dto/crear-evento-dto';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalityDTO } from '../../dto/locality-dto';
import { EditarEventoDTO } from '../../dto/editar-evento-dto';




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


export class CreateEventComponent {

  event?: EventoDTO;
  updateOnly: boolean = false
  eventTypes: string[];
  ciudades: string[];
  estados: string[];
  codigoEvento: string = '';
  createEventForm!: FormGroup;

  eventosService: EventosService = new EventosService;

  imagenPortada?: File;
  imagenLocalidades?: File;

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, 
    private publicoService: PublicoService, private adminService: AdminService, private router: Router) {

    this.route.params.subscribe((params) => {
      this.codigoEvento = params['id'];
      if (this.codigoEvento) {
        console.log("Hola");
        this.updateOnly = true;
        this.getEvent();
      }
    });

    this.createForm();
    this.eventTypes = [];
    this.ciudades = [];
    this.estados = [];
    this.listarCiudades();
    this.listarTipos();
    this.listarEstados();
  }

  public getEvent() {
    this.adminService.obtenerEvento(this.codigoEvento).subscribe({
      next: (data) => {
        this.event = data.reply;
        console.log(this.event);
        this.loadEventData()



      },
      error: (error) => {
        console.error(error);
      },
    })
  }

  private createForm() {
    this.createEventForm = this.formBuilder.group({
      name: ["", [Validators.required]],
      address: ["", [Validators.required]],
      city: ["", [Validators.required]],
      coverImage: ["", [Validators.required]],
      localitiesImage: ["", [Validators.required]],
      date: ["", [Validators.required]],
      description: ["", [Validators.required]],
      type: ["", [Validators.required]],
      status: [""],
      locations: this.formBuilder.array([])
    });
  }


  public guardarCambios() {
    const editarEventoDTO = this.createEventForm.value as EditarEventoDTO;
    editarEventoDTO.id = this.codigoEvento;
    this.adminService.actualizarEvento(editarEventoDTO).subscribe({
      next: data => {
        Swal.fire("Exito!", "Se ha actualizado el evento.", "success");
        this.router.navigate(['/gestion-eventos']);
      },
      error: error => {
        Swal.fire("Error!", error.error.respuesta, "error");
      }
    })

  }

  public crearEvento() {
    const crearEventoDTO = this.createEventForm.value as CrearEventoDTO;
    this.adminService.crearEvento(crearEventoDTO).subscribe({
      next: data => {
        Swal.fire("Exito!", "Se ha creado un nuevo evento.", "success");
        this.router.navigate(['/gestion-eventos']);
      },
      error: error => {
        Swal.fire("Error!", error.error.respuesta, "error");
      }
    });
  }

  private loadEventData() {
    if (this.event) {
      this.createEventForm.patchValue({
        name: this.event.name,
        address: this.event.address,
        city: this.event.city,
        date: this.event.date,
        description: this.event.description,
        type: this.event.type,
        status: this.event.status,
        coverImage: this.event.coverImage,
        localitiesImage: this.event.localitiesImage
      });
      // Limpiar el FormArray antes de añadir nuevas localidades
      const locationsArray = this.createEventForm.get('locations') as FormArray;

      if (this.event.locations) {
        this.event.locations.forEach(location => {
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






  public onFileChange(event: any, tipo: string) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      tipo == 'localidades' ? (this.imagenLocalidades = file) : (this.imagenPortada = file);
    }
  }
  private createLocalityShow(localidad: LocalityDTO): FormGroup {  // Método para crear localidad
    return this.formBuilder.group({
      name: [localidad.name, Validators.required],
      price: [localidad.price, [Validators.required, Validators.min(0)]],
      maxCapacity: [localidad.maxCapacity, [Validators.required, Validators.min(1)]]
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

  public listarEstados() {
    this.publicoService.listarEstados().subscribe({
      next: (data) => {
        this.estados = data.reply
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
        console.log(data.reply);
      },
      error: (error) => {
        Swal.fire("Error!", error.error.respuesta, "error");
      }
    });
  }


}
