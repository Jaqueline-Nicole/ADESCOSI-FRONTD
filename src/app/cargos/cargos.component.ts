import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CargoService } from './cargo.service';
import { Cargo } from './cargo';

@Component({
  selector: 'app-cargos',
  templateUrl: './cargos.component.html',
  styleUrls: ['./cargos.component.css']
})
export class CargosComponent implements OnInit {

  // @Input() collapsed = false;
  // @Input() screenWidth = 0;

  // getBodyClass(): string{
  //   let styleClass = '';
  //   if(this.collapsed && this.screenWidth > 768){
  //     styleClass = 'body-trimmed';
  //   }else if(this.collapsed && this.screenWidth <= 768 && this.screenWidth >0){
  //     styleClass = 'body-md-screen';
  //   }
  //   return styleClass;
  // }

  cargos!: Cargo[];
  cargo!: Cargo;
  carDialog: boolean = false;
  title: string="";

  submitted: boolean = false;

  statuses!:any[];
  indexSelect:number =-1;

  selectedCargos!: Cargo[] | null;

  constructor(
    private messageService:MessageService,
    private confirmationService:ConfirmationService,
    private cargoService: CargoService
  ){}

  ngOnInit(): void {
    this.cargoService.getAll().subscribe(
      response => {
        this.cargos = response as Cargo[];
      }
    );
  }


  openNew() {
    this.cargo = {};
    this.submitted = false;
    this.carDialog = true;
    this.title ="Agregar Cargo";
  }
  editCargo(cargo: Cargo) {
    this.cargo = { ...cargo };
    this.carDialog = true;
    this.title ="Actualizar ";
    this.indexSelect = this.cargos.indexOf(cargo);

  }
  deleteCargo(cargo: Cargo) {
    this.confirmationService.confirm({
      message: 'Estas seguro de eliminar ' + cargo.nombre + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.cargoService.delete(cargo.id).subscribe({
          next: (response)=>{
            this.cargos = this.cargos.filter((val) => val.id !== cargo.id);
            this.cargo = {};
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
  hideDialog() {
    this.carDialog = false;
    this.submitted = false;
  }
  create():void{
    if (!this.cargo.nombre || !this.cargo.responsabilidad) {
      this.messageService.add({
        severity: 'error',
        summary: 'Resultado',
        detail: 'No se puede registrar campos vacios',
        life: 3000
      });
      return; // Evitar la ejecución adicional si nombre está vacío
    }
    this.submitted = true;
    this.cargoService.save(this.cargo).subscribe({
      next: (json) => {
        this.cargos.unshift(json.cargo);
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
    this.carDialog = false;
  }
  // update(): void{
  //   this.submitted = true;
  //   let id = this.cargo.id;
  //   this.cargoService.update(this.cargo, id).subscribe(
  //     {
  //       next: (json) =>{
  //         Object.assign(this.cargos[this.indexSelect], json.cargo);
  //         this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: `${json.message}`, life: 1000 });
  //       },
  //       error: (err) =>{
  //         this.messageService.add({ severity: 'error', summary: 'Resultado', detail:'No se puede registrar campos vacios' , life: 1000 }); //`${err.message}`
  //         console.log('code status: ' + err.status);
  //         console.log(err.message);
  //       }
  //     }
  //   );
  //   this.carDialog = false;
  //   this.cargo = {};
  // }
  update(): void {
    this.submitted = true;
    if (!this.cargo.nombre) {
      this.messageService.add({
        severity: 'error',
        summary: 'Resultado',
        detail: 'El nombre del cargo no puede estar vacío',
        life: 1000
      });
      return; // Evitar la ejecución adicional si nombre está vacío
    }
  
    let id = this.cargo.id;
    this.cargoService.update(this.cargo, id).subscribe(
      {
        next: (json) => {
          Object.assign(this.cargos[this.indexSelect], json.cargo);
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
    this.carDialog = false;
    this.cargo = {};
  }
  
  

}
