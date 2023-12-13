import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { TipoActividad } from './tipo-actividad';
import { Router } from '@angular/router';
import { AuthService } from '../usuarios/auth.service';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class TipoActividadService {

  private urlEndPoint:string = "http://localhost:8080/api/tipo-actividad";
  private httpHeader:HttpHeaders = new HttpHeaders({'content-type':'aplication/json'})

  constructor(private http:HttpClient,  private router: Router, private authService: AuthService) { }

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

  getAll(): Observable<TipoActividad[]>{
    return this.http.get<TipoActividad[]>(this.urlEndPoint);
  }
  save(tipoActividad: TipoActividad):Observable<any>{
    const token = `Bearer ${this.authService.token}`;
    const headers = new HttpHeaders({
      Authorization: token
    })
    return this.http.post(this.urlEndPoint, tipoActividad, { headers: headers }).pipe(
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
  update(tipoActividad: TipoActividad, id:number):Observable<any>{
    return this.http.put(`${this.urlEndPoint}/${id}`, tipoActividad);
  }
  delete(id:number):Observable<any>{
    return this.http.delete(`${this.urlEndPoint}/${id}`)
  }
}
