import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {AdminService} from "../../services/admin.service";
import * as jsPDF from 'jspdf';
import html2pdf from 'html2pdf.js';

class LocalidadReporte {
  nombre: string;
  cantidadVentas: number;
  porcentaje: number;
  totalVendido: number;

  constructor(nombre: string,cantidadVentas: number,porcentaje: number,totalVendido: number) {
    this.nombre=nombre;
    this.cantidadVentas=cantidadVentas;
    this.porcentaje=porcentaje;
    this.totalVendido=totalVendido;
  }
}

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css'
})



export class ReportesComponent {




  codigoEvento: string = '';
  totalRecaudado: string = '';
  totalCupones: string = '';
  localidadReportes: LocalidadReporte[] = [];
  constructor(private route: ActivatedRoute,private adminService: AdminService) {
    this.route.params.subscribe((params) => {
      this.codigoEvento = params['id'];
      this.adminService.obtenerReporte(this.codigoEvento).subscribe({
        next: (data) => {
          this.totalRecaudado=data.reply.totalSales;
          this.totalCupones=data.reply.totalTickets;
          let tam = data.reply.percentageSoldByLocation.length;
          for (let i = 0; i < tam; i++) {
            console.log(data.reply.percentageSoldByLocation[i]);
            this.localidadReportes.push(
                new LocalidadReporte(data.reply.percentageSoldByLocation[i].locationName,
                    data.reply.quantitySoldByLocation[i].quantitySold,
                    data.reply.percentageSoldByLocation[i].percentageSold,
                    data.reply.soldByLocation[i].totalSold,
                ));
          }
          console.log(data.reply);
        },
        error: (error) => {
          console.error(error);
        },
      })
    });
  }

  generarPDF(): void {
    const element = document.getElementById('content-to-pdf');

    // Obtener fecha y hora actual
    const fechaActual = new Date();
    const anio = fechaActual.getFullYear();
    const mes = String(fechaActual.getMonth() + 1).padStart(2, '0'); // Mes es de 0-11, sumamos 1
    const dia = String(fechaActual.getDate()).padStart(2, '0');
    const hora = String(fechaActual.getHours()).padStart(2, '0');
    const minutos = String(fechaActual.getMinutes()).padStart(2, '0');
    const segundos = String(fechaActual.getSeconds()).padStart(2, '0');
    const fechaHora = `${anio}_${mes}_${dia} T${hora}_${minutos}_${segundos}`;
    const nombreArchivo = `ReporteEvento_${fechaHora}.pdf`;
    const options = {
      filename: nombreArchivo,
      jsPDF: { format: 'a4' }
    };
    html2pdf().set(options).from(element).save();
  }

}
