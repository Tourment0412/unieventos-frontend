import { Injectable } from '@angular/core';
import { EventoDTO } from '../dto/eventoDTO';


@Injectable({
 providedIn: 'root'
})
export class EventosService {


 eventos:EventoDTO [];


 constructor() {
   this.eventos = [];
 }


 public listar(){
   return this.eventos;
 }


 public crear(crearEventoDTO:EventoDTO){
   this.eventos.push(crearEventoDTO);
 }


 public obtener(id:string):EventoDTO | undefined{
   return this.eventos.find(evento => evento.id == id);
 }


 public eliminar(id:String){
   this.eventos = this.eventos.filter(evento => evento.id != id);
 }


 public actualizar(id:string, editarEventoDTO:EventoDTO){
   const indice = this.eventos.findIndex(evento => evento.id == id);
   if(indice != -1){
     this.eventos[indice] = editarEventoDTO;
   }
 }




}
