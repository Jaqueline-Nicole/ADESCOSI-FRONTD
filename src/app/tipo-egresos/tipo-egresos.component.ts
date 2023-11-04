import { Component, OnInit } from '@angular/core';
import { TipoEgreso } from './tipo-egreso';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TipoEgresoService } from './tipo-egreso.service';

@Component({
  selector: 'app-tipo-egresos',
  templateUrl: './tipo-egresos.component.html',
  styleUrls: ['./tipo-egresos.component.css']
})
export class TipoEgresosComponent implements OnInit {
  tipoEgresos!: TipoEgreso[];
  tipoEgreso!: TipoEgreso;
  tipDialog: boolean = false;
  title: string = "";

  submitted: boolean = false;

  statuses!: any[];
  indexSelect: number = -1;

  selectedTipo!: TipoEgreso[] | null;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private tipoEgresoService: TipoEgresoService
  ) { }

  ngOnInit(): void {
    this.tipoEgresoService.getAll().subscribe(
      response => {
        this.tipoEgresos = response as TipoEgreso[];
      }
    );
  }
  getEventValue($event: any): string {
    return $event.target.value;
  }
  openNew() {
    this.tipoEgreso = {};
    this.submitted = false;
    this.tipDialog = true;
    this.title = "Agregar ";
  }
  editTipo(tipoEgreso: TipoEgreso) {
    this.tipoEgreso = { ...tipoEgreso };
    this.tipDialog = true;
    this.title = "Actualizar ";
    this.indexSelect = this.tipoEgresos.indexOf(tipoEgreso);
  }
  deleteTipo(tipoEgreso: TipoEgreso) {
    this.confirmationService.confirm({
      message: 'Estas seguro de eliminar ' + tipoEgreso.nombre + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.tipoEgresoService.delete(tipoEgreso.id).subscribe({
          next: (response) => {
            this.tipoEgresos = this.tipoEgresos.filter((val) => val.id !== tipoEgreso.id);
            this.tipoEgreso = {};
            this.messageService.add({ severity: 'success', summary: 'Resultado', detail: `${response.message}`, life: 3000 });

          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Resultado', detail: `${err.message}`, life: 1000 });
          }
        })
      },
    });
  }
  create(): void {
    this.submitted = true;
  
    if (this.tipoEgreso.nombre.trim() !== "") { // Verificar que el nombre no esté vacío
      this.tipoEgresoService.save(this.tipoEgreso).subscribe({
        next: (json) => {
          this.tipoEgresos.unshift(json.tipoEgreso);
          this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: `${json.message}`, life: 3000 });
        },
        error: (err) => {
          if (err.status == 409) {
            this.messageService.add({
              severity: 'error',
              summary: 'Resultado',
              detail: `${err.error.message}`,
              life: 3000
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Resultado',
              detail: `${err.error}`,
              life: 3000
            });
          }
        }
      });
      this.tipDialog = false;
    } else {
      this.messageService.add({
        severity: 'error', summary: 'Resultado',
        detail: 'El nombre no puede estar vacío. Rellena los campos correctamente.',
        life: 3000
      });
    }
    
    
   
  }
  hideDialog() {
    this.tipDialog = false;
    this.submitted = false;
  }
  update(): void {
    this.submitted = true;
    let id = this.tipoEgreso.id;
    this.tipoEgresoService.update(this.tipoEgreso, id).subscribe({
      next: (json) => {
        Object.assign(this.tipoEgresos[this.indexSelect], json.tipoEgreso);
        this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: `${json.message}`, life: 1000 })
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Resultado', detail: `${err.message}`, life: 1000 })
        console.log('code status: ' + err.status);
        console.log(err.message);
      }
    });
    this.tipDialog = false;
    this.tipoEgreso = {}
  }

}
