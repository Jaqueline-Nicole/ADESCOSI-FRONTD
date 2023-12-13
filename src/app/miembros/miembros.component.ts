import { Component, OnInit } from '@angular/core';
import { Miembro } from './miembro';
import { Periodo } from '../periodos/periodo';
import { Cargo } from '../cargos/cargo';
import { Asociado } from '../asociados/asociado';
import { MiembroService } from './miembro.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CargoService } from '../cargos/cargo.service';
import { AsociadoService } from '../asociados/asociado.service';
import { PeriodoService } from '../periodos/periodo.service';

@Component({
  selector: 'app-miembros',
  templateUrl: './miembros.component.html',
  styleUrls: ['./miembros.component.css']
})
export class MiembrosComponent implements OnInit {

  miembros!: Miembro[];
  miembro!: Miembro;
  mieDialong: boolean = false;
  title: string = ""

 
  ingredient!:string;


  periodos!: Periodo[];
  cargos!: Cargo[];
  asociados!: Asociado[];

  selectedMiembro!: Miembro[] | null;
  submitted: boolean = false;

  private imagen: File;
  estado: string;
  checked: boolean = false;
  indexSelect: number = -1;



  constructor(
    private miembroService: MiembroService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cargoService: CargoService,
    private asociadoService: AsociadoService,
    private periodoService: PeriodoService
  ) { }

  ngOnInit(): void {
    this.getAll();
    this.getCargos();
    this.getAsociados();
    this.getPeriodos();
   

  }

  getAll(): void {
    this.miembroService.getAll().subscribe(
      response => {
      this.miembros = response as Miembro[];
      console.log(response)
    });
  }

  getInactivos(): void {
    this.miembroService.getAllInactivos().subscribe((response) => {
      this.miembros = response as Miembro[];
    });
  }

  getCargos(): void {
    this.cargoService.getAll().subscribe((response) => {
      this.cargos = response as Cargo[];
    });
  }

  getAsociados(): void {
    this.asociadoService.getAllActivos().subscribe((response) => {
      this.asociados = response as Asociado[];
    });
  }

  getPeriodos(): void {
    this.periodoService.getAll().subscribe((response) => {
      this.periodos = response as Periodo[];
    });
  }

  openNew() {
    this.miembro = {};
    this.submitted = false;
    this.mieDialong = true;
    this.title = 'Agregar Miembro';
  }

  editMiembr(miembro: Miembro) {
    this.miembro = { ...miembro };
    this.mieDialong = true;
    this.title = 'Actualizar';
    this.indexSelect = this.miembros.indexOf(miembro);
  }

  hideDialog() {
    this.mieDialong = false;
    this.submitted = false;
  }


  createFormData(): FormData {
    let formData = new FormData();
    formData.append("request",
      new Blob([JSON.stringify(this.miembro)], { type: "application/json" }));
    if (this.imagen == null) {
      if (this.miembro.id == null) {
        this.miembro.imagen = null;
        formData.append("imagen", null)
      }
    } else {
      formData.append("imagen", this.imagen);
    }
    
    return formData;
  }

  create(): void {
    this.submitted = true;
    this.miembroService.save(this.createFormData() as Miembro).subscribe({
      next: (json) => {
        this.miembros.unshift(json.miembro); this.messageService.add({
          severity: 'success', summary: 'Confirmado', detail: `Miembro registrado`, life: 3000
        });
      },
      error:(err)=>{
        if(err.status == 409){
          this.messageService.add({
          severity: 'error', summary: 'Resultado', detail: `${err.error.message}`, life: 3000
          });
        }else{
          this.messageService.add({
          severity: 'error', summary: 'Resultado2', detail: `${err.message}`, life: 3000
          });
        }
      }
    });
    this.mieDialong = false;
    this.miembro = {};
    this.imagen = null;   
  }

  update(): void {
    this.submitted = true;
    let id = this.miembro.id;
    this.miembroService.update(this.createFormData() as Miembro, id).subscribe({
      next:(json) =>{
        Object.assign( this.miembros[this.indexSelect], json.Miembro);
        this.messageService.add({
          severity: 'success', summary: 'Resultado', detail: `${json.messsage}`, life: 2000
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Resultado',
          detail: `${err.message}`,
          life: 1000,
        });
        console.log('code status: ' + err.status);
        console.log(err.message);
      }
    });
    this.mieDialong = false;
    this.miembro = {};
    this.imagen = null;   
  }

  deleteMiembro(estado: string, miembro:Miembro){
    this.confirmationService.confirm({
      message: `Estas seguro de cambiar a ${miembro.estado === 'A' ? 'inactivo' : 'activo'} el asociado ${miembro.asociado.nombre} ?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const nuevoEstado = miembro.estado === "A" ? "I" : "A"
        this.miembroService.changeState(nuevoEstado, miembro).subscribe({
          next: (response) => {
            //this.miembros = this.miembros.filter((val) => val.id !== miembro.id);
            miembro.estado = nuevoEstado;
            this.miembro = {};
            this.messageService.add({ severity: 'success', summary: 'Resultado', detail: `${response.message}`, life: 3000 });

            setTimeout(() => {
              window.location.reload();
            }, 500)
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Resultado', detail: `${err.message}`, life: 1000 });
          }
        })
      },

    })
  }

  seleccionarImagen(event) {
    this.imagen = event.target.files[0];
    console.log(this.imagen);
  }

  getEventValue($event: any): string {
    return $event.target.value;
  }

  checkChanged(event){
    if(event)
      this.getInactivos();
    else
    this.getAll();
  }
  checkChanged1(event){
    if(event)
      this.getAll();
  }

}
