import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Periodo } from './periodo';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PeriodoService {

  private urlEndPoint:string = "http://localhost:8080/api/periodos";
  private httpHeader:HttpHeaders = new HttpHeaders({'content-type':'aplication/json'})


  constructor(private http:HttpClient) { }

  getAll():Observable<Periodo[]>{
    return this.http.get<Periodo[]>(this.urlEndPoint);
  }

  getById(id:number):Observable<Periodo>{
    return this.http.get<Periodo>(`${this.urlEndPoint}/${id}`);
  }

  save(periodo: Periodo):Observable<any>{
    return this.http.post(this.urlEndPoint, periodo)
  }
  update(periodo: Periodo, id:number):Observable<any>{
    return this.http.put(`${this.urlEndPoint}/${id}`, periodo);
  }
}
