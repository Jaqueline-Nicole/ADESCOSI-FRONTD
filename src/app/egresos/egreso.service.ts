import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Egreso } from './egreso';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../usuarios/auth.service';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

  buscarEgresosPorFecha(fechaInicio: string, fechaFin: string): Observable<Egreso[]> {
    const url = `${this.urlEndPoint}/reportes?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
    return this.http.get<Egreso[]>(url);
  }


  //PDF
  // ...

  imprimir(encabezado: string[], cuerpo: Array<any>, titulo: string, guardar: boolean) {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'letter',
    });
  
    // Configurar márgenes para el título
    doc.setFontSize(14);
    doc.text('ADESCO (Asociación de Desarrollo Comunal)', doc.internal.pageSize.width / 2, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(titulo, doc.internal.pageSize.width / 2, 40, { align: 'center' });
  
    // Configurar márgenes y estilos para la tabla
    autoTable(doc, {
      head: [encabezado],
      body: cuerpo,
      startY: 60,
      margin: { top: 70 },
      styles: {
        fontSize: 12,
        textColor: [0, 0, 0],
        fillColor: [255, 255, 255],
        lineWidth: 0.5,
      },
      columnStyles: {
        0: { fontStyle: 'bold' },
      },
      didDrawPage: (data) => {
        const totalPagesExp = doc.internal.pages.length - 1;
        const text = `Página ${data.pageNumber} de ${totalPagesExp}`;
        doc.setFontSize(10);
        doc.text(text, data.settings.margin.left, doc.internal.pageSize.height - 10);
        // doc.text('Pie de página personalizado', data.settings.margin.left, doc.internal.pageSize.height - 10, { align: 'center' });
      },
    });
  
    if (guardar) {
      doc.save('Egreso ADESCO.pdf');
    } else {
      // No se llama a doc.save si no se debe guardar el PDF
    }
  }
  
}
