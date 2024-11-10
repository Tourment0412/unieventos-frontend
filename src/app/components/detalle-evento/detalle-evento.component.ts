import { Component, OnInit } from '@angular/core';
import { EventoDTO } from '../../dto/eventoDTO';
import { ActivatedRoute } from '@angular/router';
import { EventosService } from '../../services/eventos.service';
import { CommonModule } from '@angular/common';
import { CreateEventComponent } from '../create-event/create-event.component';

@Component({
  selector: 'app-detalle-evento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-evento.component.html',
  styleUrl: './detalle-evento.component.css'
})
export class DetalleEventoComponent implements OnInit {

  codigoEvento: string = '';
  evento: EventoDTO | undefined;

  constructor(private route: ActivatedRoute, private eventosService: EventosService) {
    this.route.params.subscribe((params) => {
      this.codigoEvento = params['id'];
      this.obtenerEvento();
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.codigoEvento = params['id'];
      this.obtenerEvento(); // Mueve la llamada aquí
    });
  }

  public obtenerEvento() {
    const eventoConsultado = this.eventosService.obtener(this.codigoEvento);
    if (eventoConsultado !== undefined) {
      this.evento = eventoConsultado;
    } else {
      console.error('Evento no encontrado');
    }
  }


}
