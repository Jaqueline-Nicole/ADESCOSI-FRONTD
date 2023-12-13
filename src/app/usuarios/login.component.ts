import { Component, OnInit } from '@angular/core';
import { Miembro } from '../miembros/miembro';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  implements OnInit {

  title:string = "Autenticacion de Usuarios";
  usuario:Miembro;

  constructor(private router: Router,
    private authService: AuthService) {
    this.usuario = new Miembro();
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      if (this.authService.hasRole('ADMIN')) {
        this.router.navigate(['/asociados']);
      } else {
        this.router.navigate(['/cargos']);
      }
    }
  }

  login(): void {
    if (this.usuario.username == null || this.usuario.password == null) {
      Swal.fire('Error', 'Digite username y password!', 'error');
      return;

    }
    this.authService.login(this.usuario).subscribe(
      {
        next: (json) => {
          // console.log(json);
          // let payLoad =this.authService.obtenerDatosToken(json.token);
          this.authService.guardarToken(json.token);
          this.authService.guardarUsuario(json.token);
          let usuario = this.authService.miembro;
          Swal.fire('Aviso', `Hola ${usuario.nom} has iniciado sesion`, 'success');
          if (this.authService.hasRole('ADMIN')) {
            this.router.navigate(['/asociados']);
          } else {
            this.router.navigate(['/login']);
          }
        },
        error: (err) => {
          if (err.status == 400 || err.status == 403) {
            Swal.fire('Acceso Incorrecto', 'Usuario o Clave incorrectos', 'error');
          }
        }
      }
    )
  }

  
  getUsuario(username: string): void {
    this.authService
  }

  

}
