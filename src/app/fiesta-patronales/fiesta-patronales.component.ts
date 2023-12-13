import { Component, OnInit } from '@angular/core';
import { FiestaPatronal } from './fiesta-patronal';
import { FiestaPatronalService } from './fiesta-patronal.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActividadPrincipal } from '../actividad-principales/actividad-principal';
import { ActividadPrincipalService } from '../actividad-principales/actividad-principal.service';
import { DatePipe } from '@angular/common';
import { MiembroService } from '../miembros/miembro.service';
import { TipoActividadService } from '../tipo-actividades/tipo-actividad.service';
import { Miembro } from '../miembros/miembro';
import { TipoActividad } from '../tipo-actividades/tipo-actividad';
import { AuthService } from '../usuarios/auth.service';

@Component({
  selector: 'app-fiesta-patronales',
  templateUrl: './fiesta-patronales.component.html',
  styleUrls: ['./fiesta-patronales.component.css'],
  providers: [DatePipe]

})
export class FiestaPatronalesComponent implements OnInit {

  fiestaPatronal!: FiestaPatronal;
  fiestasPatronales: FiestaPatronal[];
  fiestaSeleccionada: FiestaPatronal | null = null;
  actividades: ActividadPrincipal[] = []; // Lista de actividades de la fiesta seleccionada

  displayDialog: boolean = false;
  displaDialog: boolean = false;
  submitted: boolean = false;
  title: string = "";

  selectedAsociados!: FiestaPatronal[] | null;

  fiestaDialog: boolean = false;
  date: Date | undefined;
  date1: Date | undefined;
  indexSelect: number = -1;


  //paginacion
  totalRecords: number; // Número total de registros
  rows: number; // Número de filas por página
  first: number; // Índice del primer registro en la página actual


  constructor(
    private fiestaPatronalService: FiestaPatronalService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private datePipe: DatePipe,

    private actividadService: ActividadPrincipalService,
    private miembroService: MiembroService,
    private tipoService: TipoActividadService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getAll();
    this.rows = 5; // Establece el número de filas por página
    this.first = 0; // Inicializa el índice del primer registro en la página actual

    this.getTipo();
  }

  getAll(): void {
    this.fiestaPatronalService.getAll().subscribe(data => {
      this.fiestasPatronales = data;
      this.totalRecords = data.length
    });
  }
  verActividades(fiesta: FiestaPatronal): void {
    this.submitted = false;
    this.displayDialog = true;
    this.title = 'Agregar';
    this.fiestaSeleccionada = fiesta; // Establece la fiesta seleccionada
    this.fiestaPatronalService.getActividades(fiesta.id).subscribe(actividades => {
      this.actividades = actividades; // Almacena las actividades en la propiedad actividades
    });
    console.log(this.fiestaSeleccionada)

  }

  gellAll(): void {
    this.displaDialog = true;
    this.fiestaPatronalService.getLastRecord().subscribe(response => {
      this.fiestaPatronal = response as FiestaPatronal;
      console.log(response);
    })
  }


  // seleccionarFiesta(fiesta: FiestaPatronal): void {
  //   this.fiestaSeleccionada = fiesta;
  //   console.log(this.fiestaSeleccionada)

  //   // Reinicia la lista de actividades al seleccionar una nueva fiesta
  //   this.actividades = [];
  // }

  hideDialog() {
    this.displayDialog = false;
    // this.priDialong = false;
    this.submitted = false;
    this.fiestaDialog = false;
  }
  openNew() {
    this.fiestaPatronal = {};
    this.submitted = false;
    this.fiestaDialog = true;
    this.title = 'Agregar Fiesta';
  }
  editIng(fiesta: FiestaPatronal) {
    this.fiestaPatronal = { ...fiesta };
    this.fiestaDialog = true;
    this.title = 'Actualiza ';
    this.indexSelect = this.fiestasPatronales.indexOf(fiesta);

    const format = 'yyyy-MM-dd'
    const locale = 'es-SV'
    const date = new Date(fiesta.fechaInicio)
    date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 4 * 1000)
    const formattedDate = this.datePipe.transform(date, format, locale)

    const date1 = new Date(fiesta.fechaFin)
    date1.setTime(date.getTime() + date1.getTimezoneOffset() * 60 * 4 * 1000)
    const formattedDate1 = this.datePipe.transform(date1, format, locale)

