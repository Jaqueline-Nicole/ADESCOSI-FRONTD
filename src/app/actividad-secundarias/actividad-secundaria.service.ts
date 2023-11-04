import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActividadSecundaria } from './actividad-secundaria';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActividadSecundariaService {

  private urlEndPoint: string = 'http://localhost:8080/api/actividadesS';
  private httpHeader:HttpHeaders = new HttpHeaders({'content-type':'aplication/json'})

  constructor(private http: HttpClient) { }

  getAll(): Observable<ActividadSecundaria[]> {
    return this.http.get<ActividadSecundaria[]>(this.urlEndPoint);
  }
  save(segunda: ActividadSecundaria):Observable<any>{
    return this.http.post(this.urlEndPoint, segunda)
  }
  update(segunda: ActividadSecundaria, id:number):Observable<any>{
    return this.http.put(`${this.urlEndPoint}/${id}`, segunda);
  }
  delete(id:number):Observable<any>{
    return this.http.delete(`${this.urlEndPoint}/${id}`)
  }

}
