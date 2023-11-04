import { Miembro } from "../miembros/miembro";
import { TipoIngreso } from "../tipo-ingresos/tipo-ingreso";

export class Ingreso{
    id?:number;
    cantidad?: number;
    fechaIngreso?:Date;
    descripcion?:string;
    imagen?:string;
    miembro?:Miembro;
    tipoIngreso?:TipoIngreso
}