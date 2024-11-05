import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventItemDTO } from '../../dto/event-item-dto';

@Component({
  selector: 'app-card-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-grid.component.html',
  styleUrl: './card-grid.component.css'
})
export class CardGridComponent {

  @Input() events: EventItemDTO[]=[]
  constructor() {
    this.events = [];
  }

}
