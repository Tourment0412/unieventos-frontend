import { Component } from '@angular/core';
import { CardGridComponent } from '../card-grid/card-grid.component';

import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-home-admin',
  standalone: true,
  imports: [CardGridComponent],
  templateUrl: './home-admin.component.html',
  styleUrl: './home-admin.component.css'
})
export class HomeAdminComponent {
  currentPage: number = 0;
  eventos: [] = [];
  pages: number[] = [];
  eventsAvailable: boolean = true;
  constructor(private adminService: AdminService) {
    this.eventos = [];
    this.obtenerEventos(0);
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

  public nextPage() {
    this.currentPage++;
    this.obtenerEventos(this.currentPage);
    this.actualizarEventsAvailable();
  }

  public previousPage() {
    this.currentPage--;
    this.obtenerEventos(this.currentPage);
  }

  public actualizarEventsAvailable() {
    this.eventsAvailable = this.currentPage < this.pages.length-1;
  }

}
