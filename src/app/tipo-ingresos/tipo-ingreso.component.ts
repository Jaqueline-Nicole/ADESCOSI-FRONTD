import { Component, OnInit } from '@angular/core';
import { TipoIngreso } from './tipo-ingreso';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TipoIngresosService } from './tipo-ingresos.service';

@Component({
  selector: 'app-tipo-ingreso',
  templateUrl: './tipo-ingreso.component.html',
  styleUrls: ['./tipo-ingreso.component.css']
})
export class TipoIngresoComponent implements OnInit {

  tipoIngresos!: TipoIngreso[];
  tipoIngreso!: TipoIngreso;
  tipDialog: boolean = false;
  title: string = "";

  submitted: boolean = false;

  statuses!: any[];
  indexSelect: number = -1;

  selectedTipo!: TipoIngreso[] | null;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private tipoIngresoService: TipoIngresosService
  ) { }

  ngOnInit(): void {
    this.tipoIngresoService.getAll().subscribe(
      response => {
        this.tipoIngresos = response as TipoIngreso[];
      }
    );
  }
  getEventValue($event:any):string{
    return $event.target.value;
  }
  openNew() {
    this.tipoIngreso = {};
    this.submitted = false;
    this.tipDialog = true;
    this.title = "Agregar ";
  }
  editTipo(tipoIngreso: TipoIngreso) {
    this.tipoIngreso = { ...tipoIngreso };
    this.tipDialog = true;
    this.title = "Actualizar ";
    this.indexSelect = this.tipoIngresos.indexOf(tipoIngreso);
  }
  deleteTipo(tipoIngreso: TipoIngreso) {
    this.confirmationService.confirm({
      message: 'Estas seguro de eliminar ' + tipoIngreso.nombre + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.tipoIngresoService.delete(tipoIngreso.id).subscribe({
          next: (response) => {
            this.tipoIngresos = this.tipoIngresos.filter((val) => val.id !== tipoIngreso.id);
            this.tipoIngreso = {};
            this.messageService.add({ severity: 'success', summary: 'Resultado', detail: `${response.message}`, life: 3000 });

          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Resultado', detail: 'No se puede eliminar, ya hay registros con: ' + tipoIngreso.nombre, life: 1000 });
          }
        })
      },
    });
  }

  create(): void {
    this.submitted = true;
    this.tipoIngresoService.save(this.tipoIngreso).subscribe({
      next: (json) => {

        this.tipoIngresos.unshift(json.tipoIngreso);
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
    this.tipDialog = false;
  }

  hideDialog() {
    this.tipDialog = false;
    this.submitted = false;
  }

  update(): void {
    this.submitted = true;
    let id = this.tipoIngreso.id;
    this.tipoIngresoService.update(this.tipoIngreso, id).subscribe({
      next: (json) => {
        Object.assign(this.tipoIngresos[this.indexSelect], json.tipoIngreso);
        this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: `${json.message}`, life: 1000 })
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Resultado', detail: `${err.message}`, life: 1000 })
        console.log('code status: ' + err.status);
        console.log(err.message);
      }
    });
    this.tipDialog = false;
    this.tipoIngreso = {}
  }
}
