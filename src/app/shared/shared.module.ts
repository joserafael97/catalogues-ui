import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { AlertComponent } from './alert/alert.component';


@NgModule({
  declarations: [ConfirmDialogComponent, AlertComponent],
  imports: [
    CommonModule,
    AngularMaterialModule
  ],
  exports: [
  ],
  entryComponents: [ConfirmDialogComponent, AlertComponent]

})
export class SharedModule { }
