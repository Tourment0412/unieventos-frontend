import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MensajeDTO } from '../dto/mensaje-dto';
import { Observable } from 'rxjs';
import { CrearEventoDTO } from '../dto/crear-evento-dto';
import { EditarEventoDTO } from '../dto/editar-evento-dto';
import { CouponItemDTO } from '../dto/coupon-item-dto';
import {EventFilterDTO} from '../dto/event-filter-dto';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private adminURL = "http://localhost:8080/api/admin";
  constructor(private http: HttpClient) { }
  public crearEvento(crearEventoDTO: CrearEventoDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.adminURL}/event/create`, crearEventoDTO);
  }
  public actualizarEvento(editarEventoDTO: EditarEventoDTO): Observable<MensajeDTO> {
    return this.http.put<MensajeDTO>(`${this.adminURL}/event/update`, editarEventoDTO);
  }
  public obtenerEvento(id: string): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.adminURL}/event/get/${id}`);
  }
  public eliminarEvento(id: string): Observable<MensajeDTO> {
    return this.http.delete<MensajeDTO>(`${this.adminURL}/event/delete/${id}`);
  }
  public listarEventosAdmin(pagina: number): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.adminURL}/event/get-all/${pagina}`);
  }
  public subirImagen(imagen: FormData): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.adminURL}/image/upload`, imagen);
  }
  public obtenerCuponesAdmin(pagina: number): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.adminURL}/coupon/get-all/${pagina}`);
  }

  public listarTiposCupon(): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.adminURL}/coupon/get-types`);
  }

  public listarEstadosCupon(): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.adminURL}/coupon/get-statuses`);
  }

  public crearCupon(cuponDTO: CouponItemDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.adminURL}/coupon/create`, cuponDTO);
  }

  public actualizarCupon(cuponDTO: CouponItemDTO): Observable<MensajeDTO> {
    return this.http.put<MensajeDTO>(`${this.adminURL}/coupon/update`, cuponDTO);
  }

  public eliminarCupon(id: string): Observable<MensajeDTO> {
    return this.http.delete<MensajeDTO>(`${this.adminURL}/coupon/delete/${id}`);
  }

  public filtroEventosAdmin(eventFilterDTO: EventFilterDTO): Observable<MensajeDTO>{
    return this.http.post<MensajeDTO>(`${this.adminURL}/event/filter-events`, eventFilterDTO);
  }

  public obtenerReporte(id: string): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.adminURL}/event/reports-info/${id}`);
  }


  //TODO add other methods that need to be implemented for the Admin
  //TODO maybe gonna do another home component for the admin that gonna re use the cardgrid component
  // for the exclusive admin events (All)
}
