import { Component, QueryList, ViewChildren } from '@angular/core';
import { EventosService } from '../../services/eventos.service';
import { RouterModule } from '@angular/router';
import { EventoDTO } from '../../dto/eventoDTO';
import Swal from 'sweetalert2';
import { AdminService } from '../../services/admin.service';


@Component({
  selector: 'app-gestion-eventos',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './gestion-eventos.component.html',
  styleUrl: './gestion-eventos.component.css'
})
export class GestionEventosComponent {

  @ViewChildren('check') checkboxes!: QueryList<any>;

  eventos: EventoDTO[];
  seleccionados: EventoDTO[];
  textoBtnEliminar: String;
  currentPage: number = 0;
  pages: number[] = [];

  eventsAvailable: boolean = true;

  constructor(public EventosService: EventosService, private adminService: AdminService) {
    //this.eventos = EventosService.listar();
    this.eventos = [];
    this.obtenerEventos(this.currentPage);

    this.seleccionados = [];
    this.textoBtnEliminar = ""

  }

  private reiniciarCheckboxes() {
    if (this.checkboxes) {
      this.checkboxes.forEach((checkbox) => {
        checkbox.nativeElement.checked = false;
      });
    }
  }

  public seleccionar(evento: EventoDTO, estado: boolean) {


    if (estado) {
      this.seleccionados.push(evento);
    } else {
      this.seleccionados.splice(this.seleccionados.indexOf(evento), 1);
    }


    this.actualizarMensaje();


  }


  private actualizarMensaje() {
    const tam = this.seleccionados.length;


    if (tam != 0) {
      if (tam == 1) {
        this.textoBtnEliminar = "1 elemento";
      } else {
        this.textoBtnEliminar = tam + " elementos";
      }
    } else {
      this.textoBtnEliminar = "";
    }
  }

  public confirmarEliminacion() {
    Swal.fire({
      title: "Estas seguro?",
      text: "No podras revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminalo!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarEventos();
        Swal.fire({
          title: "Eliminado!",
          text: "Se han eliminado los eventos seleccionados.",
          icon: "success"
        });
      }
    });
  }


  public eliminarEventos() {
    this.seleccionados.forEach(e1 => {
      this.adminService.eliminarEvento(e1.id).subscribe({
        next: (data) => {
          this.seleccionados = [];
          this.actualizarMensaje();
          this.reiniciarCheckboxes();
        },
        error: (error) => {
          console.error(error);
        },
      });
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
    this.eventsAvailable = this.currentPage < this.pages.length - 1;
  }

  //TODO aca tambien debo de la variable para manejar la paginacion correspondiente 
  public obtenerEventos(page: number) {
    this.adminService.listarEventosAdmin(page).subscribe({
      next: (data) => {
        this.pages = new Array(data.reply.totalPages);
        this.eventos = data.reply.events;
        this.currentPage = page;
        this.actualizarEventsAvailable();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }


}





