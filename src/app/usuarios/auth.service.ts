import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Miembro } from '../miembros/miembro';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _user: Miembro;
  private _token: string;

  constructor(private http: HttpClient) { }

  public get miembro(): Miembro {
    if (this._user != null) {
      return this._user;
    } else if (this._user == null && sessionStorage.getItem('miembro') != null) {
      this._user = JSON.parse(sessionStorage.getItem('miembro'));
      return this._user;
    }
    return new Miembro();
  }
  public get token(): string {
    if (this._token != null) {
      return this._token;
    } else if (this._token == null && sessionStorage.getItem('token') != null) {
      this._token = sessionStorage.getItem('token');
      return this._token;
    }
    return null;
  }
  login(usuario: Miembro): Observable<any> {
    const urlEndPointAuth = 'http://localhost:8080/auth/login';

    const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(urlEndPointAuth, usuario, { headers: httpHeaders })
  }

  obtenerDatosToken(token: string): any {
    if (token != null) {
      return JSON.parse(window.atob(token.split(".")[1]))
    }
    return null;
  }

  isAuthenticated(): boolean {
    let payLoad = this.obtenerDatosToken(this.token);
    if(payLoad != null && payLoad.sub.length >0){
      return true;
    }
    return false;
  }
  guardarUsuario(accessToken: string): void {
    let payLoad = this.obtenerDatosToken(accessToken);
    console.log(payLoad);
    this._user = new Miembro();
    this._user.id = payLoad.miembro.id;
    this._user.username = payLoad.miembro.username;
    this._user.asociado = payLoad.miembro.asociado;
    this._user.nom = payLoad.miembro.asociado.nombre;
    this._user.role = payLoad.miembro.role;
    sessionStorage.setItem('miembro', JSON.stringify(this._user));
  }

  guardarToken(accessToken:string):void{
    this._token = accessToken;
    sessionStorage.setItem('token',this._token);
  }
  logout(): void {
    this._token = null;
    this._user = null;
    sessionStorage.clear();
  }

  hasRole(role: string):boolean{
    if(this.miembro.role==role){
      return true;
    }
    return false;

  }
}
