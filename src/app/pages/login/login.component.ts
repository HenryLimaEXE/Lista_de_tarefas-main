import { Component, OnInit } from '@angular/core';
import { Tarefa } from '../../shared/models/tarefa.interface';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() { }

  async navigateToRegister(event?: Event) {
    if (event) {
      event.preventDefault();
    }

    Swal.fire({
      title: 'Carregando...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    await new Promise(resolve => setTimeout(resolve, 1000));

    Swal.close();
    this.router.navigate(['/cadastrar']);
  }


  VerificarLogin() {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');

    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    if (storedUsers.length === 0) {
      this.snackBar.open('Nenhum usuário cadastrado encontrado', 'Fechar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const foundUser = storedUsers.find((user: any) => user.email === email);

    if (!foundUser) {
      this.snackBar.open('E-mail não cadastrado', 'Fechar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    if (foundUser.password === password) {
      this.snackBar.open('Login realizado com sucesso!', 'Fechar', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });

      localStorage.setItem('loggedUser', JSON.stringify({
        id: foundUser.id,
        name: foundUser.name_user,
        email: foundUser.email
      }));

      Swal.fire({
        title: 'Carregando...',
        text: 'Redirecionando para seus agendamentos',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      setTimeout(() => {
        Swal.close();
        this.router.navigate(['/lista-tarefas']);
      }, 1500);

    } else {
      this.snackBar.open('Senha incorreta', 'Fechar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }
}
