import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from "ngx-spinner";
import { TextMaskModule } from 'angular2-text-mask';
import { CpfCnpjModule } from 'ng2-cpf-cnpj';

import { AppComponent } from './app.component';
import { AngularMaterialModule } from './angular-material/angular-material.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { JwtInterceptor } from './_helpers/jwt.interceptor';

import { AppRoutingModule }  from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { AddComponent, ProductDialog} from './add/add.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AddComponent,
    ProductDialog,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    CoreModule,
    SharedModule,
    NgxSpinnerModule,
    AngularMaterialModule,
    TextMaskModule,
    CpfCnpjModule,
  ],
  entryComponents: [ProductDialog],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'pt-Br'},
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
