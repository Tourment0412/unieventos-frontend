import { LocalidadDTO } from "./localidadDTO";


export interface EventoDTO {
   id:string,
   name:string,
   descripcion:string,
   fecha:Date,
   tipo:string,
   direccion:string,
   ciudad:string,
   localidades:LocalidadDTO[],
   coverImage:string,
   imagenLocalidades:string,
   estado:string
}

