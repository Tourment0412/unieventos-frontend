import { Component } from '@angular/core';
import { CardGridComponent } from "../card-grid/card-grid.component";
import { PublicoService } from '../../services/publico.service';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {LoginDTO} from '../../dto/login-dto';
import {EventFilterDTO} from '../../dto/event-filter-dto';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardGridComponent, FormsModule,ReactiveFormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {


  filterForm!: FormGroup;
  eventos: [] = [];
  constructor(private publicoService: PublicoService,private formBuilder: FormBuilder) {
    this.eventos = [];
    this.obtenerEventos(0);
    this.createForm();
  }

  //This cero must be changed for a number variable to work correctly with pagination.
  public obtenerEventos(page: number) {
    this.publicoService.listarEventos(page).subscribe({
      next: (data) => {
        this.eventos = data.reply
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  createForm() {
    this.filterForm = this.formBuilder.group({
      name: [''],
      city: [''],
      evenType: [''],
    });
  }

  public filter() {
    const EventFilterDTO = this.filterForm.value as EventFilterDTO;
    EventFilterDTO.page=0;
    this.publicoService.filtroEventos(EventFilterDTO).subscribe({
      next: (data) => {
        this.eventos = data.reply
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

}

