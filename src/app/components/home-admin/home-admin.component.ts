import { Component } from '@angular/core';
import { CardGridComponent } from '../card-grid/card-grid.component';

import { AdminService } from '../../services/admin.service';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PublicoService} from '../../services/publico.service';
import {EventFilterDTO} from '../../dto/event-filter-dto';

@Component({
  selector: 'app-home-admin',
  standalone: true,
  imports: [CardGridComponent,FormsModule,ReactiveFormsModule],
  templateUrl: './home-admin.component.html',
  styleUrl: './home-admin.component.css'
})
export class HomeAdminComponent {
  currentPage: number = 0;
  filterForm!: FormGroup;
  eventos: [] = [];
  pages: number[] = [];
  eventsAvailable: boolean = true;
  filterUsed: boolean = false;
  constructor(private adminService: AdminService,private formBuilder: FormBuilder) {
    this.eventos = [];
    this.createForm();
    this.obtenerEventos(0);
  }

  createForm() {
    this.filterForm = this.formBuilder.group({
      name: [''],
      city: [''],
      evenType: [''],
    });
  }

  //This cero must be changed for a number variable to work correctly with pagination.
  public obtenerEventos(page: number) {
    this.adminService.listarEventosAdmin(page).subscribe({
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

  public filter(page: number) {
    const EventFilterDTO = this.filterForm.value as EventFilterDTO;
    EventFilterDTO.page=page;
    this.adminService.filtroEventosAdmin(EventFilterDTO).subscribe({
      next: (data) => {
        this.pages = new Array(data.reply.totalPages);
        this.eventos = data.reply.events;
        this.currentPage=EventFilterDTO.page;
        this.filterUsed=true;
        this.actualizarEventsAvailable();
        this.resetForm();
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
