import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Proyecto } from './proyecto';
import { Router } from '@angular/router';
import { AuthService } from '../usuarios/auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {

  private urlEndPoint: string = 'http://localhost:8080/api/proyectos';
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
  getAllFinalizadas(): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(this.urlEndPoint)
  }
  getAllPedientes(): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(this.urlEndPoint + "/pendientes")
  }
  getById(id: number): Observable<Proyecto> {
    return this.http.get<Proyecto>(`${this.urlEndPoint}/${id}`);
  }
  save(proyecto: Proyecto): Observable<any> {
    const token = `Bearer ${this.authService.token}`;
    const headers = new HttpHeaders({
      Authorization: token
    })
    return this.http.post<Proyecto[]>(this.urlEndPoint, proyecto, { headers: headers }).pipe(
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
  update(proyecto: Proyecto, id: number): Observable<any> {
    return this.http.put<Proyecto[]>(`${this.urlEndPoint}/${id}`, proyecto)
  }
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.urlEndPoint}/${id}`)
  }
  changeState(estado: string, proyecto: Proyecto): Observable<any> {
    return this.http.put(`${this.urlEndPoint}/change-state?estado=${estado}`, proyecto);
  }
}
