import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  template: `
    <div class="login-page">
      <!-- Imagen de fondo de almacén -->
      <div class="background-image"></div>
      <div class="background-overlay"></div>
      
      <!-- Panel izquierdo - Branding -->
      <div class="branding-panel">
        <div class="branding-content">
          <div class="logo-section">
            <div class="logo-badge">
              <svg class="warehouse-icon" viewBox="0 0 24 24" fill="none">
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 22V12H15V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h1>WareHouse Pro</h1>
            <p class="tagline">ElectroBase</p>
          </div>

          <div class="features">
            <div class="feature-item">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>Control de pedidos en tiempo real.</span>
            </div>
            <div class="feature-item">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>Pedidos entregados en menos de una semana.</span>
            </div>
            <div class="feature-item">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>En funcionamiento desde 2017.</span>
            </div>
          </div>

          <div class="stats">
            <div class="stat-box">
              <div class="stat-value">99.9%</div>
              <div class="stat-label">Disponibilidad</div>
            </div>
            <div class="stat-box">
              <div class="stat-value">24/7</div>
              <div class="stat-label">Soporte</div>
            </div>
            <div class="stat-box">
              <div class="stat-value">5000+</div>
              <div class="stat-label">Clientes</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Panel derecho - Login Form -->
      <div class="login-panel">
        <div class="login-card">
          <div class="card-header">
            <div class="access-badge">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"/>
              </svg>
            </div>
            <h2>Acceso al Almacén</h2>
            <p class="subtitle">Introduce tus credenciales para continuar</p>
          </div>

          <form (ngSubmit)="onSubmit()" #loginForm="ngForm" class="login-form">
            <div class="form-group">
              <label for="correo">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                Correo electrónico
              </label>
              <input 
                id="correo"
                type="email" 
                name="correo" 
                [(ngModel)]="correo" 
                placeholder="usuario@empresa.com"
                required
                autocomplete="email">
            </div>

            <div class="form-group">
              <label for="password">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                Contraseña
              </label>
              <input 
                id="password"
                type="password" 
                name="password" 
                [(ngModel)]="password" 
                placeholder="••••••••"
                required
                autocomplete="current-password">
            </div>

            <div class="form-options">
              <label class="remember-me">
                <input type="checkbox">
                <span>Recordar sesión</span>
              </label>
              <a href="#" class="forgot-link">¿Olvidaste tu contraseña?</a>
            </div>

            <button type="submit" [disabled]="loginForm.invalid" class="submit-btn">
              <span *ngIf="!message.includes('Iniciando')">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                </svg>
                Iniciar Sesión
              </span>
              <span *ngIf="message.includes('Iniciando')" class="loading">
                <span class="spinner"></span>
                Verificando acceso...
              </span>
            </button>

            <div *ngIf="message && !message.includes('Iniciando')" 
                 [class]="message.includes('❌') ? 'message error' : 'message success'">
              <svg *ngIf="message.includes('❌')" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <svg *ngIf="message.includes('✓')" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {{ message }}
            </div>
          </form>

          <div class="divider">
            <span>o</span>
          </div>

          <div class="register-section">
            <p>¿No tienes una cuenta?</p>
            <a routerLink="/register" class="register-link">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
              </svg>
              Crear cuenta nueva
            </a>
          </div>
        </div>

        <div class="security-badge">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
          <span>Conexión segura SSL</span>
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
      font-family: 'Inter', 'Segoe UI', Roboto, sans-serif;
      position: relative;
      overflow: hidden;
    }

    /* Background Image */
    .background-image {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: url('https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=2000');
      background-size: cover;
      background-position: center;
      filter: blur(3px);
      transform: scale(1.1);
    }

    .background-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%);
    }

    /* Branding Panel */
    .branding-panel {
      flex: 1;
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 60px;
      color: white;
    }

    .branding-content {
      max-width: 500px;
      animation: fadeInLeft 0.8s ease-out;
    }

    @keyframes fadeInLeft {
      from {
        opacity: 0;
        transform: translateX(-30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .logo-section {
      margin-bottom: 50px;
    }

    .logo-badge {
      width: 80px;
      height: 80px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      backdrop-filter: blur(10px);
      border: 2px solid rgba(255, 255, 255, 0.3);
    }

    .warehouse-icon {
      width: 45px;
      height: 45px;
      color: white;
    }

    .branding-content h1 {
      font-size: 3rem;
      font-weight: 800;
      margin-bottom: 10px;
      text-shadow: 2px 2px 20px rgba(0, 0, 0, 0.2);
    }

    .tagline {
      font-size: 1.2rem;
      opacity: 0.95;
      font-weight: 300;
    }

    .features {
      margin-bottom: 50px;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 15px 0;
      font-size: 1.05rem;
      opacity: 0.95;
    }

    .feature-item svg {
      width: 24px;
      height: 24px;
      flex-shrink: 0;
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }

    .stat-box {
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      padding: 20px;
      text-align: center;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 5px;
    }

    .stat-label {
      font-size: 0.85rem;
      opacity: 0.9;
    }

    /* Login Panel */
    .login-panel {
      width: 550px;
      background: white;
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 50px;
      box-shadow: -10px 0 50px rgba(0, 0, 0, 0.2);
    }

    .login-card {
      width: 100%;
      max-width: 450px;
      animation: fadeInRight 0.8s ease-out;
    }

    @keyframes fadeInRight {
      from {
        opacity: 0;
        transform: translateX(30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .card-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .access-badge {
      width: 70px;
      height: 70px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 25px;
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
    }

    .access-badge svg {
      width: 35px;
      height: 35px;
      color: white;
    }

    .card-header h2 {
      font-size: 2rem;
      color: #1e293b;
      margin-bottom: 8px;
      font-weight: 700;
    }

    .subtitle {
      color: #64748b;
      font-size: 0.95rem;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .form-group label {
      font-size: 0.9rem;
      font-weight: 600;
      color: #334155;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .form-group label svg {
      width: 18px;
      height: 18px;
      color: #667eea;
    }

    .form-group input {
      width: 100%;
      padding: 14px 18px;
      border: 2px solid #e2e8f0;
      border-radius: 10px;
      font-size: 1rem;
      transition: all 0.3s ease;
      background: #f8fafc;
    }

    .form-group input:focus {
      outline: none;
      border-color: #667eea;
      background: white;
      box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    }

    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: -10px;
    }

    .remember-me {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.9rem;
      color: #64748b;
      cursor: pointer;
    }

    .remember-me input {
      cursor: pointer;
    }

    .forgot-link {
      font-size: 0.9rem;
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
    }

    .forgot-link:hover {
      text-decoration: underline;
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
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }

    .submit-btn svg {
      width: 20px;
      height: 20px;
    }

    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 25px rgba(102, 126, 234, 0.5);
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
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .message {
      padding: 14px 16px;
      border-radius: 10px;
      font-size: 0.9rem;
      font-weight: 500;
      animation: slideIn 0.3s ease-out;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .message svg {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
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
      border: 2px solid #fecaca;
    }

    .message.success {
      background: #d1fae5;
      color: #059669;
      border: 2px solid #a7f3d0;
    }

    .divider {
      text-align: center;
      margin: 35px 0;
      position: relative;
    }

    .divider::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: #e2e8f0;
    }

    .divider span {
      position: relative;
      background: white;
      padding: 0 15px;
      color: #94a3b8;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .register-section {
      text-align: center;
    }

    .register-section p {
      color: #64748b;
      font-size: 0.95rem;
      margin-bottom: 15px;
    }

    .register-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
      font-size: 1rem;
      padding: 12px 24px;
      border: 2px solid #667eea;
      border-radius: 10px;
      transition: all 0.3s ease;
    }

    .register-link svg {
      width: 20px;
      height: 20px;
    }

    .register-link:hover {
      background: #667eea;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }

    .security-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 40px;
      padding: 12px 20px;
      background: #f1f5f9;
      border-radius: 50px;
      color: #64748b;
      font-size: 0.85rem;
      font-weight: 500;
    }

    .security-badge svg {
      width: 18px;
      height: 18px;
      color: #10b981;
    }

    /* Responsive */
    @media (max-width: 1200px) {
      .branding-panel {
        padding: 40px;
      }

      .branding-content h1 {
        font-size: 2.5rem;
      }

      .stats {
        grid-template-columns: repeat(3, 1fr);
        gap: 15px;
      }

      .stat-value {
        font-size: 1.5rem;
      }
    }

    @media (max-width: 968px) {
      .login-page {
        flex-direction: column;
      }

      .branding-panel {
        padding: 40px 30px;
        min-height: auto;
      }

      .branding-content {
        max-width: 100%;
      }

      .branding-content h1 {
        font-size: 2rem;
      }

      .features {
        margin-bottom: 30px;
      }

      .stats {
        grid-template-columns: repeat(3, 1fr);
      }

      .login-panel {
        width: 100%;
        padding: 40px 30px;
      }
    }

    @media (max-width: 640px) {
      .branding-panel {
        padding: 30px 20px;
      }

      .branding-content h1 {
        font-size: 1.75rem;
      }

      .tagline {
        font-size: 1rem;
      }

      .feature-item {
        font-size: 0.95rem;
        padding: 12px 0;
      }

      .stats {
        gap: 10px;
      }

      .stat-box {
        padding: 15px 10px;
      }

      .stat-value {
        font-size: 1.25rem;
      }

      .stat-label {
        font-size: 0.75rem;
      }

      .login-panel {
        padding: 30px 20px;
      }

      .card-header h2 {
        font-size: 1.5rem;
      }

      .access-badge {
        width: 60px;
        height: 60px;
      }

      .access-badge svg {
        width: 30px;
        height: 30px;
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
        this.message = '✓ Acceso concedido. Redirigiendo al sistema...';
        setTimeout(() => this.router.navigate(['/dashboard']), 1500);
      },
      error: () => {
        this.message = '❌ Credenciales incorrectas. Verifica tus datos e inténtalo de nuevo.';
      }
    });
  }
}