import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MensajeDTO } from '../dto/mensaje-dto';
import { Observable } from 'rxjs';
import { CrearEventoDTO } from '../dto/crear-evento-dto';
import { EditarEventoDTO } from '../dto/editar-evento-dto';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private adminURL = "http://localhost:8080/api/admin";
  constructor(private http: HttpClient) { }
  public crearEvento(crearEventoDTO: CrearEventoDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.adminURL}/evento/crear`, crearEventoDTO);
  }
  public actualizarEvento(editarEventoDTO: EditarEventoDTO): Observable<MensajeDTO> {
    return this.http.put<MensajeDTO>(`${this.adminURL}/evento/editar`, editarEventoDTO);
  }
  public obtenerEvento(id: string): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.adminURL}/event/get/${id}`);
  }
  public eliminarEvento(id: string): Observable<MensajeDTO> {
    return this.http.delete<MensajeDTO>(`${this.adminURL}/evento/eliminar/${id}`);
  }
  public listarEventosAdmin(pagina: number): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.adminURL}/event/get-all/${pagina}`);
  }
  public subirImagen(imagen: FormData): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.adminURL}/image/upload`, imagen);
  }
  //TODO add other methods that need to be implemented for the Admin
  //TODO maybe gonna do another home component for the admin that gonna re use the cardgrid component
  // for the exclusive admin events (All)
}
