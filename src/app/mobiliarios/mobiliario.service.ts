import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Mobiliario } from './mobiliario';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../usuarios/auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MobiliarioService {

  private urlEndPoint: string = 'http://localhost:8080/api/mobiliarios';
  private httpHeader: HttpHeaders = new HttpHeaders({ 'content-type': 'aplication/json' });

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  //metodo para la autorizacion
  private isNotAutorized(e): boolean {
    if (e.status == 401) {
      this.router.navigate(['/login'])
      return true;
    }
    if (e.status == 403) {
      Swal.fire('Prohibido', `${this.authService.miembro.asociado}`)
      console.log(e);
      this.router.navigate(['/login']);
      return true;

    }
    return false;

  }

  getAll(): Observable<Mobiliario[]> {
    return this.http.get<Mobiliario[]>(this.urlEndPoint);
  }
  save(mobiliario: Mobiliario): Observable<any> {
    const token = `Bearer ${this.authService.token}`;
    const headers = new HttpHeaders({
      Authorization: token
    })
    return this.http.post(this.urlEndPoint, mobiliario, { headers: headers }).pipe(
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
  update(mobiliario: Mobiliario, id: number): Observable<any> {
    const token = `Bearer ${this.authService.token}`;
    const headers = new HttpHeaders({
      Authorization: token
    })
    return this.http.put(`${this.urlEndPoint}/${id}`, mobiliario, { headers: headers }).pipe(
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
