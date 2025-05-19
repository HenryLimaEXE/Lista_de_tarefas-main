import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ListaTarefasComponent } from './pages/lista-tarefas/lista-tarefas.component';
import { CadastrarComponent } from './pages/cadastrar/cadastrar.component';

const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'lista-tarefas', component: ListaTarefasComponent },
  { path: 'cadastrar', component: CadastrarComponent },
  { 
    path: '**',
    redirectTo: 'login'
  }
];

@NgModule({
    declarations: [],
    imports:[RouterModule.forRoot(routes)],
    exports:[RouterModule]
})

export class appRoutingModule{}