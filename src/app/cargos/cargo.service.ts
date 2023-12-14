import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Cargo } from './cargo';
import { Router } from '@angular/router';
import { AuthService } from '../usuarios/auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class CargoService {

  private urlEndPoint: string = "http://localhost:8080/api/cargos";
  private httpHeaders: HttpHeaders = new HttpHeaders({ 'content-type': 'aplication/json' })

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
  getAll(): Observable<Cargo[]> {
    return this.http.get<Cargo[]>(this.urlEndPoint);
  }

  getById(id: number): Observable<Cargo> {
    return this.http.get<Cargo>(`${this.urlEndPoint}/${id}`);
  }

  save(cargo: Cargo): Observable<any> {
    const token = `Bearer ${this.authService.token}`;
    const headers = new HttpHeaders({
      Authorization: token,
      'Content-Type': 'application/json'
    })
    return this.http.post(this.urlEndPoint, cargo, { headers: headers }).pipe(
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

  update(cargo: Cargo, id: number): Observable<any> {
    const token = `Bearer ${this.authService.token}`;
    const headers = new HttpHeaders({
      Authorization: token,
      'Content-Type': 'application/json'
    })
    return this.http.put(`${this.urlEndPoint}/${id}`, cargo, { headers: headers });
  }

  delete(id: number): Observable<any> {
    const token = `Bearer ${this.authService.token}`;
    const headers = new HttpHeaders({
      Authorization: token,
      'Content-Type': 'application/json'
    })
    return this.http.delete(`${this.urlEndPoint}/${id}`, { headers: headers })
  }


}
