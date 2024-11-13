import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { AdminService } from "../../services/admin.service";
import * as jsPDF from 'jspdf';
import html2pdf from 'html2pdf.js';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

Chart.register(...registerables); // Registra componentes de Chart.js

class LocalidadReporte {
  constructor(
    public nombre: string,
    public cantidadVentas: number,
    public porcentaje: number,
    public totalVendido: number
  ) {}
}

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {
  codigoEvento: string = '';
  totalRecaudado: number = 0;
  totalCupones: number = 0;
  localidadReportes: LocalidadReporte[] = [];
  localidadNombres: string[] = [];
  localidadCantidadVentas: number[] = [];

  constructor(private route: ActivatedRoute, private adminService: AdminService) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.codigoEvento = params['id'];
      this.cargarDatos();
    });
  }

  cargarDatos() {
    this.adminService.obtenerReporte(this.codigoEvento).subscribe({
      next: (data) => {
        this.totalRecaudado = data.reply.totalSales;
        this.totalCupones = data.reply.totalTickets;

        this.localidadReportes = data.reply.percentageSoldByLocation.map((location: any, index: number) =>
          new LocalidadReporte(
            location.locationName,
            data.reply.quantitySoldByLocation[index].quantitySold,
            location.percentageSold,
            data.reply.soldByLocation[index].totalSold
          )
        );

        // Extrae los nombres y cantidades de ventas para el gráfico
        this.localidadNombres = this.localidadReportes.map(item => item.nombre);
        this.localidadCantidadVentas = this.localidadReportes.map(item => item.cantidadVentas);

        // Genera el gráfico con los datos cargados
        this.generarGrafico();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  generarGrafico() {
    const ctx = document.getElementById('ventasChart') as HTMLCanvasElement;
    const config: ChartConfiguration = {
      type: 'bar' as ChartType,
      data: {
        labels: this.localidadNombres,
        datasets: [
          {
            label: 'Cantidad de Ventas',
            data: this.localidadCantidadVentas,
            backgroundColor: '#c794fa',
            borderColor: '#65558f',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        }
      }
    };

    new Chart(ctx, config);
  }

  generarPDF(): void {
    const element = document.getElementById('content-to-pdf');
    const fechaActual = new Date();
    const fechaHora = fechaActual.toISOString().replace(/[:.]/g, '_');
    const nombreArchivo = `ReporteEvento_${fechaHora}.pdf`;

    const options = {
      filename: nombreArchivo,
      jsPDF: { format: 'a3' }
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
