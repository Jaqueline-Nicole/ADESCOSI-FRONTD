import { Miembro } from "../miembros/miembro";
import { TipoActividad } from "../tipo-actividades/tipo-actividad";

export class ActividadSecundaria {
    id?: number;
    descripcion?: string;
    imagen?:string;
    fecha?: Date;
    tipo?: TipoActividad;
    miembro?: Miembro;
}