import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Tarefa } from '../../shared/models/tarefa.interface';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastrar',
  templateUrl: './cadastrar.component.html',
  styleUrls: ['./cadastrar.component.css']
})

export class CadastrarComponent implements OnInit, AfterViewInit {

  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;
  hideConfirmPassword = true;


  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.loginForm = this.fb.group({
      name_user: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit() { }

  ngAfterViewInit() {
    this.cdr.detectChanges();
    setTimeout(() => {
    }, 0);
  }

  backLogin() {
    this.router.navigate(['/login']);
  }

  resetPassword() {
    this.snackBar.open('Um e-mail de recuperação foi enviado', 'Fechar', {
      duration: 3000
    });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    } else {
      formGroup.get('confirmPassword')?.setErrors(null);
    }

    return null;
  }

  Cadastrar() {
    if (this.loginForm.valid) {
      const userEmail = this.loginForm.value.email;
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');

      const emailAlreadyExists = existingUsers.some((user: any) => user.email === userEmail);

      if (emailAlreadyExists) {
        Swal.fire({
          icon: 'error',
          title: 'E-mail já cadastrado',
          text: 'Este e-mail já está em uso. Por favor, use outro ou faça login.',
          confirmButtonText: 'Entendi'
        });
        return;
      }

      const userId = 'user_' + Date.now() + '_' + Math.floor(Math.random() * 1000);

      const userData = {
        id: userId,
        name_user: this.loginForm.value.name_user,
        email: userEmail,
        password: this.loginForm.value.password
      };

      existingUsers.push(userData);
      localStorage.setItem('users', JSON.stringify(existingUsers));

      Swal.fire({
        title: 'Carregando...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      setTimeout(() => {
        Swal.close();
        Swal.fire({
          icon: 'success',
          title: 'Cadastro realizado!',
          text: 'Você será redirecionado para o login',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/login']);
        });
      }, 2000);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Formulário inválido',
        text: 'Preencha todos os campos corretamente',
        confirmButtonText: 'OK'
      });
    }
  }

}
