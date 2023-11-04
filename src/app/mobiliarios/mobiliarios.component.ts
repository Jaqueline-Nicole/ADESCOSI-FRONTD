import { Component, OnInit } from '@angular/core';
import { Proyecto } from '../proyectos/proyecto';
import { Miembro } from '../miembros/miembro';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MiembroService } from '../miembros/miembro.service';
import { ProyectoService } from '../proyectos/proyecto.service';
import { MobiliarioService } from './mobiliario.service';
import { Mobiliario } from './mobiliario';

@Component({
  selector: 'app-mobiliarios',
  templateUrl: './mobiliarios.component.html',
  styleUrls: ['./mobiliarios.component.css']
})
export class MobiliariosComponent implements OnInit {

  mobiliarios!: Mobiliario[];
  mobiliario!: Mobiliario;
  mobDialog: boolean = false;
  title: string = "";

  submitted: boolean = false;

  statuses!: any[];
  indexSelect: number = -1;

  selectedMobiliario!: Mobiliario[] | null;
  miembros!: Miembro[];

  miembro: Miembro = { id: 9 }

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private miembroService: MiembroService,
    private mobiliarioService: MobiliarioService
    ){
    
  }

  ngOnInit(): void {
    this.getAll();
  }

  getAll(): void {
    this.mobiliarioService.getAll().subscribe((response) => {
      this.mobiliarios = response as Mobiliario[];
      console.log(response);
    });
  }
  openNew() {
    this.mobiliario = {};
    this.submitted = false;
    this.mobDialog = true;
    this.title = 'Agregar ';
  }
  getMiembros(): void {
    this.miembroService.getAll().subscribe((response) => {
      this.miembros = response as Miembro[];
    });
  }
  editMobil(mobiliario: Mobiliario) {
    this.mobiliario = { ...mobiliario };
    this.mobDialog = true;
    this.title = "Actualizar ";
    this.indexSelect = this.mobiliarios.indexOf(mobiliario);
  }
  getEventValue($event: any): string {
    return $event.target.value;
  }
  hideDialog() {
    this.mobDialog = false;
    this.submitted = false;
  }
  create():void{
    if (!this.mobiliario.exitenciaInicial && !this.mobiliario.disponible) {
      this.messageService.add({
        severity: 'error',
        summary: 'Resultado',
        detail: 'El nombre del cargo no puede estar vacío',
        life: 1000
      });
      return; // Evitar la ejecución adicional si nombre está vacío
    }
    this.mobiliario.miembro = this.miembro;
    this.submitted = true;
    this.mobiliarioService.save(this.mobiliario).subscribe({
      next: (json) => {
        this.mobiliarios.unshift(json.Mobiliario);
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
          summary: 'Resultado', detail:'No se puede registrar campos vacios', life: 3000 });
        }

      }
    });
    this.mobDialog = false;
  }

  update(): void{
    this.submitted = true;
    let id = this.mobiliario.id;
    this.mobiliarioService.update( this.mobiliario, id  ).subscribe(
      {
        next: (json) =>{
          Object.assign(this.mobiliarios[this.indexSelect], json.mobiliario);
          this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: `${json.message}`, life: 1000 });
        },
        error: (err) =>{
          this.messageService.add({ severity: 'error', summary: 'Resultado', detail:'No se puede registrar campos vacios' , life: 1000 }); //`${err.message}`
          console.log('code status: ' + err.status);
          console.log(err.message);
        }
      }
    );
    this.mobDialog = false;
    this.mobiliario = {};
  }
}
