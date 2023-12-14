import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActividadSecundaria } from './actividad-secundaria';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../usuarios/auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ActividadSecundariaService {

  private urlEndPoint: string = 'http://localhost:8080/api/actividadesS';
  private httpHeader:HttpHeaders = new HttpHeaders({'content-type':'aplication/json'})

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

    //metodo para la autorizacion
    private isNotAutorized(e): boolean {
      if (e.status == 401) {
        this.router.navigate(['/login'])
        return true;
      }
      if (e.status == 403) {
        Swal.fire('Acceso Incorrecto', 'Prohibido, usuario no autorizado', 'error')
        // `${this.authService.miembro.nom}`
        this.router.navigate(['/login']);
        return true;
  
      }
      return false;
    }

  getAll(): Observable<ActividadSecundaria[]> {
    return this.http.get<ActividadSecundaria[]>(this.urlEndPoint);
  }
  save(segunda: ActividadSecundaria):Observable<any>{
    const token = `Bearer ${this.authService.token}`;
    const headers = new HttpHeaders({
      Authorization: token
    })
    return this.http.post(this.urlEndPoint, segunda, { headers: headers }).pipe(
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
  update(segunda: ActividadSecundaria, id:number):Observable<any>{
    const token = `Bearer ${this.authService.token}`;
    const headers = new HttpHeaders({
      Authorization: token
    })
    return this.http.put(`${this.urlEndPoint}/${id}`, segunda, { headers: headers }).pipe(
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
  delete(id:number):Observable<any>{
    const token = `Bearer ${this.authService.token}`;
    const headers = new HttpHeaders({
      Authorization: token
    })
    return this.http.delete(`${this.urlEndPoint}/${id}`, { headers: headers }).pipe(
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

}
