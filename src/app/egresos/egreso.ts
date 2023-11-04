import { Miembro } from "../miembros/miembro";
import { TipoEgreso } from "../tipo-egresos/tipo-egreso";

export class Egreso{
    id?:number;
    cantidad?: number;
    fechaPago?:Date;
    descripcion?:string;
    imagen?:string;
    fechaRegistro?:Date;
    miembro?:Miembro;
    tipoEgreso?:TipoEgreso
}