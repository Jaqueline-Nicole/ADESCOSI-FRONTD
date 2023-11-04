import { ActividadPrincipal } from "../actividad-principales/actividad-principal";

export class FiestaPatronal {
    id?: number;
    descripcion?: string;
    fechaInicio?: Date;
    fechaFin?: Date;
    principal?: ActividadPrincipal;
}