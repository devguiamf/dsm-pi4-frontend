import { HomeComponent } from './home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardDiarioComponent } from './dashboard-diario/dashboard-diario.component';
import { SettingsComponent } from './settings/settings.component';
import { EditUserComponent } from './edit-user/edit-user.component';


const routes: Routes = [
  {path: '', component: HomeComponent, 
    children: [
      {path: 'dash-diario', component: DashboardDiarioComponent},
      {path: 'settings', component: SettingsComponent},
      {path: 'edit-user', component: EditUserComponent}
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
