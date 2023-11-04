import { Component, OnInit } from '@angular/core';
import { TipoActividad } from './tipo-actividad';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TipoActividadService } from './tipo-actividad.service';

@Component({
  selector: 'app-tipo-actividades',
  templateUrl: './tipo-actividades.component.html',
  styleUrls: ['./tipo-actividades.component.css']
})
export class TipoActividadesComponent implements OnInit {

  tipoActividades!: TipoActividad[];
  tipoActividad!: TipoActividad;
  tipDialog: boolean = false;
  title: string="";

  submitted: boolean = false;

  statuses!:any[];
  indexSelect:number =-1;

  selectedTipo!: TipoActividad[] | null;

  constructor(
    private messageService:MessageService,
    private confirmationService:ConfirmationService,
    private tipoActividadService: TipoActividadService
  ){}

  ngOnInit(): void {
    this.tipoActividadService.getAll().subscribe(
      response =>{
        this.tipoActividades = response as TipoActividad[];
      }
    )
  }
  openNew() {
    this.tipoActividad = {};
    this.submitted = false;
    this.tipDialog = true;
    this.title ="Agregar ";
  }
  editTipo(tipoActividad: TipoActividad) {
    this.tipoActividad = { ...tipoActividad };
    this.tipDialog = true;
    this.title ="Actualizar ";
    this.indexSelect = this.tipoActividades.indexOf(tipoActividad);
  }
  hideDialog() {
    this.tipDialog = false;
    this.submitted = false;
  }
  create():void{

    this.submitted = true;
    this.tipoActividadService.save(this.tipoActividad).subscribe({
      next: (json) => {

        this.tipoActividades.unshift(json.tipoActividad);
        this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: `${json.message}`, life: 3000 });
      },
      error: (err) => {
        if(err.status ==409)
        {
          this.messageService.add({ severity: 'error', 
          summary: 'Resultado', detail: `${err.error.message}`, life: 3000 });
        }
        else
        {
          this.messageService.add({ severity: 'error', 
          summary: 'Resultado', detail: `${err.error}`, life: 3000 });
        }

      }
    });
    this.tipDialog = false;
  }

  update(): void{
    this.submitted = true;
    let id = this.tipoActividad.id;
    this.tipoActividadService.update(this.tipoActividad, id).subscribe({
      next:(json)=>{
        Object.assign(this.tipoActividad[this.indexSelect], json.tipoActividad);
        this.messageService.add({ severity:'success' , summary:'Confirmado', detail: `${json.message}`, life: 1000})
      }, 
      error:(err)=>{
        this.messageService.add({ severity:'error' , summary:'Resultado', detail: `${err.message}`, life: 1000})
        console.log('code status: ' + err.status);
        console.log(err.message);
      }
    });
    this.tipDialog = false;
    this.tipoActividad ={}
  }
  deleteTipo(tipoActividad: TipoActividad) {
    this.confirmationService.confirm({
      message: 'Estas seguro de eliminar ' + tipoActividad.nombre + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.tipoActividadService.delete(tipoActividad.id).subscribe({
          next: (response)=>{
            this.tipoActividades = this.tipoActividades.filter((val) => val.id !== tipoActividad.id);
            this.tipoActividad = {};
            this.messageService.add({ severity: 'success', summary: 'Resultado', detail: `${response.message}`, life: 3000 });
      
          },
          error: (err)=>{
            this.messageService.add({ severity: 'error', summary: 'Resultado', detail: `${err.message}`, life: 1000 });
          }
        })
        },
    });
  }

  getEventValue($event:any):string{
    return $event.target.value;
  }


}
