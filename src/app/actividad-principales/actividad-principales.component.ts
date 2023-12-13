import { Component, OnInit } from '@angular/core';
import { ActividadPrincipal } from './actividad-principal';
import { FiestaPatronal } from '../fiesta-patronales/fiesta-patronal';
import { ActividadPrincipalService } from './actividad-principal.service';
import { MiembroService } from '../miembros/miembro.service';
import { TipoActividadService } from '../tipo-actividades/tipo-actividad.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FiestaPatronalService } from '../fiesta-patronales/fiesta-patronal.service';
import { Miembro } from '../miembros/miembro';
import { TipoActividad } from '../tipo-actividades/tipo-actividad';
import { DatePipe } from '@angular/common';
import { AuthService } from '../usuarios/auth.service';

@Component({
  selector: 'app-actividad-principales',
  templateUrl: './actividad-principales.component.html',
  styleUrls: ['./actividad-principales.component.css'],
  providers: [DatePipe]

})
export class ActividadPrincipalesComponent implements OnInit {


  actividadPrincipales!: ActividadPrincipal[];
  actividadPrincipal!: ActividadPrincipal;
  priDialong: boolean = false;
  title: string = "";

  miembros!: Miembro[];
  tipoActs!: TipoActividad[];
  fiestas!: FiestaPatronal[];

  selectedSegs!: ActividadPrincipal[] | null;
  private imagen: File;
  submitted: boolean = false;
  indexSelect: number = -1;

  //  miembro: Miembro = { id: 9 } 
  miembro: Miembro = this.authService.miembro; 
  // principales!: ActividadPrincipal[];

  date: Date | undefined;


  constructor(
    private actividadService: ActividadPrincipalService,
    private miembroService: MiembroService,
    private tipoService: TipoActividadService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private principalService: ActividadPrincipalService,
    private fiestaService: FiestaPatronalService,
    private datePipe: DatePipe,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getAll();
    this.getFiestas();
    this.getTipo();
  }

  getAll(): void {
    this.actividadService.getAll().subscribe(
      response => {
        this.actividadPrincipales = response as ActividadPrincipal[];
        console.log(response);
      }
    );
  }
  getMiembros(): void {
    this.miembroService.getAll().subscribe((response) => {
      this.miembros = response as Miembro[];
    });
  }
  getFiestas(): void {
    this.fiestaService.getAll().subscribe((response) => {
      this.fiestas = response as FiestaPatronal[];
      console.log(response)
    });
  }
  getTipo(): void {
    this.tipoService.getAll().subscribe((response) => {
      this.tipoActs = response as TipoActividad[];
    })
  }
  getEventValue($event: any): string {
    return $event.target.value;
  }
  editIng(actividad: ActividadPrincipal) {
    this.actividadPrincipal = { ...actividad };
    this.priDialong = true;
    this.title = 'Actualiza';
    this.indexSelect = this.actividadPrincipales.indexOf(actividad);

    const format = 'yyyy-MM-dd'
    const locale = 'es-SV'
    const date = new Date(actividad.fechaRealizada)
    date.setTime(date.getTime() + date.getTimezoneOffset() *60 * 7 * 1000)
    const formattedDate = this.datePipe.transform(date, format, locale)
    this.date = new Date(formattedDate)

  }
  hideDialog() {
    this.priDialong = false;
    this.submitted = false;
  }
  openNew() {
    this.actividadPrincipal = {};
    this.submitted = false;
    this.priDialong = true;
    this.title = 'Agregar';
  }
  createFormData(): FormData {
    let formData = new FormData();
    if (this.imagen == null) {
      if (this.actividadPrincipal.id == null) {
        this.actividadPrincipal.imagen = null;
        formData.append("imagen", null)
      }
    } else {
      formData.append("imagen", this.imagen);
    }
    formData.append("actividadPrincipal",
      new Blob([JSON.stringify(this.actividadPrincipal)], { type: "application/json" }));
    return formData;
  }

  create(): void {
    this.submitted = true;
    this.actividadPrincipal.fechaRealizada = this.date;
    this.actividadPrincipal.miembro = this.miembro;
    this.principalService.save(this.createFormData() as ActividadPrincipal).subscribe({
      next: (json) => {
        this.actividadPrincipales.unshift(json.actividadPrincipal)
        this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: `${json.message}`, life: 3000 });
      },
      error: (err) => {
        if (err.status == 409) {
          this.messageService.add({
            severity: 'error',
            summary: 'Resultado', detail: `${err.error.message}`, life: 3000
          });
        }
        else {
          this.messageService.add({
            severity: 'error',
            summary: 'Resultado', detail: `${err.error.message}`, life: 3000
          });
        }
      }
    });
    this.priDialong = false;
  }

  update(): void {
    this.submitted = true;
    let id = this.actividadPrincipal.id;
    this.actividadPrincipal.fechaRealizada = this.date;

    this.principalService.update(this.createFormData() as ActividadPrincipal, id).subscribe({
      next: (json) => {
        Object.assign(this.actividadPrincipales[this.indexSelect], json.actividadPrincipal);
        this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: `${json.message}`, life: 1000 });
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Resultado', detail: `${err.message}`, life: 1000 });
        console.log('code status: ' + err.status);
        console.log(err.message);
      }
    });
    this.priDialong = false;
    this.actividadPrincipal = {};
  }

  delete(principal: ActividadPrincipal) {
    this.confirmationService.confirm({
      message: 'Estas seguro de eliminar ' + principal.descripcion + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.principalService.delete(principal.id).subscribe({
          next: (response) => {
            this.actividadPrincipales = this.actividadPrincipales.filter((val) => val.id !== principal.id);
            this.actividadPrincipal = {};
            this.messageService.add({ severity: 'success', summary: 'Resultado', detail: `${response.message}`, life: 3000 });

          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Resultado2', detail: `${err.error.message}`, life: 1000 });
          }
        })
      },
    });
  }

  seleccionarImagen(event) {
    this.imagen = event.target.files[0];
    console.log(this.imagen);
  }
}
