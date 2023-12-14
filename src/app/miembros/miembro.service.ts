import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Miembro } from './miembro';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../usuarios/auth.service';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class MiembroService {

  private urlEndPoint: string = 'http://localhost:8080/api/miembros';
  private urlEndPoint1: string = 'http://localhost:8080/auth/register';
  private httpHeader: HttpHeaders = new HttpHeaders({ 'content-type': 'application/json' })


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

  getAll(): Observable<Miembro[]> {
    return this.http.get<Miembro[]>(this.urlEndPoint)
  }
  getAllInactivos(): Observable<Miembro[]> {
    return this.http.get<Miembro[]>(this.urlEndPoint + '/inactivos')
  }
  getById(id: number): Observable<Miembro> {
    return this.http.get<Miembro>(`${this.urlEndPoint}/${id}`);
  }
  save(request: Miembro): Observable<any> {
    const token = `Bearer ${this.authService.token}`;
    const headers = new HttpHeaders({
      Authorization: token
    })
    return this.http.post(this.urlEndPoint1, request, { headers: headers }).pipe(
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
  update(miembro: Miembro, id: number): Observable<any> {
    const token = `Bearer ${this.authService.token}`;
    const headers = new HttpHeaders({
      Authorization: token
    })
    return this.http.put(`${this.urlEndPoint}/${id}`, miembro, { headers: headers }).pipe(
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

  changeState(estado: string, miembro: Miembro): Observable<any> {
    const token = `Bearer ${this.authService.token}`;
    const headers = new HttpHeaders({
      Authorization: token
    })
    return this.http.put(`${this.urlEndPoint}/change-state?estado=${estado}`, miembro, { headers: headers }).pipe(
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
  // delete(id:number):Observable<any>{
  //   return this.http.delete(`${this.urlEndPoint}/${id}`)
  // }
}
