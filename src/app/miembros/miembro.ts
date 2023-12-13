import { Asociado } from "../asociados/asociado";
import { Cargo } from "../cargos/cargo";
import { Periodo } from "../periodos/periodo";

export class Miembro{
    id?:number;
    estado?:string;
    imagen?:string;
    asociado?:Asociado;
    nom?:Asociado;
    cargo?:Cargo;
    periodo?:Periodo;
    username?:string;
    password?:string;
    role?:string;
}