import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MensajeDTO } from '../dto/mensaje-dto';
import { EventFilterDTO } from '../dto/event-filter-dto';

@Injectable({
  providedIn: 'root'
})
export class PublicoService {

  private publicoURL = "http://localhost:8080/api/public";
  constructor(private http: HttpClient) { }
  //TODO hacer este metodo en el backend para obtener los diferentes tipos de eventos (Hasta el controlador)
  public listarTipos(): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.publicoURL}/event/get-types`);
  }
  //TODO hacer este metodo en el backend para poder obtener todas las ciudades de armenia
  public listarCiudades(): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.publicoURL}/event/get-cities`);
  }

  public listarEstados(): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.publicoURL}/event/get-statuses`);
  }

  public listarEventos(pagina: number): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.publicoURL}/event/get-all/${pagina}`);
  }
  public obtenerEvento(id: string): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.publicoURL}/event/get-info/${id}`);
  }
  public filtroEventos(eventFilterDTO: EventFilterDTO): Observable<MensajeDTO>{
    return this.http.post<MensajeDTO>(`${this.publicoURL}/event/filter-events`, eventFilterDTO);
  }

  //TODO preguntar lo del recibir noitficacion
}
