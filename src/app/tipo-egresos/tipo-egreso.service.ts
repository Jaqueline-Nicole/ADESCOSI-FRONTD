import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TipoEgreso } from './tipo-egreso';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoEgresoService {

  private urlEndPoint:string = "http://localhost:8080/api/tipo-egreso";
  private httpHeader:HttpHeaders = new HttpHeaders({'content-type':'aplication/json'})


  constructor(private http:HttpClient) { }

  getAll():Observable<TipoEgreso[]>{
    return this.http.get<TipoEgreso[]>(this.urlEndPoint);
  }
  save(tipoEgreso: TipoEgreso):Observable<any>{
    return this.http.post(this.urlEndPoint, tipoEgreso)
  }
  update(tipoEgreso: TipoEgreso, id:number):Observable<any>{
    return this.http.put(`${this.urlEndPoint}/${id}`, tipoEgreso);
  }
  delete(id:number):Observable<any>{
    return this.http.delete(`${this.urlEndPoint}/${id}`)
  }
  
}
