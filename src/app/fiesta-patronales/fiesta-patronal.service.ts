import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { FiestaPatronal } from './fiesta-patronal';
import { ActividadPrincipal } from '../actividad-principales/actividad-principal';
import { Router } from '@angular/router';
import { AuthService } from '../usuarios/auth.service';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class FiestaPatronalService {


  private urlEndPoint: string = 'http://localhost:8080/api/fiestas-patronales';
  private httpHeader: HttpHeaders = new HttpHeaders({ 'content-type': 'aplication/json' })

  constructor(private http: HttpClient,  private router: Router, private authService: AuthService) { }

   //metodo para la autorizacion
   private isNotAutorized(e): boolean {
    if (e.status == 401) {
      this.router.navigate(['/login'])
      return true;
    }
    if (e.status == 403) {
      Swal.fire('Prohibido', `${this.authService.miembro.username}`)
      this.router.navigate(['/login']);
      return true;

    }
    return false;

  }

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
    const token = `Bearer ${this.authService.token}`;
    const headers = new HttpHeaders({
      Authorization: token,
      'Content-Type': 'application/json'
    })
    return this.http.post<FiestaPatronal[]>(this.urlEndPoint, fiestaPatronal, { headers: headers }).pipe(
      catchError(e => {
        if (this.isNotAutorized(e)) {
          return throwError(() => e);
        }
        if (e.status == 400) {
          return throwError(() => e)
        }
        return throwError(() => e);
      })
    );
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
