import { Component, OnInit } from '@angular/core';
import { ActividadSecundaria } from './actividad-secundaria';
import { Miembro } from '../miembros/miembro';
import { TipoActividad } from '../tipo-actividades/tipo-actividad';
import { MiembroService } from '../miembros/miembro.service';
import { TipoActividadService } from '../tipo-actividades/tipo-actividad.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActividadSecundariaService } from './actividad-secundaria.service';

@Component({
  selector: 'app-actividad-secundarias',
  templateUrl: './actividad-secundarias.component.html',
  styleUrls: ['./actividad-secundarias.component.css'],

})
export class ActividadSecundariasComponent implements OnInit {

  actividades!: ActividadSecundaria[];
  actividad!: ActividadSecundaria;
  segDialong: boolean = false;
  title: string = "";
  
  miembros!: Miembro[];
  tipoActs!: TipoActividad[];

  selectedSegs!: ActividadSecundaria[] | null;
  private imagen: File;
  submitted: boolean = false;
  indexSelect: number = -1;

  miembro: Miembro = { id:3 }

  constructor(
    private miembroService: MiembroService,
    private tipoService: TipoActividadService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private segundoService: ActividadSecundariaService, 

  ){}

  ngOnInit(): void {
    this.getAll();
    this.getTipo();
  }
  getAll(): void {
    this.segundoService.getAll().subscribe((response) => {
      this.actividades = response as ActividadSecundaria[];
      console.log(response)
    });
  }
  editIng(actividad: ActividadSecundaria) {
    this.actividad = { ...actividad };
    this.segDialong = true;
    this.title = 'Actualiza egreso';
    this.indexSelect = this.actividades.indexOf(actividad);
  }
  hideDialog() {
    this.segDialong = false;
    this.submitted = false;
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

  getEventValue($event: any): string {
    return $event.target.value;
  }
  openNew() {
    this.actividad = {};
    this.submitted = false;
    this.segDialong = true;
    this.title = 'Agregar';
  }
  createFormData(): FormData {
    let formData = new FormData();
    if (this.imagen == null) {
      if (this.actividad.id == null) {
        this.actividad.imagen = null;
        formData.append("imagen", null)
      }
    } else {
      formData.append("imagen", this.imagen);
    }
    formData.append("actividad",
      new Blob([JSON.stringify(this.actividad)], { type: "application/json" }));
    return formData;
  }

  create(): void {
    this.submitted = true;
    this.actividad.miembro = this.miembro;
    this.segundoService.save(this.createFormData() as ActividadSecundaria).subscribe({
      next: (json) => {
        this.actividades.unshift(json.actividad)
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
    this.segDialong = false;
  }

  update(): void {
    this.submitted = true;
    let id = this.actividad.id;
    this.segundoService.update(this.createFormData() as ActividadSecundaria, id).subscribe({
      next: (json) => {
        Object.assign(this.actividades[this.indexSelect], json.actividad);
        this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: `${json.message}`, life: 1000 });
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Resultado', detail: `${err.message}`, life: 1000 });
        console.log('code status: ' + err.status);
        console.log(err.message);
      }
    });
    this.segDialong = false;
    this.actividad = {};
  }

  seleccionarImagen(event) {
    this.imagen = event.target.files[0];
    console.log(this.imagen);
  }
}
