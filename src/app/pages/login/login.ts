
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  private servicio = inject(Auth);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  loading = signal(false);
  error = signal('');

  formulario = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  iniciarSesion(): void {

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const { username, password } = this.formulario.getRawValue();

    this.loading.set(true);
    this.error.set('');

    this.servicio.login(username, password).subscribe({
    
next: () => {
  this.loading.set(false);
  console.log('Inicio de sesión correcto');

  if (this.servicio.isAdmin()) {
    this.router.navigate(['/panel']);
  } else {
    this.router.navigate(['/productos']);
  }
},


      error: (error: HttpErrorResponse) => {
        this.loading.set(false);

        console.error('Error al iniciar sesión:', error);
        console.log('Código del error:', error.status);

        if (error.status === 401) {
          this.error.set('Usuario o contraseña incorrectos');
        } else if (error.status === 0) {
          this.error.set('Error de conexión con la API');
        } else {
          this.error.set('Error del servidor: ' + error.status);
        }
      }
    });
  }
}


