import { Component, OnInit } from '@angular/core';
import { Tarefa } from '../../shared/models/tarefa.interface';

@Component({
  selector: 'app-lista-tarefas',
  templateUrl: './lista-tarefas.component.html',
  styleUrls: ['./lista-tarefas.component.css']
})

  export class ListaTarefasComponent implements OnInit {
    tarefas: Tarefa[] = [];
    tarefasPendentes: Tarefa[] = [];
    tarefasConcluidas: Tarefa[] = [];
    tarefasAFazer: Tarefa[] = [];
    novaTarefa = '';
    novaDataLimite = '';
    novaDescricao = '';
  
    constructor() { }

  ngOnInit() {
    const tarefasFromStorage = localStorage.getItem('tarefas');
    if (tarefasFromStorage) {
      this.tarefas = JSON.parse(tarefasFromStorage);
      this.atualizarListas();
    }
  }

  adicionarTarefa() {
    if (this.novaTarefa.trim() !== '' && this.novaDataLimite.trim() !== '' && this.novaDescricao.trim() !== '') {
      this.tarefas.push({
        tarefa: this.novaTarefa,
        dataLimite: this.novaDataLimite,
        descricao: this.novaDescricao,
        concluida: false
      });
      this.atualizarListas();
      this.novaTarefa = '';
      this.novaDataLimite = '';
      this.novaDescricao = '';

      localStorage.setItem('tarefas', JSON.stringify(this.tarefas));
    }
  }

  editarTarefa(index: number, lista: { tarefa: string, dataLimite: string, descricao: string, concluida: boolean }[]) {
    const novaTarefa = prompt('Editar tarefa:', lista[index].tarefa);
    if (novaTarefa !== null) {
      lista[index].tarefa = novaTarefa;
      this.atualizarListas();
      this.atualizarLocalStorage();
    }

    const novaDataLimite = prompt('Editar Data:', lista[index].dataLimite);
    if (novaDataLimite !== null) {
      lista[index].dataLimite = novaDataLimite;
      this.atualizarLocalStorage();
    }

    const novaDescricao = prompt('Editar Descrição:', lista[index].descricao);
    if (novaDescricao !== null) {
      lista[index].descricao = novaDescricao;
      this.atualizarLocalStorage();
    }
  } 

  excluirTarefa(index: number, lista: { tarefa: string, dataLimite: string, descricao: string, concluida: boolean }[]) {
    if (lista === this.tarefasPendentes || lista === this.tarefasAFazer || lista === this.tarefasConcluidas) {
      const taskIndex = this.tarefas.findIndex(task => task === lista[index]);
      if (taskIndex !== -1) {
        this.tarefas.splice(taskIndex, 1);
        this.atualizarLocalStorage();
      }

    }
        lista.splice(index, 1);
        this.atualizarListas();
        this.atualizarLocalStorage();
  }

  atualizarListas() {
    this.tarefasPendentes = this.tarefas.filter(tarefa => !tarefa.concluida);
    this.tarefasConcluidas = this.tarefas.filter(tarefa => tarefa.concluida);
    this.tarefasAFazer = this.tarefas.filter(tarefa => !tarefa.concluida && !this.tarefasPendentes.includes(tarefa));
  }

  alternarStatusTarefa(index: number, lista: { tarefa: string, dataLimite: string, descricao: string, concluida: boolean }[]) {
    lista[index].concluida = !lista[index].concluida;
    this.atualizarListas();
    this.atualizarLocalStorage();
  }
  
  moverParaFazendo(index: number) {
  const tarefaSelecionada = this.tarefasPendentes[index];
    if (tarefaSelecionada) {

      this.tarefasPendentes.splice(index, 1);

      this.tarefasAFazer.push(tarefaSelecionada);
      this.atualizarLocalStorage();
    }
}

atualizarLocalStorage() {
  localStorage.setItem('tarefas', JSON.stringify(this.tarefas));
}

}
