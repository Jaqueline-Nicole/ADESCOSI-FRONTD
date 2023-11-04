import { FiestaPatronal } from "../fiesta-patronales/fiesta-patronal";
import { Miembro } from "../miembros/miembro";
import { TipoActividad } from "../tipo-actividades/tipo-actividad";

export class ActividadPrincipal {

    id?: number;
    descripcion?: string;
    fechaRealizada?: Date;
    imagen?: string;
    miembro?: Miembro;
    fiesta?: FiestaPatronal;
    tipo?: TipoActividad;
}
