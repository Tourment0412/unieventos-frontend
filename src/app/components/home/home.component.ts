import { Component } from '@angular/core';
import { CardGridComponent } from "../card-grid/card-grid.component";
import { PublicoService } from '../../services/publico.service';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {LoginDTO} from '../../dto/login-dto';
import {EventFilterDTO} from '../../dto/event-filter-dto';
import {EventoDTO} from '../../dto/eventoDTO';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardGridComponent, FormsModule,ReactiveFormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  currentPage: number = 0;
  filterForm!: FormGroup;
  eventos: [] = [];
  seleccionados: EventoDTO[];
  eventsAvailable: boolean = true;
  pages: number[] = [];
  filterUsed: boolean = false;
  tipos: string[]=[];

  typeSelected: boolean = false;
  constructor(private publicoService: PublicoService,private formBuilder: FormBuilder) {
    this.eventos = [];
    this.obtenerEventos(this.currentPage);
    this.obtenerTipos();
    this.createForm();

    this.seleccionados = [];
  }

  //This cero must be changed for a number variable to work correctly with pagination.
  public obtenerEventos(page: number) {
    this.publicoService.listarEventos(page).subscribe({
      next: (data) => {
        console.log(data);
        this.pages = new Array(data.reply.totalPages);
        this.eventos = data.reply.events;
        this.currentPage=page;
        this.actualizarEventsAvailable();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  public obtenerTipos() {
    this.publicoService.listarTipos().subscribe({
      next: (data) => {
        this.tipos = data.reply;
      },
      error: (error) => {
        console.error(error);
    }});
  }

  createForm() {
    this.filterForm = this.formBuilder.group({
      name: [''],
      city: [''],
      eventType: ['OTHER'],
    });
  }

  public filter(page: number) {
    const eventFilterDTO = this.filterForm.value as EventFilterDTO;
    eventFilterDTO.page=page;
    console.log(eventFilterDTO);
    if (eventFilterDTO.eventType == null || eventFilterDTO.eventType == "") {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Seleccione un tipo de evento'
      })
    }
    this.publicoService.filtroEventos(eventFilterDTO).subscribe({
      next: (data) => {
        this.pages = new Array(data.reply.totalPages);
        this.eventos = data.reply.events;
        this.currentPage=eventFilterDTO.page;
        this.filterUsed=true;
        this.actualizarEventsAvailable();
        //this.resetForm();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  public nextPage() {
    this.currentPage++;
    if (this.filterUsed) {
      this.filter(this.currentPage)
    } else {
      this.obtenerEventos(this.currentPage);
    }
    this.actualizarEventsAvailable();
  }

  public previousPage() {
    this.currentPage--;
    if (this.filterUsed) {
      this.filter(this.currentPage)
    } else {
      this.obtenerEventos(this.currentPage);
    }
  }

  public actualizarEventsAvailable() {
    this.eventsAvailable = this.currentPage < this.pages.length-1;
  }

  public resetForm() {
    this.filterForm.reset();
  }


}

