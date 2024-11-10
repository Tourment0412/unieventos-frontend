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
  eventos: [] = [];
  constructor(private adminService: AdminService) {
    this.eventos = [];
    this.obtenerEventos();
  }
  //This cero must be changed for a number variable to work correctly with pagination.
  public obtenerEventos() {
    this.adminService.listarEventosAdmin(0).subscribe({
      next: (data) => {
        this.eventos = data.reply
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
