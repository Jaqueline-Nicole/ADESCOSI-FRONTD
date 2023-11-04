import { Component, OnInit } from '@angular/core';
import { ActividadPrincipal } from './actividad-principal';
import { FiestaPatronal } from '../fiesta-patronales/fiesta-patronal';
import { ActividadPrincipalService } from './actividad-principal.service';

@Component({
  selector: 'app-actividad-principales',
  templateUrl: './actividad-principales.component.html',
  styleUrls: ['./actividad-principales.component.css']
})
export class ActividadPrincipalesComponent implements OnInit {


  principales!: ActividadPrincipal[];

  constructor(private actividadService: ActividadPrincipalService){}
  ngOnInit(): void {
    this.getAll();
  }

  getAll():void{
    this.actividadService.getAll().subscribe(
      response => {
        this.principales = response as ActividadPrincipal[];
        console.log(response);
      }
    );
  }

}
