import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Miembro } from './miembro';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MiembroService {

  private urlEndPoint: string = 'http://localhost:8080/api/miembros';
  private httpHeader:HttpHeaders = new HttpHeaders({'content-type':'aplication/json'})


  constructor(private http:HttpClient) { }

  getAll(): Observable<Miembro[]>{
    return this.http.get<Miembro[]>(this.urlEndPoint)
  }
  getAllInactivos(): Observable<Miembro[]>{
    return this.http.get<Miembro[]>(this.urlEndPoint + '/inactivos')
  }
  getById(id:number): Observable<Miembro>{
    return this.http.get<Miembro>(`${this.urlEndPoint}/${id}`);
  }
  save(miembro: Miembro):Observable<any>{
    return this.http.post(this.urlEndPoint, miembro)
  }
  update(miembro: Miembro, id:number):Observable<any>{
    return this.http.put(`${this.urlEndPoint}/${id}`, miembro);
  }

  changeState(estado:string, miembro:Miembro):Observable<any>
  {
    return this.http.put(`${this.urlEndPoint}/change-state?estado=${estado}`, miembro);
  }
  // delete(id:number):Observable<any>{
  //   return this.http.delete(`${this.urlEndPoint}/${id}`)
  // }
}
