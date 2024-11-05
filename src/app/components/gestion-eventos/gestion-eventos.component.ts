import { Component } from '@angular/core';
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


  eventos: EventoDTO[];
  seleccionados: EventoDTO[];
  textoBtnEliminar: String;
  currentPage: number = 0;
  pages: number[] = [0];
  eventosSiguientePag: EventoDTO[];

  eventsAvailable: boolean = true;

  constructor(public EventosService: EventosService, private adminService: AdminService) {
    //this.eventos = EventosService.listar();
    this.eventos = [];
    this.eventosSiguientePag=[];
    this.obtenerEventos(this.currentPage);
    this.obtenerEventosSig(this.currentPage);
    this.actualizarEventsAvailable();
    console.log(this.eventosSiguientePag);
    console.log(this.eventsAvailable);
    
    
    this.seleccionados = [];
    this.textoBtnEliminar = ""
    
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
      title: "Estás seguro?",
      text: "Esta acción cambiará el estado de los eventos a Inactivos.",
      icon: "error",
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarEventos();
        Swal.fire("Eliminados!", "Los eventos seleccionados han sido eliminados.", "success");
      }
    });
  }


  public eliminarEventos() {
    this.seleccionados.forEach(e1 => {
      this.EventosService.eliminar(e1.id);
      this.eventos = this.eventos.filter(e2 => e2.id !== e1.id);
    });
    this.seleccionados = [];
    this.actualizarMensaje();


  }

  public nextPage() {
    this.currentPage++;
    this.pages.push(this.currentPage);
    this.obtenerEventos(this.currentPage);
    this.obtenerEventosSig(this.currentPage);
    this.actualizarEventsAvailable();
    

  }

  public previousPage() {
    this.currentPage--;
    this.obtenerEventos(this.currentPage);
  }
  public actualizarEventsAvailable() {
    this.eventsAvailable = this.eventosSiguientePag.length > 0;
  }




  //TODO aca tambien debo de la variable para manejar la paginacion correspondiente 
  public obtenerEventos(page: number) {
    this.adminService.listarEventosAdmin(page).subscribe({
      next: (data) => {
        this.eventos = data.reply
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  public obtenerEventosSig(page: number) {
    this.adminService.listarEventosAdmin(page+1).subscribe({
      next: (data) => {
        this.eventosSiguientePag = data.reply
      },
      error: (error) => {
        console.error(error);
      },
    });
  }


}





