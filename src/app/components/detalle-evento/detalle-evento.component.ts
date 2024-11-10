import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { EventoDTO } from '../../dto/eventoDTO';
import { MensajeDTO } from '../../dto/mensaje-dto';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-detalle-evento',
  templateUrl: './detalle-evento.component.html',
  styleUrls: ['./detalle-evento.component.css'],
  standalone: true,
  imports: [CommonModule],  // Solo CommonModule
})
export class DetalleEventoComponent implements OnInit {
  evento: EventoDTO | null = null;
  private eventoSubscription: Subscription | null = null; // Para manejar la suscripción

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log("Evento ID:", id);

    if (id) {
      this.eventoSubscription = this.adminService.obtenerEvento(id).subscribe(
        (response: MensajeDTO) => {
          if (response && !response.error) {
            this.evento = response.reply;
            console.log("Evento cargado:", this.evento);
          } else {
            console.log('Error al cargar el evento:', response);
          }
        },
        (error) => {
          console.log('Error al obtener evento:', error);
        }
      );
    }
  }

  ngOnDestroy(): void {
    // Asegúrate de limpiar la suscripción cuando el componente se destruya
    if (this.eventoSubscription) {
      this.eventoSubscription.unsubscribe();
    }
  }

  agregarAlCarrito(localidad: any): void {
    console.log('Localidad agregada al carrito:', localidad);
  }
}