    this.date = new Date(formattedDate)
    this.date1 = new Date(formattedDate1)
    console.log(this.date)

  }
  onPageChange(step: number) {
    const newFirst = this.first + step * this.rows;

    if (newFirst >= 0 && newFirst < this.totalRecords) {
      this.first = newFirst;
    }
  }
  roundToInteger(value: number): number {
    return Math.floor(value);
  }

  getEventValue($event: any): string {
    return $event.target.value;
  }

  create(): void {

    if (this.date && this.date1 && this.date > this.date1) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Las fechas no estan correctas',
        life: 3000
      });
      return;
    }

    this.fiestaPatronal.fechaInicio = this.date;
    this.fiestaPatronal.fechaFin = this.date1;
    this.submitted = true;
    if (!this.fiestaPatronal.descripcion || !this.fiestaPatronal.fechaInicio) {
      this.messageService.add({
        severity: 'error',
        summary: 'Resultado',
        detail: 'No se puede registrar campos vacios',
        life: 3000
      });
      return; // Evitar la ejecución adicional si nombre está vacío
    }
    
    this.fiestaPatronalService.save(this.fiestaPatronal).subscribe({
      next: (json) => {
        this.fiestasPatronales.unshift(json.fiestaPatronal);
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
            summary: 'Resultado', detail: 'No se puede registrar campos vacios', life: 3000
          });
        }

      }
    });
    this.fiestaDialog = false;
  }

  deleteFiesta(fiestaPatronal: FiestaPatronal) {
    this.confirmationService.confirm({
      message: 'Estás seguro de eliminar ' + fiestaPatronal.descripcion + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.fiestaPatronalService.delete(fiestaPatronal.id).subscribe({
          next: (response) => {
            this.fiestasPatronales = this.fiestasPatronales.filter((val) => val.id !== fiestaPatronal.id);
            this.fiestaPatronal = {};
            this.messageService.add({ severity: 'success', summary: 'Resultado', detail: `${response.message}`, life: 3000 });

          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Resultado', detail: `${err.message}`, life: 1000 });
          }
        })
      },
    });
  }


  update(): void {
    this.submitted = true;
    this.fiestaPatronal.fechaInicio = this.date;
    this.fiestaPatronal.fechaFin = this.date1;

    if (!this.fiestaPatronal.descripcion) {
      this.messageService.add({
        severity: 'error',
        summary: 'Resultado',
        detail: 'El campo  no puede estar vacío',
        life: 1000
      });
      return; // Evitar la ejecución adicional si nombre está vacío
    }

    let id = this.fiestaPatronal.id;
    this.fiestaPatronalService.update(this.fiestaPatronal, id).subscribe(
      {
        next: (json) => {
          Object.assign(this.fiestasPatronales[this.indexSelect], json.fiestaPatronal);
          this.messageService.add({
            severity: 'success',
            summary: 'Confirmado',
            detail: `${json.message}`,
            life: 1000
          });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Resultado',
            detail: 'No se puede registrar campos vacios',
            life: 1000
          }); //`${err.message}`
          console.log('code status: ' + err.status);
          console.log(err.message);
        }
      }
    );
    this.fiestaDialog = false;
    this.fiestaPatronal = {};
  }

  // apartado para agregar una actividad

  private imagen: File;
  actividadPrincipales!: ActividadPrincipal[];
  //miembro: Miembro = { id: 9 }
  miembro: Miembro = this.authService.miembro; 

  
  miembros!: Miembro[];
  tipoActs!: TipoActividad[];
  actividadPrincipal!: ActividadPrincipal;
  priDialong: boolean = false;

  getAllAct(): void {
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

  getTipo(): void {
    this.tipoService.getAll().subscribe((response) => {
      this.tipoActs = response as TipoActividad[];
    })
  }

  openNewA(fiesta: FiestaPatronal) {
    this.actividadPrincipal = {};
    this.actividadPrincipal.fiesta = fiesta; // Asigna la fiesta seleccionada a la actividadPrincipal
    this.submitted = false;
    this.priDialong = true;
    this.title = 'Agregar';
    this.fiestaSeleccionada = fiesta;
    this.fiestaPatronalService.getActividades(fiesta.id).subscribe(actividades => {
      this.actividades = actividades;
    });
    console.log(this.fiestaSeleccionada);
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
  seleccionarImagen(event) {
    this.imagen = event.target.files[0];
    console.log(this.imagen);
  }

  // createA( ): void {
  //   this.submitted = true;
  //   let fiesta:FiestaPatronal;
  //   this.actividadPrincipal.fechaRealizada = this.date;
  //   this.fiestaSeleccionada = fiesta; // Establece la fiesta seleccionada
  //   this.fiestaPatronalService.getActividades(fiesta.id).subscribe(actividades => {
  //     this.actividades = actividades; // Almacena las actividades en la propiedad actividades
  //   });
  //   this.actividadPrincipal.miembro = this.miembro;
  //   this.actividadService.save(this.createFormData() as ActividadPrincipal).subscribe({
  //     next: (json) => {
  //       this.actividadPrincipales.unshift(json.actividadPrincipal)
  //       this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: `${json.message}`, life: 3000 });
  //     },
  //     error: (err) => {
  //       if (err.status == 409) {
  //         this.messageService.add({
  //           severity: 'error',
  //           summary: 'Resultado', detail: `${err.error.message}`, life: 3000
  //         });
  //       }
  //       else {
  //         this.messageService.add({
  //           severity: 'error',
  //           summary: 'Resultado', detail: `${err.error.message}`, life: 3000
  //         });
  //       }
  //     }
  //   });
  //   this.priDialong = false;
  // }
  createA():void {
    this.actividadPrincipal.fiesta = this.fiestaSeleccionada;
    this.actividadPrincipal.fechaRealizada = this.date;
    this.actividadPrincipal.miembro = this.miembro;
    this.actividadService.save(this.createFormData() as ActividadPrincipal).subscribe({
      next: (json) => {
        // this.actividadPrincipales.unshift(json.actividadPrincipal)
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

}
