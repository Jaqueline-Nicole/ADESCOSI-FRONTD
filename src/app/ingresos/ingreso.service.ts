import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ingreso } from './ingreso';


@Injectable({
  providedIn: 'root'
})
export class IngresoService {

  private urlEndPoint: string = 'http://localhost:8080/api/ingresos';
  private httpHeader:HttpHeaders = new HttpHeaders({'content-type':'aplication/json'})

  constructor(private http:HttpClient) { }

  getAll(): Observable<Ingreso[]>{
    return this.http.get<Ingreso[]>(this.urlEndPoint)
  }
  save(ingreso:Ingreso): Observable<any>{
    return this.http.post<Ingreso[]>(this.urlEndPoint, ingreso)
  }
  update(ingreso:Ingreso, id:number):Observable<any> {
   return this.http.put<Ingreso[]>(`${this.urlEndPoint}/${id}`, ingreso) 
  }


}
