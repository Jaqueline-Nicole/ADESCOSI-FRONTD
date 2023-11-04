import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FiestaPatronal } from './fiesta-patronal';
import { ActividadPrincipal } from '../actividad-principales/actividad-principal';


@Injectable({
  providedIn: 'root'
})
export class FiestaPatronalService {


  private urlEndPoint: string = 'http://localhost:8080/api/fiestas-patronales';
  private httpHeader: HttpHeaders = new HttpHeaders({ 'content-type': 'aplication/json' })

  constructor(private http: HttpClient) { }

  getAll(): Observable<FiestaPatronal[]> {
    return this.http.get<FiestaPatronal[]>(this.urlEndPoint)
  }
  getLastRecord(): Observable<FiestaPatronal> {
    return this.http.get<FiestaPatronal>(this.urlEndPoint + "/last")
  }
  getActividades(fiestaId: number): Observable<ActividadPrincipal[]> {
    return this.http.get<ActividadPrincipal[]>(`${this.urlEndPoint}/${fiestaId}/activities`);
  }
  
  // getActividades(fiestaPatronal: FiestaPatronal): Observable<ActividadPrincipal[]> {
  //   return this.http.get<ActividadPrincipal[]>(`${this.urlEndPoint}/activities`, {
  //     params: { id: fiestaPatronal.id.toString() }
  //   });
  // }
  // getActividades(fiestaId: number): Observable<ActividadPrincipal[]> {
  //   const url = `${this.urlEndPoint}/activities?id=${fiestaId}`;
  //   return this.http.get<ActividadPrincipal[]>(url);
  // }

  // // getActividades(fiesta : FiestaPatronal):Observable<ActividadPrincipal[]>{
  // //   return this.http.get<ActividadPrincipal[]>(`${this.urlEndPoint}/activities`)
  // // }
  save(fiestaPatronal: FiestaPatronal): Observable<any> {
    return this.http.post<FiestaPatronal[]>(this.urlEndPoint, fiestaPatronal)
  }
  update(fiestaPatronal: FiestaPatronal, id: number): Observable<any> {
    return this.http.put<FiestaPatronal[]>(`${this.urlEndPoint}/${id}`, fiestaPatronal)
  }
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.urlEndPoint}/${id}`)
  }

  getActivitiesByFiestaId(fiestaId: number): Observable<ActividadPrincipal[]> {
    return this.http.get<ActividadPrincipal[]>(`${this.urlEndPoint}/${fiestaId}/activities`);
  }
  
}
