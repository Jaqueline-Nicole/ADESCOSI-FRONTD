import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TipoActividad } from './tipo-actividad';


@Injectable({
  providedIn: 'root'
})
export class TipoActividadService {

  private urlEndPoint:string = "http://localhost:8080/api/tipo-actividad";
  private httpHeader:HttpHeaders = new HttpHeaders({'content-type':'aplication/json'})

  constructor(private http:HttpClient) { }

  getAll(): Observable<TipoActividad[]>{
    return this.http.get<TipoActividad[]>(this.urlEndPoint);
  }
  save(tipoActividad: TipoActividad):Observable<any>{
    return this.http.post(this.urlEndPoint, tipoActividad)
  }
  update(tipoActividad: TipoActividad, id:number):Observable<any>{
    return this.http.put(`${this.urlEndPoint}/${id}`, tipoActividad);
  }
  delete(id:number):Observable<any>{
    return this.http.delete(`${this.urlEndPoint}/${id}`)
  }
}
