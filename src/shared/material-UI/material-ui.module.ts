import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  exports: [
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule
  ]
})
export class MaterialUIModule { }
