import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CargosComponent } from './cargos/cargos.component';
import { AsociadosComponent } from './asociados/asociados.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HomeComponent } from './home/home.component';
import { PeriodosComponent } from './periodos/periodos.component';
import { LoginComponent } from './usuarios/login.component';
import { TipoIngresoComponent } from './tipo-ingresos/tipo-ingreso.component';
import { MiembrosComponent } from './miembros/miembros.component';
import { IngresosComponent } from './ingresos/ingresos.component';
import { TipoEgresosComponent } from './tipo-egresos/tipo-egresos.component';
import { TipoActividadesComponent } from './tipo-actividades/tipo-actividades.component';
import { EgresosComponent } from './egresos/egresos.component';
import { ProyectosComponent } from './proyectos/proyectos.component';
import { FiestaPatronalesComponent } from './fiesta-patronales/fiesta-patronales.component';
import { MobiliariosComponent } from './mobiliarios/mobiliarios.component';
import { ActividadSecundariasComponent } from './actividad-secundarias/actividad-secundarias.component';
import { ActividadPrincipalesComponent } from './actividad-principales/actividad-principales.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'cargos', component: CargosComponent },
  { path: 'periodos', component: PeriodosComponent },
  { path: 'home', component: HomeComponent },
  { path: 'asociados', component: AsociadosComponent },
  { path: 'siderbar', component: SidebarComponent },
  { path: 'login', component: LoginComponent },
  { path: 'tipo-ingresos', component: TipoIngresoComponent },
  { path: 'tipo-egresos', component: TipoEgresosComponent },
  { path: 'tipo-actividades', component: TipoActividadesComponent },
  { path: 'miembros', component: MiembrosComponent },
  { path: 'ingresos', component: IngresosComponent },
  { path: 'egresos', component: EgresosComponent },
  { path: 'proyectos', component: ProyectosComponent },
  { path: 'fiestas', component: FiestaPatronalesComponent },
  { path: 'mobiliarios', component: MobiliariosComponent },
  { path: 'secundarias', component: ActividadSecundariasComponent },
  { path: 'principales', component: ActividadPrincipalesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
