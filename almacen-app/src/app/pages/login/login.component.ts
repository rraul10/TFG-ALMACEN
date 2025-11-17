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
      <div class="background-pattern"></div>
      
      <div class="login-card">
        <!-- Logo/Icono del almacén -->
        <div class="logo-container">
          <svg class="warehouse-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9 22V12H15V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>

        <h2>Bienvenido</h2>
        <p class="subtitle">Sistema de Gestión de Almacén</p>

        <form (ngSubmit)="onSubmit()" #loginForm="ngForm" class="login-form">
          <div class="form-group">
            <label for="correo">Correo electrónico</label>
            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor"/>
              </svg>
              <input 
                id="correo"
                type="email" 
                name="correo" 
                [(ngModel)]="correo" 
                placeholder="usuario@empresa.com"
                required
                autocomplete="email">
            </div>
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>
            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8Z" fill="currentColor"/>
              </svg>
              <input 
                id="password"
                type="password" 
                name="password" 
                [(ngModel)]="password" 
                placeholder="••••••••"
                required
                autocomplete="current-password">
            </div>
          </div>

          <button type="submit" [disabled]="loginForm.invalid" class="submit-btn">
            <span *ngIf="!message.includes('Iniciando')">Iniciar Sesión</span>
            <span *ngIf="message.includes('Iniciando')" class="loading">
              <span class="spinner"></span>
              Iniciando...
            </span>
          </button>

          <div *ngIf="message && !message.includes('Iniciando')" 
               [class]="message.includes('❌') ? 'message error' : 'message success'">
            {{ message }}
          </div>
        </form>

        <div class="register-section">
          <p>¿No tienes una cuenta? <a routerLink="/register" class="register-link">Regístrate</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    .login-page {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      font-family: 'Inter', 'Segoe UI', Roboto, sans-serif;
      position: relative;
      padding: 20px;
    }

    .background-pattern {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: 
        repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.05) 35px, rgba(255,255,255,.05) 70px);
      opacity: 0.3;
    }

    .login-card {
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      padding: 50px 45px;
      width: 100%;
      max-width: 440px;
      position: relative;
      z-index: 1;
      animation: fadeInUp 0.6s ease-out;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .logo-container {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 25px;
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
    }

    .warehouse-icon {
      width: 45px;
      height: 45px;
      color: white;
    }

    h2 {
      text-align: center;
      font-size: 2rem;
      color: #1e293b;
      margin-bottom: 8px;
      font-weight: 700;
    }

    .subtitle {
      text-align: center;
      color: #64748b;
      font-size: 0.95rem;
      margin-bottom: 35px;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 22px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-group label {
      font-size: 0.9rem;
      font-weight: 600;
      color: #334155;
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-icon {
      position: absolute;
      left: 16px;
      width: 20px;
      height: 20px;
      color: #94a3b8;
      pointer-events: none;
    }

    .input-wrapper input {
      width: 100%;
      padding: 14px 16px 14px 48px;
      border: 2px solid #e2e8f0;
      border-radius: 10px;
      font-size: 1rem;
      transition: all 0.3s ease;
      background: #f8fafc;
    }

    .input-wrapper input:focus {
      outline: none;
      border-color: #667eea;
      background: white;
      box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    }

    .input-wrapper input:focus + .input-icon,
    .input-wrapper:focus-within .input-icon {
      color: #667eea;
    }

    .submit-btn {
      margin-top: 10px;
      padding: 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }

    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }

    .submit-btn:active:not(:disabled) {
      transform: translateY(0);
    }

    .submit-btn:disabled {
      background: #94a3b8;
      cursor: not-allowed;
      box-shadow: none;
    }

    .loading {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .message {
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 0.9rem;
      text-align: center;
      font-weight: 500;
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .message.error {
      background: #fee2e2;
      color: #dc2626;
      border: 1px solid #fecaca;
    }

    .message.success {
      background: #d1fae5;
      color: #059669;
      border: 1px solid #a7f3d0;
    }

    .register-section {
      text-align: center;
      margin-top: 30px;
      padding-top: 25px;
      border-top: 1px solid #e2e8f0;
    }

    .register-section p {
      color: #64748b;
      font-size: 0.9rem;
    }

    .register-link {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.2s;
    }

    .register-link:hover {
      color: #764ba2;
      text-decoration: underline;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .login-card {
        padding: 40px 30px;
        border-radius: 16px;
      }

      h2 {
        font-size: 1.75rem;
      }

      .logo-container {
        width: 70px;
        height: 70px;
      }

      .warehouse-icon {
        width: 40px;
        height: 40px;
      }
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
        this.message = '✓ Inicio de sesión correcto. Redirigiendo...';
        setTimeout(() => this.router.navigate(['/dashboard']), 1000);
      },
      error: () => {
        this.message = '❌ Usuario o contraseña incorrectos';
      }
    });
  }
}