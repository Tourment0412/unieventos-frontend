import { Component } from '@angular/core';
import { CouponInfoClientDTO } from '../../dto/coupon-info-client-dto';
import { ClienteService } from '../../services/cliente.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hay-cupones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hay-cupones.component.html',
  styleUrl: './hay-cupones.component.css'
})
export class HayCuponesComponent {


  coupons: CouponInfoClientDTO[] = [];

  pages: number[] = [];
  currentPage: number = 0;
  couponsAvailable: boolean = true;


  constructor(private clientService: ClienteService) {
    this.getCoupons(this.currentPage);

  }

  public previousPage() {
    this.currentPage--;
    this.getCoupons(this.currentPage);
  }
  public nextPage() {
    this.currentPage++;
    this.getCoupons(this.currentPage);
    this.actualizarCuponesAvailable();
  }

  public actualizarCuponesAvailable() {
    this.couponsAvailable = this.currentPage < this.pages.length - 1;
  }

  public getCoupons(page: number) {
    this.clientService.obtenerCuponesDisponibles(page).subscribe({
      next: (data) => {
        this.pages = new Array(data.reply.totalPages);
        this.coupons = data.reply.coupons;
        this.currentPage = page;
        this.actualizarCuponesAvailable();
        console.log(this.pages);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

}
