import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Egreso } from './egreso';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../usuarios/auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class EgresoService {

  private urlEndPoint: string = 'http://localhost:8080/api/egresos';
  private httpHeader: HttpHeaders = new HttpHeaders({ 'content-type': 'aplication/json' })

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

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

  getAll(): Observable<Egreso[]> {
    return this.http.get<Egreso[]>(this.urlEndPoint)
  }
  save(egreso: Egreso): Observable<any> {
    const token = `Bearer ${this.authService.token}`;
    const headers = new HttpHeaders({
      Authorization: token
    })
    return this.http.post<Egreso[]>(this.urlEndPoint, egreso, { headers: headers }).pipe(
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
  update(egreso: Egreso, id: number): Observable<any> {
    const token = `Bearer ${this.authService.token}`;
    const headers = new HttpHeaders({
      Authorization: token
    })
    return this.http.put<Egreso[]>(`${this.urlEndPoint}/${id}`, egreso, { headers: headers }).pipe(
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
