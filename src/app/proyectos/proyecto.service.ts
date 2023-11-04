import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Proyecto } from './proyecto';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {

  private urlEndPoint: string = 'http://localhost:8080/api/proyectos';
  private httpHeader:HttpHeaders = new HttpHeaders({'content-type':'aplication/json'})

  constructor(private http:HttpClient) { }

  getAllFinalizadas(): Observable<Proyecto[]>{
    return this.http.get<Proyecto[]>(this.urlEndPoint)
  }
  getAllPedientes(): Observable<Proyecto[]>{
    return this.http.get<Proyecto[]>(this.urlEndPoint + "/pendientes")
  }
  getById(id:number): Observable<Proyecto>{
    return this.http.get<Proyecto>(`${this.urlEndPoint}/${id}`);
  }
  save(proyecto:Proyecto): Observable<any>{
    return this.http.post<Proyecto[]>(this.urlEndPoint, proyecto)
  }
  update(proyecto:Proyecto, id:number):Observable<any> {
   return this.http.put<Proyecto[]>(`${this.urlEndPoint}/${id}`, proyecto) 
  }
  delete(id:number):Observable<any>{
    return this.http.delete(`${this.urlEndPoint}/${id}`)
  }
  changeState(estado: string ,proyecto: Proyecto): Observable<any>{
    return this.http.put(`${this.urlEndPoint}/change-state?estado=${estado}`, proyecto);
  }
}
