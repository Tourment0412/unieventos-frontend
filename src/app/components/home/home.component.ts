import { Component } from '@angular/core';
import { CardGridComponent } from "../card-grid/card-grid.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardGridComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  eventos: [] = [];
}
