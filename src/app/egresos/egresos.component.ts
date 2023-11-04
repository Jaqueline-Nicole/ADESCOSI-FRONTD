import { Component, OnInit } from '@angular/core';
import { Egreso } from './egreso';
import { Miembro } from '../miembros/miembro';
import { TipoEgreso } from '../tipo-egresos/tipo-egreso';
import { MiembroService } from '../miembros/miembro.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EgresoService } from './egreso.service';
import { DatePipe } from '@angular/common';
import { TipoEgresoService } from '../tipo-egresos/tipo-egreso.service';

@Component({
  selector: 'app-egresos',
  templateUrl: './egresos.component.html',
  styleUrls: ['./egresos.component.css'],
  providers: [DatePipe]

})
export class EgresosComponent implements OnInit {


  egresos!: Egreso[];
  egreso!: Egreso;
  egrDialong: boolean = false;
  title: string = "";

  miembros!: Miembro[];
  tipoEgresos!: TipoEgreso[];

  submitted: boolean = false;
  indexSelect: number = -1;

  selectedEgresos!: Egreso[] | null;
  private imagen: File;

  miembro: Miembro = { id:3 }
  date: Date | undefined;



  constructor(
    private miembroService: MiembroService,
    private tipoService: TipoEgresoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private egresoService: EgresoService, 
    private datePipe: DatePipe

    ) { }

  ngOnInit(): void {
    this.getAll();
    this.getMiembros();
    this.getTipo();
  }

  getAll(): void {
    this.egresoService.getAll().subscribe((response) => {
      this.egresos = response as Egreso[];
    });
  }
  getMiembros(): void {
    this.miembroService.getAll().subscribe((response) => {
      this.miembros = response as Miembro[];
    });
  }
  getTipo(): void {
    this.tipoService.getAll().subscribe((response) => {
      this.tipoEgresos = response as TipoEgreso[];
    })
  }
  getEventValue($event: any): string {
    return $event.target.value;
  }
  openNew() {
    this.egreso = {};
    this.submitted = false;
    this.egrDialong = true;
    this.title = 'Agregar egreso';
  }
  editIng(egreso: Egreso) {
    this.egreso = { ...egreso };
    this.egrDialong = true;
    this.title = 'Actualiza egreso';
    this.indexSelect = this.egresos.indexOf(egreso);

    const format = 'yyyy-MM-dd'
    const locale = 'es-SV'
    const date = new Date(egreso.fechaPago)
    date.setTime(date.getTime() + date.getTimezoneOffset() *60 * 7 * 1000)
    const formattedDate = this.datePipe.transform(date, format, locale)
  }
  hideDialog() {
    this.egrDialong = false;
    this.submitted = false;
  }

  createFormData(): FormData {
    let formData = new FormData();
    if (this.imagen == null) {
      if (this.egreso.id == null) {
        this.egreso.imagen = null;
        formData.append("imagen", null)
      }
    } else {
      formData.append("imagen", this.imagen);
    }
    formData.append("egreso",
      new Blob([JSON.stringify(this.egreso)], { type: "application/json" }));
    return formData;
  }
  create(): void {
    this.submitted = true;
    this.egreso.fechaPago = this.date;
    this.egreso.miembro = this.miembro;
    this.egresoService.save(this.createFormData() as Egreso).subscribe({
      next: (json) => {
        this.egresos.unshift(json.egreso)
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
            summary: 'Resultado', detail: `${err.error}`, life: 3000
          });
        }
      }
    });
    this.egrDialong = false;
  }
  update(): void {
    this.submitted = true;
    let id = this.egreso.id;
    this.egresoService.update(this.createFormData() as Egreso, id).subscribe({
      next: (json) => {
        Object.assign(this.egresos[this.indexSelect], json.egreso);
        this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: `${json.message}`, life: 1000 });
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Resultado', detail: `${err.message}`, life: 1000 });
        console.log('code status: ' + err.status);
        console.log(err.message);
      }
    });
    this.egrDialong = false;
    this.egreso = {};
  }

  seleccionarImagen(event) {
    this.imagen = event.target.files[0];
    console.log(this.imagen);
  }
}
