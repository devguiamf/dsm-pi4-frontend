import { HomeComponent } from './home.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { MaterialUIModule } from 'src/shared/material-UI/material-ui.module';
import {MatSidenavModule} from '@angular/material/sidenav';
import { DashboardDiarioComponent } from './dashboard-diario/dashboard-diario.component';
import { SettingsComponent } from './settings/settings.component';
import { TextCutPipe } from 'src/shared/pipes/text-cut.pipe';
import { EditUserComponent } from './edit-user/edit-user.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DashboardTempoRealComponent } from './dashboard-tempoReal/dashboard-tempo-real.component';
import { DashboardMensalComponent } from './dashboard-mensal/dashboard-mensal.component';
import { PaginaInicialComponent } from './pagina-inicial/pagina-inicial.component';

@NgModule({
  declarations: [
    HomeComponent,
    DashboardDiarioComponent,
    SettingsComponent,
    TextCutPipe,
    EditUserComponent,
    DashboardTempoRealComponent,
    DashboardMensalComponent,
    PaginaInicialComponent,
    
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MaterialUIModule,
    MatSidenavModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule 
  ],
  providers: [
    MatDatepickerModule, MatNativeDateModule
  ]
})
export class HomeModule { }
