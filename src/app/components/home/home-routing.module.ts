import { HomeComponent } from './home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardDiarioComponent } from './dashboard-diario/dashboard-diario.component';
import { SettingsComponent } from './settings/settings.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { DashboardTempoRealComponent } from './dashboard-tempoReal/dashboard-tempo-real.component';
import { DashboardMensalComponent } from './dashboard-mensal/dashboard-mensal.component';
import { PaginaInicialComponent } from './pagina-inicial/pagina-inicial.component';


const routes: Routes = [
  {path: '', component: HomeComponent, 
    children: [
      {path: '', redirectTo: 'inicial', pathMatch: 'full'},
      {path: 'dash-diario', component: DashboardDiarioComponent},
      {path: 'dash-tempo-real', component: DashboardTempoRealComponent},
      {path: 'dash-mensal', component: DashboardMensalComponent},
      {path: 'settings', component: SettingsComponent},
      {path: 'edit-user', component: EditUserComponent},
      {path: 'inicial', component: PaginaInicialComponent}
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
