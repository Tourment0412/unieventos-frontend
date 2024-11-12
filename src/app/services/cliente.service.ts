import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MensajeDTO } from '../dto/mensaje-dto';
import { CarItemDTO } from '../dto/car-item-dto';
import { DeleteCarDetailDTO } from '../dto/delete-car-detail-dto';
import { UpdateCarItemDTO } from '../dto/update-car-item-dto';
import { CreateOrderDTO } from '../dto/create-order-dto';
import { ValideCouponDTO } from '../dto/valide-coupon-dto';
import { GiftDTO } from '../dto/gift-dto';

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

  public eliminarItemCarrito(deleteCarDetailDTO: DeleteCarDetailDTO): Observable<MensajeDTO> {
    return this.http.delete<MensajeDTO>(`${this.clienteURL}/shoppingcar/delete-item`, { body: deleteCarDetailDTO });
  }

  public actualizarItemCarrito(updateCarItemDTO: UpdateCarItemDTO): Observable<MensajeDTO> {
    return this.http.put<MensajeDTO>(`${this.clienteURL}/shoppingcar/edit-item`, updateCarItemDTO);
  }

  public obtenerCuponesDisponibles(page: number): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.clienteURL}/coupon/get-all/${page}`);
  }


  public obtenerInfoCupon(valideCouponDTO: ValideCouponDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.clienteURL}/coupon/get-info-code`, valideCouponDTO);
  }

  public crearOrden(createOrderDTO: CreateOrderDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.clienteURL}/order/create`, createOrderDTO);
  }

  public realizarPago(idOrden: string): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.clienteURL}/order/make-payment/${idOrden}`, {});
  }

  public obtenerEstadoOrden(orderId: string): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.clienteURL}/order/status/${orderId}`);
  }

  public sendGift(gift: GiftDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.clienteURL}/send-gift`, gift);
  }

  public cancelarOrder(orderId: String): Observable<MensajeDTO> {
    return this.http.delete<MensajeDTO>(`${this.clienteURL}/order/cancel/${orderId}`);
  }



}
