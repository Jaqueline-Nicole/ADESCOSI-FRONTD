import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TipoIngreso } from './tipo-ingreso';

@Injectable({
  providedIn: 'root'
})
export class TipoIngresosService {

  private urlEndPoint:string = "http://localhost:8080/api/tipo-ingreso";
  private httpHeader:HttpHeaders = new HttpHeaders({'content-type':'aplication/json'})

  constructor(private http:HttpClient) { }

  getAll():Observable<TipoIngreso[]>{
    return this.http.get<TipoIngreso[]>(this.urlEndPoint);
  }
  save(tipoIngreso: TipoIngreso):Observable<any>{
    return this.http.post(this.urlEndPoint, tipoIngreso)
  }
  update(tipoIngreso: TipoIngreso, id:number):Observable<any>{
    return this.http.put(`${this.urlEndPoint}/${id}`, tipoIngreso);
  }
  delete(id:number):Observable<any>{
    return this.http.delete(`${this.urlEndPoint}/${id}`)
  }
}
