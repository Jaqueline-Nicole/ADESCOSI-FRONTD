import { Miembro } from "../miembros/miembro";

export class Proyecto{
    id?: number;
    nombre?: string;
    descripcion?: string;
    fechaAprovacion?:Date;
    fechaInicio?:Date;
    fechaFinalizacion?:Date;
    inversion?: number;
    estado?:string;
    imagen?:string;
    miembro?:Miembro;
}