import { Miembro } from "../miembros/miembro";

export class Mobiliario {
    id?: number;
    codigo?: string;
    descripcion?: string;
    exitenciaInicial?:number;
    disponible?: number;
    fRegistro?: Date;
    miembro?: Miembro;
}