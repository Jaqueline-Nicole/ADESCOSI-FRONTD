import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Egreso } from './egreso';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EgresoService {

  private urlEndPoint: string = 'http://localhost:8080/api/egresos';
  private httpHeader:HttpHeaders = new HttpHeaders({'content-type':'aplication/json'})

  constructor(private http:HttpClient) { }

  getAll(): Observable<Egreso[]>{
    return this.http.get<Egreso[]>(this.urlEndPoint)
  }
  save(egreso:Egreso): Observable<any>{
    return this.http.post<Egreso[]>(this.urlEndPoint, egreso)
  }
  update(egreso:Egreso, id:number):Observable<any> {
   return this.http.put<Egreso[]>(`${this.urlEndPoint}/${id}`, egreso) 
  }
}
