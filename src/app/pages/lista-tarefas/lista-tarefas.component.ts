import { Component, OnInit } from '@angular/core';
import { Tarefa } from '../../shared/models/tarefa.interface';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-tarefas',
  templateUrl: './lista-tarefas.component.html',
  styleUrls: ['./lista-tarefas.component.css']
})

export class ListaTarefasComponent implements OnInit {
  userName: string | null = null;
  loggedUser: any = null;
  tarefas: Tarefa[] = [];
  tarefasPendentes: Tarefa[] = [];
  tarefasConcluidas: Tarefa[] = [];
  tarefasAFazer: Tarefa[] = [];
  novaTarefa = '';
  novaDataLimite = '';
  novaDescricao = '';
  dataInvalida: any;

  constructor(private router: Router) { }

  ngOnInit() {
    const tarefasFromStorage = localStorage.getItem('tarefas');
    if (tarefasFromStorage) {
      this.tarefas = JSON.parse(tarefasFromStorage);
      this.atualizarListas();
    }

    this.loggedUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');

    if (this.loggedUser && this.loggedUser.id) {
      this.userName = this.loggedUser.name;
      this.carregarTarefas();
    }
  }

  carregarTarefas() {
    const userKey = `tarefas_${this.loggedUser.id}`;

    const tarefasFromStorage = localStorage.getItem(userKey);
    if (tarefasFromStorage) {
      this.tarefas = JSON.parse(tarefasFromStorage);
      this.atualizarListas();
    }
  }

  salvarTarefas() {
    const userKey = `tarefas_${this.loggedUser.id}`;
    localStorage.setItem(userKey, JSON.stringify(this.tarefas));
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
      Swal.fire("É Necessário preencher todos os campos para adicionar uma nova tarefa");
      return;
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

      this.salvarTarefas();
    }
  }

  async editarTarefa(index: number, lista: { tarefa: string, dataLimite: string, descricao: string, concluida: boolean }[]) {
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

    if (novaTarefa || novaDataLimite || novaDescricao) {
      this.salvarTarefas();
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
            this.salvarTarefas();
          }
        }
        lista.splice(index, 1);
        this.atualizarListas();
        this.salvarTarefas();
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
    this.salvarTarefas();
  }

  moverParaFazendo(index: number, lista: { tarefa: string, dataLimite: string, descricao: string, concluida: boolean }[]) {
    const tarefaSelecionada = lista[index];
    if (tarefaSelecionada) {
      lista.splice(index, 1);
      this.tarefasAFazer.push(tarefaSelecionada);
      this.salvarTarefas();
    }
  }

  atualizarLocalStorage() {
    localStorage.setItem('tarefas', JSON.stringify(this.tarefas));
  }

  redirecionarParaRedefinirSenha() {
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');

    if (!loggedUser) {
      Swal.fire('Você não está logado!', 'Faça login para redefinir sua senha.', 'error');
      return;
    }

    Swal.fire({
      title: 'Redefinir Senha',
      html: `
      <div class="swal-form">
        <input id="currentPassword" type="password" class="swal2-input" placeholder="Digite a senha original">
        <input id="newPassword" type="password" class="swal2-input" placeholder="Digite a nova senha">
        <input id="confirmNewPassword" type="password" class="swal2-input" placeholder="Confirme a nova senha">
      </div>
    `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Alterar',
      allowOutsideClick: false,
      preConfirm: () => {
        const currentPassword = (document.getElementById('currentPassword') as HTMLInputElement).value;
        const newPassword = (document.getElementById('newPassword') as HTMLInputElement).value;
        const confirmNewPassword = (document.getElementById('confirmNewPassword') as HTMLInputElement).value;

        if (!currentPassword || !newPassword || !confirmNewPassword) {
          Swal.showValidationMessage('Todos os campos são obrigatórios');
          return false;
        }

        if (loggedUser.password !== currentPassword) {
          Swal.showValidationMessage('A senha original está incorreta');
          return false;
        }

        if (newPassword !== confirmNewPassword) {
          Swal.showValidationMessage('As novas senhas não coincidem');
          return false;
        }

        loggedUser.password = newPassword;
        localStorage.setItem('loggedUser', JSON.stringify(loggedUser));

        const userIndex = storedUsers.findIndex((user: any) => user.email === loggedUser.email);
        if (userIndex !== -1) {
          storedUsers[userIndex].password = newPassword;
          localStorage.setItem('users', JSON.stringify(storedUsers));
        }

        return true;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Senha Atualizada!', 'Sua senha foi atualizada com sucesso.', 'success');
      }
    });
  }

  logout() {
    localStorage.removeItem('loggedUser');
    this.router.navigate(['/login']);
  }


}
