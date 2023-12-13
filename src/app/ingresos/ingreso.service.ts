import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Ingreso } from './ingreso';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Router } from '@angular/router';
import { AuthService } from '../usuarios/auth.service';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class IngresoService {

  private urlEndPoint: string = 'http://localhost:8080/api/ingresos';
  private httpHeader: HttpHeaders = new HttpHeaders({ 'content-type': 'aplication/json' })

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

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

  getAll(): Observable<Ingreso[]> {
    return this.http.get<Ingreso[]>(this.urlEndPoint)
  }
  save(ingreso: Ingreso): Observable<any> {
    const token = `Bearer ${this.authService.token}`;
    const headers = new HttpHeaders({
      Authorization: token
    })
    return this.http.post<Ingreso[]>(this.urlEndPoint, ingreso, { headers: headers }).pipe(
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
  update(ingreso: Ingreso, id: number): Observable<any> {
    const token = `Bearer ${this.authService.token}`;
    const headers = new HttpHeaders({
      Authorization: token
    })
    return this.http.put<Ingreso[]>(`${this.urlEndPoint}/${id}`, ingreso, { headers: headers }).pipe(
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
  
  buscarIngresosPorFecha(fechaInicio: string, fechaFin: string): Observable<Ingreso[]> {
    const url = `${this.urlEndPoint}/reportes?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
    return this.http.get<Ingreso[]>(url);
  }


  //PDF
  imprimir(encabezado: string[], cuerpo: Array<any>, titulo: string, guardar: boolean) {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: 'letter'
    });

    // Agregar un encabezado personalizado
    const encabezadoText = "ADESCO (Asociación de Desarrollo Comunal)";
    doc.setFontSize(14); // Tamaño de fuente para el encabezado
    doc.text(encabezadoText, doc.internal.pageSize.width / 2, 20, { align: 'center' });

    // Configurar márgenes para el título
    doc.setFontSize(12); // Restaurar el tamaño de fuente para el título
    doc.text(titulo, doc.internal.pageSize.width / 2, 40, { align: 'center' });

    // Configurar márgenes y estilos para la tabla
    autoTable(doc, {
      head: [encabezado],
      body: cuerpo,
      startY: 60, // Posición inicial de la tabla
      margin: { top: 70 }, // Márgenes superiores
      styles: {
        fontSize: 12,
        textColor: [0, 0, 0],
        fillColor: [255, 255, 255],
        lineWidth: 0.5,
      },
      columnStyles: {
        0: { fontStyle: 'bold' },
      },
    });

    if (guardar) {
      const hoy = new Date();
      doc.save('table.pdf');
    } else {
      // No se llama a doc.save si no se debe guardar el PDF
    }
  }

}
