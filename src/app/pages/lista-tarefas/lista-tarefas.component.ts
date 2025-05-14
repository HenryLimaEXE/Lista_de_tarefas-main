import { Component, OnInit } from '@angular/core';
import { Tarefa } from '../../shared/models/tarefa.interface';
import Swal from 'sweetalert2';

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
  dataInvalida: any;

  constructor() { }

  ngOnInit() {
    const tarefasFromStorage = localStorage.getItem('tarefas');
    if (tarefasFromStorage) {
      this.tarefas = JSON.parse(tarefasFromStorage);
      this.atualizarListas();
    }
  }

  formatarData(event: any): void {
    let input = event.target.value.replace(/\D/g, '');
    if (input.length > 8) {
      input = input.substring(0, 8);
    }

    if (input.length > 4) {
      input = input.substring(0, 2) + '/' + input.substring(2, 4) + '/' + input.substring(4, 8);
    } else if (input.length > 2) {
      input = input.substring(0, 2) + '/' + input.substring(2, 4);
    }

    this.novaDataLimite = input;
    this.validarData(input);
  }

  validarData(data: string): void {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!regex.test(data)) {
      this.dataInvalida = true;
      return;
    }

    const [dia, mes, ano] = data.split('/').map(Number);

    // Valida o dia e o mês
    if (dia < 1 || dia > 31 || mes < 1 || mes > 12) {
      this.dataInvalida = true;
    } else {
      this.dataInvalida = false;
    }
  }

  //#region CRUD TARFAS

  limpar() {
    this.tarefas = [];
    this.tarefasPendentes = [];
    this.tarefasConcluidas = [];
    this.tarefasAFazer = [];
    this.novaTarefa = '';
    this.novaDataLimite = '';
    this.novaDescricao = '';
  }

  adicionarTarefa() {

    if (this.novaTarefa.trim() == '' || this.novaDataLimite.trim() == '' || this.novaDescricao.trim() == '') {

      Swal.fire("É Necessário preencher todos os campos para adicionar uma nova tafera");

    }

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

  async editarTarefa(index: number, lista: { tarefa: string, dataLimite: string, descricao: string, concluida: boolean }[]) {
    // Editar Tarefa
    const { value: novaTarefa } = await Swal.fire({
      title: 'Editar Tarefa',
      input: 'text',
      inputValue: lista[index].tarefa,
      showCancelButton: true,
      confirmButtonText: 'Salvar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => !value ? 'O nome da tarefa não pode estar vazio!' : null
    });

    if (novaTarefa) {
      lista[index].tarefa = novaTarefa;
      this.atualizarListas();
    }

    // Editar Data
    const { value: novaDataLimite } = await Swal.fire({
      title: 'Editar Data Limite',
      input: 'date',
      inputValue: lista[index].dataLimite,
      showCancelButton: true,
      confirmButtonText: 'Salvar',
      cancelButtonText: 'Cancelar'
    });

    if (novaDataLimite) {
      lista[index].dataLimite = novaDataLimite;
    }

    // Editar Descrição
    const { value: novaDescricao } = await Swal.fire({
      title: 'Editar Descrição',
      input: 'textarea',
      inputValue: lista[index].descricao,
      showCancelButton: true,
      confirmButtonText: 'Salvar',
      cancelButtonText: 'Cancelar'
    });

    if (novaDescricao) {
      lista[index].descricao = novaDescricao;
    }

    // Atualiza o localStorage apenas uma vez no final
    if (novaTarefa || novaDataLimite || novaDescricao) {
      this.atualizarLocalStorage();
    }
  }

  excluirTarefa(index: number, lista: { tarefa: string, dataLimite: string, descricao: string, concluida: boolean }[]) {
    Swal.fire({
      icon: 'warning',
      html: 'Tem certeza que quer excluir?',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Não',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {
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
    });
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

  //#endregion

}
