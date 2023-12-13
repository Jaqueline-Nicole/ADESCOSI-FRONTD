import { Component, OnInit } from '@angular/core';
import { Proyecto } from './proyecto';
import { Miembro } from '../miembros/miembro';
import { MiembroService } from '../miembros/miembro.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProyectoService } from './proyecto.service';
import { DatePipe } from '@angular/common';
import { AuthService } from '../usuarios/auth.service';

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css'],
  providers: [DatePipe]

})
export class ProyectosComponent implements OnInit {

  proyectos!: Proyecto[];
  proyecto!: Proyecto;
  proDialong: boolean = false;
  title: string = "";

  estado: string;
  ingredient!: string;

  miembros!: Miembro[];

  submitted: boolean = false;
  indexSelect: number = -1;

  selectedProyectos!: Proyecto[] | null;
  private imagen: File;

  miembro: Miembro = this.authService.miembro
  date: Date | undefined;
  date1: Date | undefined;


  optionRadioButton: string = "activos"

  constructor(
    private miembroService: MiembroService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private proyectoService: ProyectoService,
    private datePipe: DatePipe,
    private authService: AuthService


  ) { }

  ngOnInit(): void {
    this.getAllPediente();

  }

  getAllFinalizadas(): void {
    this.proyectoService.getAllFinalizadas().subscribe((response) => {
      this.proyectos = response as Proyecto[];
    });
  }
  getAllPediente(): void {
    this.proyectoService.getAllPedientes().subscribe((response) => {
      this.proyectos = response as Proyecto[];
    });
  }
  getMiembros(): void {
    this.miembroService.getAll().subscribe((response) => {
      this.miembros = response as Miembro[];
    });
  }
  getEventValue($event: any): string {
    return $event.target.value;
  }
  openNew() {
    this.proyecto = {};
    this.submitted = false;
    this.proDialong = true;
    this.title = 'Agregar ';
  }
  editIng(proyecto: Proyecto) {
    this.proyecto = { ...proyecto };
    this.proDialong = true;
    this.title = 'Actualiza ';
    this.indexSelect = this.proyectos.indexOf(proyecto);

    const format = 'yyyy-MM-dd'
    const locale = 'es-SV'
    const date = new Date(proyecto.fechaInicio)
    date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 4 * 1000)
    const formattedDate = this.datePipe.transform(date, format, locale)

    const date1 = new Date(proyecto.fechaFinalizacion)
    date1.setTime(date1.getTime() + date1.getTimezoneOffset() * 60 * 4 * 1000)
    const formattedDate1 = this.datePipe.transform(date1, format, locale)

    this.date = new Date(formattedDate)
    this.date1 = new Date(formattedDate1)
    console.log(this.date)

  }
  hideDialog() {
    this.proDialong = false;
    this.submitted = false;
  }
  createFormData(): FormData {
    let formData = new FormData();
    if (this.imagen == null) {
      if (this.proyecto.id == null) {
        this.proyecto.imagen = null;
        formData.append("imagen", null)
      }
    } else {
      formData.append("imagen", this.imagen);
    }
    formData.append("proyecto",
      new Blob([JSON.stringify(this.proyecto)], { type: "application/json" }));
    return formData;
  }
  create(): void {
    if (!this.proyecto.nombre || !this.proyecto.descripcion || !this.date || !this.date1 || !this.proyecto.inversion) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor, complete todos los campos obligatorios antes de agregar.',
        life: 3000
      });
      return;
    }
    this.submitted = true;
    this.proyecto.miembro = this.miembro;
    this.proyecto.fechaInicio = this.date;
    this.proyecto.fechaFinalizacion = this.date1;
    this.proyectoService.save(this.createFormData() as Proyecto).subscribe({

      next: (json) => {
        this.proyectos.unshift(json.Proyecto)
        this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: `${json.message}`, life: 3000 });
        // setTimeout(() => {
        //   window.location.reload();
        // }, 300)
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
    this.proDialong = false;
  }
  update(): void {
    this.submitted = true;


    // Validar que los campos requeridos no estén vacíos
    if (!this.proyecto.nombre || !this.proyecto.descripcion || !this.date || !this.date1 || !this.proyecto.inversion) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor, complete todos los campos obligatorios antes de actualizar.',
        life: 3000
      });
      return;
    }

    let id = this.proyecto.id;
    this.proyecto.fechaInicio = this.date;
    this.proyecto.fechaFinalizacion = this.date1;
    this.proyectoService.update(this.createFormData() as Proyecto, id).subscribe({
      next: (json) => {
        Object.assign(this.proyectos[this.indexSelect], json.proyecto);
        this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: `${json.message}`, life: 1000 });
        this.proDialong = false;
        this.proyecto = {};
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Resultado', detail: `${err.message}`, life: 1000 });
        console.log('code status: ' + err.status);
        console.log(err.message);
      }
    });
  }


  delete(proyecto: Proyecto) {
    this.confirmationService.confirm({
      message: 'Estas seguro de eliminar ' + proyecto.nombre + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.proyectoService.delete(proyecto.id).subscribe({
          next: (response) => {
            this.proyectos = this.proyectos.filter((val) => val.id !== proyecto.id);
            this.proyecto = {};
            this.messageService.add({ severity: 'success', summary: 'Resultado', detail: `${response.message}`, life: 3000 });


          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Resultado', detail: `${err.message}`, life: 1000 });
          }
        })
      },
    });
  }

  seleccionarImagen(event) {
    this.imagen = event.target.files[0];
    console.log(this.imagen);
  }

  changeState(proyecto: Proyecto, estado: string) {
    this.confirmationService.confirm({
      message: 'Seguro/a de finalizar el proyecto: ' + proyecto.nombre,
      header: 'Confirmacion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.proyectoService.changeState(estado, proyecto).subscribe({
          next: (response) => {
            this.proyectos = this.proyectos.filter((val) => val.id !== proyecto.id);
            this.proyectos = null;
            this.messageService.add({ severity: 'success', summary: 'Resultado', detail: `${response.message}`, life: 3000 });
            setTimeout(() => {
              window.location.reload();
            }, 500)
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Resultado', detail: `${err.message}`, life: 1000 });
            console.log('status code: ' + err.status);
            console.log(err.message);
          }
        })
      },
    });
  }
  checkChanged(event) {
    if (event)
      this.getAllFinalizadas();
  }
  checkChanged1(event) {
    if (event)
      this.getAllPediente();
  }
}

