import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="login-page">
      <div class="login-card">
        <h2>Iniciar sesión</h2>

        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="form-group">
            <label for="correo">Correo electrónico</label>
            <input 
              id="correo"
              type="email" 
              name="correo" 
              [(ngModel)]="correo" 
              placeholder="ejemplo@correo.com"
              required>
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>
            <input 
              id="password"
              type="password" 
              name="password" 
              [(ngModel)]="password" 
              placeholder="Tu contraseña"
              required>
          </div>

          <button type="submit" [disabled]="loginForm.invalid">Entrar</button>
        </form>

        <p class="message">{{ message }}</p>
        <p class="register-link">
          ¿No tienes cuenta? <a routerLink="/register">Regístrate</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #f5f7fa;
      font-family: 'Segoe UI', Roboto, sans-serif;
    }

    .login-card {
      background-color: #ffffff;
      padding: 3rem 2.5rem;
      border-radius: 12px;
      box-shadow: 0 6px 18px rgba(0,0,0,0.12);
      width: 100%;
      max-width: 400px;
      text-align: center;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .login-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 24px rgba(0,0,0,0.16);
    }

    .login-card h2 {
      margin-bottom: 2rem;
      color: #1f2937;
      font-weight: 600;
      font-size: 1.6rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
      text-align: left;
    }

    label {
      display: block;
      font-size: 0.95rem;
      color: #374151;
      margin-bottom: 0.4rem;
    }

    input {
      width: 100%;
      padding: 0.65rem 0.8rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 1rem;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    input:focus {
      border-color: #2563eb;
      box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
      outline: none;
    }

    button {
      width: 100%;
      padding: 0.75rem;
      background-color: #2563eb;
      color: white;
      font-size: 1rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.3s, box-shadow 0.2s;
    }

    button:hover {
      background-color: #1e40af;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    button:disabled {
      background-color: #9ca3af;
      cursor: not-allowed;
    }

    .message {
      margin-top: 1rem;
      color: #ef4444; /* rojo suave para errores */
    }

    .register-link {
      margin-top: 1rem;
      font-size: 0.9rem;
      color: #374151;
    }

    .register-link a {
      color: #2563eb;
      text-decoration: none;
      font-weight: 500;
    }

    .register-link a:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  correo = '';
  password = '';
  message = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
  this.message = 'Iniciando sesión...';

  this.authService.login({ correo: this.correo, password: this.password }).subscribe({
    next: (res: any) => {
      localStorage.setItem('token', res.token);

      localStorage.setItem('user', JSON.stringify(res.user));

      this.message = 'Inicio de sesión correcto. Redirigiendo...';

      setTimeout(() => this.router.navigate(['/dashboard']), 1000);
    },
    error: () => {
      this.message = '❌ Usuario o contraseña incorrectos';
    }
  });
}
}


