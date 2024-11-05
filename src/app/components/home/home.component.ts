import { Component } from '@angular/core';
import { CardGridComponent } from "../card-grid/card-grid.component";
import { PublicoService } from '../../services/publico.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardGridComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {



  eventos: [] = [];
  constructor(private publicoService: PublicoService) {
    this.eventos = [];
    this.obtenerEventos();
  }
  //This cero must be changed for a number variable to work correctly with pagination.
  public obtenerEventos() {
    this.publicoService.listarEventos(0).subscribe({
      next: (data) => {
        this.eventos = data.reply
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}

