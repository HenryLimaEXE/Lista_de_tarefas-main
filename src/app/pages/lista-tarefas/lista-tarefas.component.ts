import { Component, OnInit } from '@angular/core';
import { Tarefa } from '../../shared/models/tarefa.interface';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-lista-tarefas',
  templateUrl: './lista-tarefas.component.html',
  styleUrls: ['./lista-tarefas.component.css'],
    host: {
    class: 'src/app/app.component.css'
  }
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

  constructor(private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.loggedUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');
    this.userName = this.loggedUser.name || 'Usuário Desconhecido';
    this.carregarTarefas();
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
    this.novaTarefa = '';
    this.novaDataLimite = '';
    this.novaDescricao = '';
  }

  adicionarTarefa() {
    if (!this.novaTarefa.trim() || !this.novaDataLimite || !this.novaDescricao.trim()) {
      this.snackBar.open('Preencha todos os campos!', 'Fechar', { duration: 3000 });
      return;
    }

    const novaTarefa: Tarefa = {
      tarefa: this.novaTarefa,
      dataLimite: this.novaDataLimite,
      descricao: this.novaDescricao,
      concluida: false,
      status: 'pendente'
    };

    this.tarefas.push(novaTarefa);
    this.salvarTarefas();
    this.atualizarListas();

    // Limpar campos
    this.novaTarefa = '';
    this.novaDataLimite = '';
    this.novaDescricao = '';
  }

  async editarTarefa(index: number, lista: Tarefa[]) {
    const tarefa = lista[index];

    const { value: formValues } = await Swal.fire({
      title: 'Editar Tarefa',
      html:
        `<input id="tarefa" class="swal2-input" placeholder="Tarefa" value="${tarefa.tarefa}">
         <input id="data" class="swal2-input" type="date" value="${tarefa.dataLimite}">
         <textarea id="descricao" class="swal2-textarea" placeholder="Descrição">${tarefa.descricao}</textarea>`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Salvar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        return {
          tarefa: (document.getElementById('tarefa') as HTMLInputElement).value,
          dataLimite: (document.getElementById('data') as HTMLInputElement).value,
          descricao: (document.getElementById('descricao') as HTMLTextAreaElement).value
        };
      }
    });

    if (formValues) {
      tarefa.tarefa = formValues.tarefa;
      tarefa.dataLimite = formValues.dataLimite;
      tarefa.descricao = formValues.descricao;
      this.salvarTarefas();
      this.atualizarListas();
    }
  }

  excluirTarefa(index: number, lista: Tarefa[]) {
    Swal.fire({
      title: 'Tem certeza?',
      text: "Você não poderá reverter isso!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, excluir!'
    }).then((result) => {
      if (result.isConfirmed) {
        const tarefa = lista[index];
        this.tarefas = this.tarefas.filter(t => t !== tarefa);
        this.salvarTarefas();
        this.atualizarListas();
        Swal.fire('Excluído!', 'Sua tarefa foi excluída.', 'success');
      }
    });
  }

  atualizarListas() {
    this.tarefasPendentes = this.tarefas.filter(t => t.status === 'pendente');
    this.tarefasAFazer = this.tarefas.filter(t => t.status === 'fazendo');
    this.tarefasConcluidas = this.tarefas.filter(t => t.status === 'concluido');
  }

  alternarStatusTarefa(index: number, lista: Tarefa[]) {
    const tarefa = lista[index];
    tarefa.concluida = !tarefa.concluida;

    if (tarefa.concluida) {
      tarefa.status = 'concluido';
    } else {
      // Define um status padrão quando desmarca
      tarefa.status = lista === this.tarefasAFazer ? 'fazendo' : 'pendente';
    }

    this.salvarTarefas();
    this.atualizarListas();
  }

  moverParaFazendo(index: number, listaOrigem: Tarefa[]) {
    const tarefa = listaOrigem[index];
    tarefa.status = 'fazendo';
    this.salvarTarefas();
    this.atualizarListas();
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
