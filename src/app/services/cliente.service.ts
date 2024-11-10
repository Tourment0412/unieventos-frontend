import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MensajeDTO } from '../dto/mensaje-dto';
import { CarItemDTO } from '../dto/car-item-dto';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private clienteURL = "http://localhost:8080/api/client";
  constructor(private http: HttpClient) { }


  public listarHistorialCompras(clientId: string): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.clienteURL}/order/history/${clientId}`);
  }

  public obtenerEvento(id: string): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.clienteURL}/event/get/${id}`);
  }

  public agregarItemCarrito(carItemDTO: CarItemDTO): Observable<MensajeDTO> {
    return this.http.put<MensajeDTO>(`${this.clienteURL}/shoppingcar/add-item`, carItemDTO);
  }

  public obtenerItemsCarrito(id: string): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.clienteURL}/shoppingcar/get-items/${id}`);
  }

}
