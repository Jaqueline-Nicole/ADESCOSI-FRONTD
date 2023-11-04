import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Mobiliario } from './mobiliario';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MobiliarioService {

  private urlEndPoint: string = 'http://localhost:8080/api/mobiliarios';
  private httpHeader: HttpHeaders = new HttpHeaders({ 'content-type': 'aplication/json' });

  constructor(private http: HttpClient) { }

  getAll(): Observable<Mobiliario[]> {
    return this.http.get<Mobiliario[]>(this.urlEndPoint);
  }
  save(mobiliario: Mobiliario):Observable<any>{
    return this.http.post(this.urlEndPoint, mobiliario)
  }
  update(mobiliario: Mobiliario, id:number):Observable<any>{
    return this.http.put(`${this.urlEndPoint}/${id}`, mobiliario);
  }
  
}
