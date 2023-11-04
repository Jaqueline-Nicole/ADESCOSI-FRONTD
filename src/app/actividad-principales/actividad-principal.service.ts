import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActividadPrincipal } from './actividad-principal';


@Injectable({
  providedIn: 'root'
})
export class ActividadPrincipalService {

  private urlEndPoint:string = "http://localhost:8080/api/actividades-principales";
  private httpHeader:HttpHeaders = new HttpHeaders({'content-type':'aplication/json'})

  constructor(private http:HttpClient) { }

  getAll():Observable<ActividadPrincipal[]>{
    return this.http.get<ActividadPrincipal[]>(this.urlEndPoint);
  }
}
