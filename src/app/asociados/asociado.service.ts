import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Asociado } from './asociado';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AsociadoService {

  private urlEndPoint:string = "http://localhost:8080/api/asociados";
  private httpHeader:HttpHeaders = new HttpHeaders({'content-type':'aplication/json'})

  constructor(private http:HttpClient) { }
  

  getAllActivos():Observable<Asociado[]>{
    return this.http.get<Asociado[]>(this.urlEndPoint);
  }
  getAllInactivos(): Observable<Asociado[]>{
    return this.http.get<Asociado[]>(this.urlEndPoint + '/inactivos');
  }
  getAllFallecidos(): Observable<Asociado[]>{
    return this.http.get<Asociado[]>(this.urlEndPoint + '/fallecidos');
  }
  getById(id:number):Observable<Asociado>{
    return this.http.get<Asociado>(`${this.urlEndPoint}/${id}`);
  }
  save(asociado: Asociado):Observable<any>{
    return this.http.post(this.urlEndPoint, asociado)
  }
  update(asociado: Asociado, id:number):Observable<any>{
    return this.http.put(`${this.urlEndPoint}/${id}`, asociado);
  }
  changeState(estado: string ,asociado: Asociado): Observable<any>{
    return this.http.put(`${this.urlEndPoint}/change-state?estado=${estado}`, asociado);
  }
  changeState2(estado: string ,asociado: Asociado): Observable<any>{
    return this.http.put(`${this.urlEndPoint}/change-state2?estado=${estado}`, asociado);
  }
}
