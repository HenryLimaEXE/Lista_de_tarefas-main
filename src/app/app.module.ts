import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ListaTarefasComponent } from './pages/lista-tarefas/lista-tarefas.component';
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

const routes: Routes = [
  { path: '', component: ListaTarefasComponent },
  { path: '', component: HeaderComponent }

];

@NgModule({
  declarations: [
    AppComponent,
    ListaTarefasComponent,
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
    MatCardModule
  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
