import { Component, OnInit, LOCALE_ID } from '@angular/core';
import { Asociado } from './asociado';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AsociadoService } from './asociado.service';
import { DatePipe } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs);

interface EstadoCivil {
  nombre: string;
  code: string
}
@Component({
  selector: 'app-asociados',
  templateUrl: './asociados.component.html',
  styleUrls: ['./asociados.component.css'],
  providers: [DatePipe, { provide: LOCALE_ID, useValue: 'es-ES' }],
})
export class AsociadosComponent implements OnInit {

  estadosCiviles: EstadoCivil[] | undefined;
  selectedEstadoCivil: EstadoCivil | undefined;

  ingredient!: string;

  asociados!: Asociado[];
  asociado!: Asociado;
  asoDialog: boolean = false;
  title: string = "";

  submitted: boolean = false;

  statuses!: any[];
  indexSelect: number = -1;

  selectedAsociados!: Asociado[] | null;

  date: Date | undefined;
  estado: string;
  checked!: string;


  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private asociadoService: AsociadoService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.getActivos();
    this.estadosCiviles = [
      { nombre: 'Casado/a', code: 'C' },
      { nombre: 'Divorciado', code: 'D' },
      { nombre: 'Soltero', code: 'S' },
      { nombre: 'Viudo', code: 'V' },
    ]
  }

  openNew() {
    this.asociado = {};
    this.submitted = false;
    this.asoDialog = true;
    this.title = "Agregar asociado";
  }
  getInactivos(): void {
    this.asociadoService.getAllInactivos().subscribe((response) => {
      this.asociados = response as Asociado[];
      //console.log(response);
    });
  }

  getFallecidos(): void {
    this.asociadoService.getAllFallecidos().subscribe((response) => {
      this.asociados = response as Asociado[];
      //console.log(response);
    });
  }

  getActivos(): void {
    this.asociadoService.getAllActivos().subscribe(
      response => {
        this.asociados = response as Asociado[];
        console.log(response);
      }
    );
  }
  editAsociado(asociado: Asociado) {
    this.asociado = { ...asociado };
    this.asoDialog = true;
    this.title = "Actualizar ";
    this.indexSelect = this.asociados.indexOf(asociado);

    const found = this.estadosCiviles.find((e) => e.code == asociado.estadoCivil)
    this.selectedEstadoCivil = found;


    const format = 'yyyy-MM-dd'
    const locale = 'es-SV'
    const date = new Date(asociado.fechaNacimiento)
    date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 4 * 1000)
    const formattedDate = this.datePipe.transform(date, format, locale)

    this.date = new Date(formattedDate)
    console.log(formattedDate)
    console.log(this.date)
    //console.log(this.asociado.fechaNacimiento)
  }
  getEventValue($event: any): string {
    return $event.target.value;
  }
  hideDialog() {
    this.asoDialog = false;
    this.submitted = false;
  }

  create(): void {
    this.submitted = true;
    this.asociado.estadoCivil = this.selectedEstadoCivil.code;
    this.asociado.fechaNacimiento = this.date;
    // Calcula la fecha mínima permitida (hoy menos 18 años)
    const fechaMinima = new Date();
    fechaMinima.setFullYear(fechaMinima.getFullYear() - 18);

    // Validar que el nombre y lugar de nacimiento tengan al menos 10 caracteres
    const nombreValido = /^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ\s,]+$/u.test(this.asociado.nombre);
    const lugarNacimientoValido = this.asociado.lugarNacimiento && this.asociado.lugarNacimiento.length >= 10;
    const nomValido = this.asociado.nombre && this.asociado.nombre.length >= 3 && this.asociado.nombre && this.asociado.nombre.length <= 50;

    if (!nombreValido || !lugarNacimientoValido || !nomValido) {
      // Muestra un mensaje de error si los campos no cumplen con los requisitos
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Los dastos ingresados no son correctos. ',
        life: 3000
      });
      return; // Salir de la función sin continuar
    }

    // Verifica si la fecha de nacimiento seleccionada es válida
    if (this.date && this.date < fechaMinima) {
      // La fecha es válida, puede continuar con la creación

      this.asociadoService.save(this.asociado).subscribe({
        next: (json) => {
          this.asociados.unshift(json.asociado);
          this.messageService.add({
            severity: 'success',
            summary: 'Bienvenido/a',
            detail: `${json.message}`,
            life: 3000
          });
        },
        error: (err) => {
          if (err.status == 409) {
            this.messageService.add({
              severity: 'error',
              summary: 'Resultado1',
              detail: `${err.error.message}`,
              life: 3000
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Resultado2',
              detail: `${err.error.message}`,
              life: 3000
            });
          }
        }
      });
      this.asoDialog = false;
    } else {
      // La fecha no es válida, muestra un mensaje de error
      this.messageService.add({
        severity: 'error', summary: 'Resultado3',
        detail: 'Los datos ingresados no son correctos',
        life: 3000
      });
    }
  }


  update(): void {
    this.submitted = true;
    let id = this.asociado.id;

    const nombreValido = /^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ\s,]+$/u.test(this.asociado.nombre);
    const fechaMinima = new Date();
    fechaMinima.setFullYear(fechaMinima.getFullYear() - 18);
    this.asociado.fechaNacimiento = this.date;
    this.asociado.estadoCivil = this.selectedEstadoCivil.code;
    const lugarNacimientoValido = this.asociado.lugarNacimiento && this.asociado.lugarNacimiento.length >= 10;
    const nomValido = this.asociado.nombre && this.asociado.nombre.length >= 3 && this.asociado.nombre && this.asociado.nombre.length <= 50;



    if (!nombreValido || !lugarNacimientoValido || !nomValido) {
      // Muestra un mensaje de error si el nombre contiene caracteres no permitidos
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El nombre debe contener solo letras y tener al menos 3 caracteres. ' +
          'El lugar de nacimiento debe tener al menos 10 caracteres.',
        life: 3000
      });
      return; // Salir de la función sin continuar
    }
    if (this.date && this.date < fechaMinima) {
      this.asociadoService.update(this.asociado, id).subscribe(
        {
          next: (json) => {
            Object.assign(this.asociados[this.indexSelect], json.Asociado);
            this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: `${json.message}`, life: 1000 });
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Resultado', detail: `${err.message}`, life: 1000 });
            console.log('code status: ' + err.status);
            console.log(err.message);
          }
        }
      );
      this.asoDialog = false;
      this.asociado = {};
    } else {
      // La fecha no es válida, muestra un mensaje de error
      this.messageService.add({
        severity: 'error', summary: 'Resultado3',
        detail: 'Los datos ingresados no son correctos, asegurate que la fecha sea correcta ',
        life: 3000
      });
    }
  }

  deleteAsociado(asociado: Asociado) {
    this.confirmationService.confirm({
      message: `Estas seguro de cambiar a ${asociado.estado === 'A' ? 'inactivo' : 'activo'} el asociado ${asociado.nombre} ?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const nuevoEstado = asociado.estado === "A" ? "I" : "A"
        this.asociadoService.changeState(nuevoEstado, asociado).subscribe({
          next: (response) => {
            // this.asociados = this.asociados.filter((val) => val.id !== this.asociado.id);
            asociado.estado = nuevoEstado;
            this.asociado = {};

            this.messageService.add({ severity: 'success', summary: 'Resultado', detail: `${response.message}`, life: 3000 });
            //regarga la pagina 
            setTimeout(() => {
              window.location.reload();
            }, 500)
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Resultado', detail: `${err.message}`, life: 1000 });
          }
        })
      },
    });
  }

  delete(estado: string, asociado: Asociado) {
    this.confirmationService.confirm({
      message: '¿Estas seguro de cambiar a fallecido a ' + asociado.nombre + '?',
      header: 'Confirmacion',
      icon: 'pi pi-exclamation-circle',
      accept: () => {
        this.asociadoService.changeState2(estado, asociado).subscribe({
          next: (response) => {
            this.asociados = this.asociados.filter((val) => val.id !== asociado.id);
            this.asociado = {};
            this.messageService.add({ severity: 'success', summary: 'Resultado', detail: `${response.message}`, life: 3000 });
            this.checkChanged3
            // setTimeout(() => {
            //   window.location.reload();
            // }, 500)

          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Resultado', detail: `${err.message}`, life: 1000 });
          }
        })
      },
    });
  }

  checkChanged(event) {
    if (event) {
      this.getInactivos();
    } else {
      this.getActivos();
    }
  }

  checkChanged2(event) {
    if (event) {
      this.getFallecidos();
    } else {
      this.getActivos();
    }
  }
  checkChanged3(event) {
    if (event) {
      this.getActivos()
    }
  }


}
