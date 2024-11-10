import { LocalityDTO } from "./locality-dto";


export interface EventoDTO {
   id:string,
   name:string,
   description:string,
   date:Date,
   type:string,
   address:string,
   city:string,
   locations:LocalityDTO[],
   coverImage:string,
   localitiesImage:string,
   status:string
}

