import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PeriodoService } from './periodo.service';
import { Periodo } from './periodo';
import { AuthService } from '../usuarios/auth.service';

@Component({
  selector: 'app-periodos',
  templateUrl: './periodos.component.html',
  styleUrls: ['./periodos.component.css']
})
export class PeriodosComponent implements OnInit {

  periodos!: Periodo[];
  periodo!: Periodo;
  perDialog: boolean = false;
  title: string="";

  submitted: boolean = false;

  statuses!:any[];
  indexSelect:number =-1;

  selectedPeriodos!: Periodo[] | null;

  
  constructor(
    private messageService:MessageService,
    private confirmationService:ConfirmationService,
    private periodoService: PeriodoService,
    
    ){    }
  ngOnInit(): void {
    this.periodoService.getAll().subscribe(
      response => {
        this.periodos = response as Periodo[];
      }
    );
  }
  validateDate(date: number): boolean {
    const currentYear = this.getCurrentYear();
    
    // Verificar si la fecha tiene cuatro dígitos y está dentro del rango permitido
    return date.toString().length === 4 && date >= 1990 && date <= currentYear;
  }
  
  validateDateRange(startDate: number, endDate: number): boolean {
    return endDate === startDate + 2 && endDate >= startDate;
  }
  getCurrentYear(): number {
    const currentYear = new Date().getFullYear();
    return currentYear;
  }

  openNew() {
    this.periodo = {};
    this.submitted = false;
    this.perDialog = true;
    this.title ="Agregar periodo";
  }

  editPeriodo(periodo: Periodo) {
    this.periodo = { ...periodo };
    this.perDialog = true;
    this.title ="Actualizar periodo";
    this.indexSelect = this.periodos.indexOf(periodo);

  }


  getEventValue($event:any):string{
    return $event.target.value;
  }

  hideDialog() {
    this.perDialog = false;
    this.submitted = false;
  }
  create(): void {
    this.submitted = true;
    if (!this.validateDate(this.periodo.fechaInicio) || !this.validateDate(this.periodo.fechaFinal)) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'El año debe ser de cuatro dígitos y estar entre 1990 y el año actual.',
      life: 3000
    });
    return;
  }
  
    if (!this.validateDateRange(this.periodo.fechaInicio, this.periodo.fechaFinal)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'La fecha de finalización debe ser exactamente dos años mayores que la fecha de inicio y no menor.',
        life: 3000
      });
      return;
    }

    
  
    this.periodoService.save(this.periodo).subscribe({
      next: (json) => {
        this.periodos.unshift(json.Periodo);
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
    this.perDialog = false;
  }
  

  update(): void {
    this.submitted = true;
  
    if (!this.validateDate(this.periodo.fechaInicio) || !this.validateDate(this.periodo.fechaFinal)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El año debe ser de cuatro dígitos y estar entre 1990 y el año actual.',
        life: 3000
      });
      return;
    }
  
    if (!this.validateDateRange(this.periodo.fechaInicio, this.periodo.fechaFinal)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'La fecha de finalización debe ser exactamente dos años mayores que la fecha de inicio y no menor.',
        life: 3000
      });
      return;
    }
  
    let id = this.periodo.id;
    this.periodoService.update(this.periodo, id).subscribe({
      next: (json) => {
        Object.assign(this.periodos[this.indexSelect], json.Periodo);
        this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: `${json.message}`, life: 1000 });
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Resultado', detail: `${err.message}`, life: 1000 });
        console.log('code status: ' + err.status);
        console.log(err.message);
      }
    });
  
    this.perDialog = false;
    this.periodo = {};
  }
}