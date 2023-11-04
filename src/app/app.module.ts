import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

//font Awesome
import { MatButtonModule } from '@angular/material/button';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
//importaciones de Primeng
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import {ProgressBarModule} from 'primeng/progressbar';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUploadModule } from 'primeng/fileupload';
import { ToolbarModule } from 'primeng/toolbar';
import { SidebarModule } from 'primeng/sidebar';
import { MenuModule } from 'primeng/menu';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { DataViewModule } from 'primeng/dataview';

import {MatIconModule} from '@angular/material/icon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


import { OverlayModule } from '@angular/cdk/overlay'
import { CdkMenuModule } from '@angular/cdk/menu'

import { registerLocaleData } from '@angular/common';
import localEs from '@angular/common/locales/es-SV';
import { CargosComponent } from './cargos/cargos.component';
import { PeriodosComponent } from './periodos/periodos.component';
import { AsociadosComponent } from './asociados/asociados.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HomeComponent } from './home/home.component';
import { SublevelMenuComponent } from './sidebar/sublevel-menu.component';
import { TipoIngresoComponent } from './tipo-ingresos/tipo-ingreso.component';
import { LoginComponent } from './usuarios/login.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { IngresosComponent } from './ingresos/ingresos.component';
import { MiembrosComponent } from './miembros/miembros.component';
import { EgresosComponent } from './egresos/egresos.component';
import { TipoEgresosComponent } from './tipo-egresos/tipo-egresos.component';
import { TipoActividadesComponent } from './tipo-actividades/tipo-actividades.component';
import { FiestaPatronalesComponent } from './fiesta-patronales/fiesta-patronales.component';
import { ProyectosComponent } from './proyectos/proyectos.component';
import { MobiliariosComponent } from './mobiliarios/mobiliarios.component';
import { ActividadPrincipalesComponent } from './actividad-principales/actividad-principales.component';
import { ActividadSecundariasComponent } from './actividad-secundarias/actividad-secundarias.component';

registerLocaleData(localEs, 'es-SV');

@NgModule({
  declarations: [
    AppComponent,
    CargosComponent,
    PeriodosComponent,
    AsociadosComponent,
    SidebarComponent,
    HomeComponent,
    SublevelMenuComponent,
    TipoIngresoComponent,
    LoginComponent,
    UsuariosComponent,
    IngresosComponent,
    MiembrosComponent,
    EgresosComponent,
    TipoEgresosComponent,
    TipoActividadesComponent,
    FiestaPatronalesComponent,
    ProyectosComponent,
    MobiliariosComponent,
    ActividadPrincipalesComponent,
    ActividadSecundariasComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ButtonModule,
    ToastModule,
    TableModule,
    CalendarModule,
    DialogModule,
    DropdownModule,
    ProgressBarModule,
    InputTextModule,
    InputTextareaModule,
    FileUploadModule,
    ToolbarModule,
    SidebarModule,
    MenuModule,
    RadioButtonModule,
    InputNumberModule,
    ConfirmDialogModule,
    CheckboxModule,
    DataViewModule,
    MatIconModule,
    OverlayModule,
    CdkMenuModule,
    FontAwesomeModule,
    MatButtonModule
    

  ],
  providers: [
    ConfirmationService,
    MessageService,
    {provide:LOCALE_ID, useValue: 'es-SV'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  
 }