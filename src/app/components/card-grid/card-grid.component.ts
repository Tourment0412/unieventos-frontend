import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventItemDTO } from '../../dto/event-item-dto';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-card-grid',
  standalone: true,
  imports: [CommonModule, RouterModule,],
  templateUrl: './card-grid.component.html',
  styleUrl: './card-grid.component.css'
})
export class CardGridComponent {

  @Input() events: EventItemDTO[]=[]
  constructor(private router: Router, private tokenService: TokenService) {
    this.events = [];
  }

  irADetalleEvento(eventoId: string): void {
    const rol = this.tokenService.getRol();
    console.log(rol);
    
    if (rol == 'CLIENT'|| rol == '') {
      this.router.navigate(['/detalle-evento', eventoId]);
    }
    
    
  }

}
