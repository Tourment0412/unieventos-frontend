import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { AdminService } from "../../services/admin.service";
import * as jsPDF from 'jspdf';
import html2pdf from 'html2pdf.js';

class LocalidadReporte {
  nombre: string;
  cantidadVentas: number;
  porcentaje: number;
  totalVendido: number;

  constructor(nombre: string, cantidadVentas: number, porcentaje: number, totalVendido: number) {
    this.nombre = nombre;
    this.cantidadVentas = cantidadVentas;
    this.porcentaje = porcentaje;
    this.totalVendido = totalVendido;
  }
}

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css'] // Corregido: styleUrls en plural
})

export class ReportesComponent {
  codigoEvento: string = '';
  totalRecaudado: number = 0; // Cambiado a tipo number
  totalCupones: number = 0; // Cambiado a tipo number
  localidadReportes: LocalidadReporte[] = [];

  constructor(private route: ActivatedRoute, private adminService: AdminService) {
    this.route.params.subscribe((params) => {
      this.codigoEvento = params['id'];
      this.adminService.obtenerReporte(this.codigoEvento).subscribe({
        next: (data) => {
          this.totalRecaudado = data.reply.totalSales;
          this.totalCupones = data.reply.totalTickets;

          const tam = data.reply.percentageSoldByLocation.length;
          this.localidadReportes = []; // Limpia el array antes de llenarlo

          for (let i = 0; i < tam; i++) {
            this.localidadReportes.push(
              new LocalidadReporte(
                data.reply.percentageSoldByLocation[i].locationName,
                data.reply.quantitySoldByLocation[i].quantitySold,
                data.reply.percentageSoldByLocation[i].percentageSold,
                data.reply.soldByLocation[i].totalSold
              )
            );
          }
        },
        error: (error) => {
          console.error(error);
        },
      });
    });
  }

  generarPDF(): void {
    const element = document.getElementById('content-to-pdf');
    const fechaActual = new Date();
    const fechaHora = fechaActual.toISOString().replace(/[:.]/g, '_');
    const nombreArchivo = `ReporteEvento_${fechaHora}.pdf`;

    const options = {
      filename: nombreArchivo,
      jsPDF: { format: 'a4' }
    };
    if (element) {
      html2pdf().set(options).from(element).save();
    } else {
      console.error("No se encontró el elemento con id 'content-to-pdf'");
    }
  }

  trackByIndex(index: number): number {
    return index;
  }
}
