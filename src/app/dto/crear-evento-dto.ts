import { LocalityDTO } from "./locality-dto";

export interface CrearEventoDTO {
    name:string,
    address:string,
    city:string,

    coverImage:string,
    localitiesImage:string,

    //Preguntar si este date lo dejo asi o como un string
    date: Date,

    description: string,
    type:string,
    //no se si deba dejar esto como un DTO de localidades o algo asi para enviar la lista o solo como un arreglo generico
    locations: LocalityDTO[]
   
}
