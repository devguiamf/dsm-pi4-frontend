import { HomeComponent } from './home.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { MaterialUIModule } from 'src/shared/material-UI/material-ui.module';
import {MatSidenavModule} from '@angular/material/sidenav';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SettingsComponent } from './settings/settings.component';


@NgModule({
  declarations: [
    HomeComponent,
    DashboardComponent,
    SettingsComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MaterialUIModule,
    MatSidenavModule
  ]
})
export class HomeModule { }
