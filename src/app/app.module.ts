import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialUIModule } from 'src/shared/material-UI/material-ui.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './components/register/register.component';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialUIModule,
    HttpClientModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      closeButton: true,
      progressBar: true,
      positionClass:'toast-top-right'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
