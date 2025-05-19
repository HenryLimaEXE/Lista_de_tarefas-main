import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ListaTarefasComponent } from './pages/lista-tarefas/lista-tarefas.component';
import { CadastrarComponent } from './pages/cadastrar/cadastrar.component';
import { LoginComponent } from './pages/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { appRoutingModule } from './app-routing.module';

import {  MatSelectModule } from '@angular/material/select';
import {  MatInputModule  } from '@angular/material/input';
import {  MatFormFieldModule  } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {  MatIconModule } from '@angular/material/icon';
import {  MatDividerModule  } from '@angular/material/divider';
import {  MatButtonModule } from '@angular/material/button';
import {  MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [
    AppComponent,
    ListaTarefasComponent,
    LoginComponent,
    CadastrarComponent,
    HeaderComponent
  ],

  imports: [
    BrowserModule,
    FormsModule,
    RouterModule,
    appRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatMenuModule

  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
