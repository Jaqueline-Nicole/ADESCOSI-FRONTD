import { Component, OnInit } from '@angular/core';
import { MiembroService } from '../miembros/miembro.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IngresoService } from './ingreso.service';
import { Ingreso } from './ingreso';
import { Miembro } from '../miembros/miembro';
import { DatePipe } from '@angular/common';
import { TipoIngresosService } from '../tipo-ingresos/tipo-ingresos.service';
import { TipoIngreso } from '../tipo-ingresos/tipo-ingreso';

@Component({
  selector: 'app-ingresos',
  templateUrl: './ingresos.component.html',
  styleUrls: ['./ingresos.component.css'],

})
export class IngresosComponent implements OnInit {

  ingresos!: Ingreso[];
  ingreso!: Ingreso;
  ingDialong: boolean = false;
  title: string = "";

  miembros!: Miembro[];
  tipoIngresos!: TipoIngreso[];

  submitted: boolean = false;
  indexSelect: number = -1;

  selectedIngresos!: Ingreso[] | null;
  private imagen: File;

  miembro: Miembro = { id: 9 }
  constructor(
    private miembroService: MiembroService,
    private tipoService: TipoIngresosService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private ingresoService: IngresoService,

  ) { }

  ngOnInit(): void {
    this.getAll();
    this.getMiembros();
    this.getTipo();
  }

  getAll(): void {
    this.ingresoService.getAll().subscribe((response) => {
      this.ingresos = response as Ingreso[];
    });
  }

  getMiembros(): void {
    this.miembroService.getAll().subscribe((response) => {
      this.miembros = response as Miembro[];
    });
  }
  getTipo(): void {
    this.tipoService.getAll().subscribe((response) => {
      this.tipoIngresos = response as TipoIngreso[];
    })
  }

  getEventValue($event: any): string {
    return $event.target.value;
  }

  openNew() {
    this.ingreso = {};
    this.submitted = false;
    this.ingDialong = true;
    this.title = 'Agregar Ingreso';
  }

  editIng(ingreso: Ingreso) {
    this.ingreso = { ...ingreso };
    this.ingDialong = true;
    this.title = 'Actualiza Ingreso';
    this.indexSelect = this.ingresos.indexOf(ingreso);
  }

  hideDialog() {
    this.ingDialong = false;
    this.submitted = false;
  }
  createFormData(): FormData {
    let formData = new FormData();
    if (this.imagen == null) {
      if (this.ingreso.id == null) {
        this.ingreso.imagen = null;
        formData.append("imagen", null)
      }
    } else {
      formData.append("imagen", this.imagen);
    }
    formData.append("ingreso",
      new Blob([JSON.stringify(this.ingreso)], { type: "application/json" }));
    return formData;
  }


  create(): void {
    this.submitted = true;
    this.ingreso.miembro = this.miembro;
    this.ingresoService.save(this.createFormData() as Ingreso).subscribe({
      
      next: (json) => {
        this.ingresos.unshift(json.Ingreso)
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
    this.ingDialong = false;
  }

  update(): void {
    this.submitted = true;
    let id = this.ingreso.id;
    this.ingresoService.update(this.createFormData() as Ingreso, id).subscribe({
      next: (json) => {
        Object.assign(this.ingresos[this.indexSelect], json.ingreso);
        this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: `${json.message}`, life: 1000 });
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Resultado', detail: `${err.message}`, life: 1000 });
        console.log('code status: ' + err.status);
        console.log(err.message);
      }
    });
    this.ingDialong = false;
    this.ingreso = {};
  }

  seleccionarImagen(event) {
    this.imagen = event.target.files[0];
    console.log(this.imagen);
  }
}
