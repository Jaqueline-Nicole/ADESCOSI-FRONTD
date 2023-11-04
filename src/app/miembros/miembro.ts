import { Asociado } from "../asociados/asociado";
import { Cargo } from "../cargos/cargo";
import { Periodo } from "../periodos/periodo";

export class Miembro{
    id?:number;
    estado?:string;
    imagen?:string;
    asociado?:Asociado;
    cargo?:Cargo;
    periodo?:Periodo;
}