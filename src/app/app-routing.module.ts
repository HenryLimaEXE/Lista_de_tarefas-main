import { Component, NgModule } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { ListaTarefasComponent } from "./pages/lista-tarefas/lista-tarefas.component";
import { HeaderComponent } from "./components/header/header.component";

const Routes = [
    {path: '', component : ListaTarefasComponent},
    {path: 'header', component: HeaderComponent}
]

@NgModule({
    declarations: [],
    imports:[RouterModule.forRoot(Routes)],
    exports:[RouterModule]
})

export class appRoutingModule{}