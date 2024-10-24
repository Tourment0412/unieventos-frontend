import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-grid.component.html',
  styleUrl: './card-grid.component.css'
})
export class CardGridComponent {

  events = [
    {
      id: '1',
      name: 'Music Festival',
      date: new Date('2024-12-01T18:00:00'), // Fecha como objeto Date
      address: '123 Music Street, Los Angeles',
      coverImage: 'https://firebasestorage.googleapis.com/v0/b/unieventos-images-service.appspot.com/o/1c942ddf-7855-4415-8971-dd1b47f450ee-WhatsApp Image 2024-10-23 at 1.42.08 PM.jpeg?alt=media'
    },
    {
      id: '2',
      name: 'Tech Conference',
      date: new Date('2024-11-15T09:00:00'),
      address: '456 Tech Blvd, San Francisco',
      coverImage: 'https://firebasestorage.googleapis.com/v0/b/unieventos-images-service.appspot.com/o/1c942ddf-7855-4415-8971-dd1b47f450ee-WhatsApp Image 2024-10-23 at 1.42.08 PM.jpeg?alt=media'
    },
    {
      id: '3',
      name: 'Art Exhibition',
      date: new Date('2024-10-20T14:00:00'),
      address: '789 Art Gallery, New York',
      coverImage: 'https://firebasestorage.googleapis.com/v0/b/unieventos-images-service.appspot.com/o/c377ede7-6538-469a-a288-635e19d0f8d0-WhatsApp Image 2024-10-24 at 1.51.22 PM.jpeg?alt=media'
    }
  ];

  constructor() {}

}
