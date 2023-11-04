import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cargo } from './cargo';

@Injectable({
  providedIn: 'root'
})
export class CargoService {

  private urlEndPoint:string = "http://localhost:8080/api/cargos";
  private httpHeader:HttpHeaders = new HttpHeaders({'content-type':'aplication/json'})

  constructor(private http:HttpClient) { }

  getAll():Observable<Cargo[]>{
    return this.http.get<Cargo[]>(this.urlEndPoint);
  }

  getById(id:number):Observable<Cargo>{
    return this.http.get<Cargo>(`${this.urlEndPoint}/${id}`);
  }

  save(cargo: Cargo):Observable<any>{
    return this.http.post(this.urlEndPoint, cargo)
  }

  update(cargo: Cargo, id:number):Observable<any>{
    return this.http.put(`${this.urlEndPoint}/${id}`, cargo);
  }

  delete(id:number):Observable<any>{
    return this.http.delete(`${this.urlEndPoint}/${id}`)
  }


}
