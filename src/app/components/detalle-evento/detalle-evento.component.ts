import { Component } from '@angular/core';
import { EventoDTO } from '../../dto/eventoDTO';
import { ActivatedRoute } from '@angular/router';
import { EventosService } from '../../servicios/EventosService';
import { CommonModule } from '@angular/common';


@Component({
 selector: 'app-detalle-evento',
 standalone: true,
 imports: [CommonModule],
 templateUrl: './detalle-evento.component.html',
 styleUrl: './detalle-evento.component.css'
})
export class DetalleEventoComponent {


 codigoEvento: string = '';
 evento: EventoDTO | undefined;


 constructor(private route: ActivatedRoute, private EventosService: EventosService) {
   this.route.params.subscribe((params) => {
     this.codigoEvento = params['id'];
     this.obtenerEvento();
   });
 }


 public obtenerEvento() {
   const eventoConsultado = this.EventosService.obtener(this.codigoEvento);
   if (eventoConsultado != undefined) {
     this.evento = eventoConsultado;
   }
 }


}
