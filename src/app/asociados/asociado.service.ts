import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Asociado } from './asociado';
import { Observable, catchError, throwError } from 'rxjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AuthService } from '../usuarios/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AsociadoService {

  private urlEndPoint: string = "http://localhost:8080/api/asociados";
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


  getAllActivos(): Observable<Asociado[]> {

    return this.http.get<Asociado[]>(this.urlEndPoint);
  }
  getAllInactivos(): Observable<Asociado[]> {
    return this.http.get<Asociado[]>(this.urlEndPoint + '/inactivos');
  }
  getAllFallecidos(): Observable<Asociado[]> {
    return this.http.get<Asociado[]>(this.urlEndPoint + '/fallecidos');
  }
  getById(id: number): Observable<Asociado> {
    return this.http.get<Asociado>(`${this.urlEndPoint}/${id}`);
  }


  save(asociado: Asociado): Observable<any> {
    const token = `Bearer ${this.authService.token}`;
    const headers = new HttpHeaders({
      Authorization: token,
      'Content-Type': 'application/json'
    })
    return this.http.post(this.urlEndPoint, asociado, { headers: headers }).pipe(
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
  update(asociado: Asociado, id: number): Observable<any> {
    const token = `Bearer ${this.authService.token}`;
    const headers = new HttpHeaders({
      Authorization: token,
      'Content-Type': 'application/json'
    })
    return this.http.put(`${this.urlEndPoint}/${id}`, asociado, { headers: headers });
  }
  changeState(estado: string, asociado: Asociado): Observable<any> {
    const token = `Bearer ${this.authService.token}`;
    const headers = new HttpHeaders({
      Authorization: token
    })
    return this.http.put(`${this.urlEndPoint}/change-state?estado=${estado}`, asociado,  { headers: headers });
  }
  changeState2(estado: string, asociado: Asociado): Observable<any> {
    const token = `Bearer ${this.authService.token}`;
    const headers = new HttpHeaders({
      Authorization: token
    })
    return this.http.put(`${this.urlEndPoint}/change-state2?estado=${estado}`, asociado,  { headers: headers });
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

    doc.setFont('helvetica', 'bold');

    // Para el contenido de la tabla
    doc.setFont('helvetica', 'normal');
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
        textColor: [0, 0, 0], // Color de texto (negro)
        fillColor: [240, 240, 240], // Color de fondo de las celdas
        lineWidth: 0.5, // Ancho de línea de borde
      },
      columnStyles: {
        0: { fontStyle: 'bold' }, // Ancho de la primera columna en unidades de píxeles
      },

      headStyles: {
        fillColor: [200, 200, 200], // Color de fondo del encabezado
        textColor: [0, 0, 0], // Color de texto en el encabezado
        fontStyle: 'bold', // Estilo de fuente en negrita
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
