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
        <!-- Partículas de fondo -->
        <div class="particles">
          <div class="particle" *ngFor="let p of particles" 
              [style.left.%]="p.x" 
              [style.animation-delay]="p.delay"
              [style.animation-duration]="p.duration">
          </div>
        </div>

        <div class="login-container">
          <!-- Panel informativo -->
          <div class="info-panel">
            <div class="info-content">
              <div class="brand-header">
                <div class="brand-icon">⚡</div>
                <div>
                  <h1>Almacén Electrónico</h1>
                  <p class="brand-tagline">Tu tienda de tecnología de confianza</p>
                </div>
              </div>

              <div class="hero-text">
                <h2>Tecnología de última generación al mejor precio</h2>
                <p>Miles de productos, entregas rápidas y atención personalizada</p>
              </div>
              
              <div class="benefits-list">
                <div class="benefit-item">
                  <div class="benefit-icon">✓</div>
                  <div class="benefit-text">
                    <strong>Envío gratis</strong>
                    <span>en pedidos superiores a 50€</span>
                  </div>
                </div>
                
                <div class="benefit-item">
                  <div class="benefit-icon">✓</div>
                  <div class="benefit-text">
                    <strong>Entrega en 3-5 días</strong>
                    <span>a toda España</span>
                  </div>
                </div>
                
                <div class="benefit-item">
                  <div class="benefit-icon">✓</div>
                  <div class="benefit-text">
                    <strong>Garantía extendida</strong>
                    <span>en todos nuestros productos</span>
                  </div>
                </div>

                <div class="benefit-item">
                  <div class="benefit-icon">✓</div>
                  <div class="benefit-text">
                    <strong>Atención 24/7</strong>
                    <span>soporte técnico siempre disponible</span>
                  </div>
                </div>
              </div>

              <div class="trust-badges">
                <div class="badge-item">
                  <div class="badge-number">15K+</div>
                  <div class="badge-label">Clientes satisfechos</div>
                </div>
                <div class="badge-item">
                  <div class="badge-number">4.8★</div>
                  <div class="badge-label">Valoración media</div>
                </div>
                <div class="badge-item">
                  <div class="badge-number">8 años</div>
                  <div class="badge-label">En el mercado</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Panel de Login -->
          <div class="login-card">
            <div class="card-glow"></div>
            
            <div class="card-header">
              <h2>Iniciar Sesión</h2>
              <p class="subtitle">Accede a tu cuenta para continuar</p>
            </div>

            <form (ngSubmit)="onSubmit()" #loginForm="ngForm" class="login-form">
              <div class="form-group">
                <label for="correo">Correo Electrónico</label>
                <div class="input-wrapper">
                  <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                  </svg>
                  <input 
                    id="correo"
                    type="email" 
                    name="correo" 
                    [(ngModel)]="correo" 
                    placeholder="tu-correo@ejemplo.com"
                    required
                    autocomplete="email">
                </div>
              </div>

              <div class="form-group">
                <label for="password">Contraseña</label>
                <div class="input-wrapper">
                  <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
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

              <div class="form-options">
                <label class="remember-me">
                  <input type="checkbox">
                  <span>Recordar sesión</span>
                </label>
                <a href="#" class="forgot-link">¿Olvidaste tu contraseña?</a>
              </div>

              <button type="submit" [disabled]="loginForm.invalid" class="submit-btn">
                <span *ngIf="!message.includes('Iniciando')">
                  Iniciar Sesión
                </span>
                <span *ngIf="message.includes('Iniciando')" class="loading">
                  <span class="spinner"></span>
                  Verificando...
                </span>
              </button>

              <div *ngIf="message && !message.includes('Iniciando')" 
                  [class]="message.includes('❌') ? 'message error' : 'message success'">
                {{ message }}
              </div>
            </form>

            <div class="divider">
              <span>o</span>
            </div>

            <div class="register-section">
              <p>¿Nuevo por aquí?</p>
              <a routerLink="/register" class="register-link">Crear una cuenta</a>
            </div>

            <div class="security-note">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
              <span>Conexión segura</span>
            </div>
          </div>
        </div>
      </div>
    `,
    styles: [`
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      .login-page {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Segoe UI', Roboto, sans-serif;
        background: 
          linear-gradient(rgba(15, 23, 42, 0.92), rgba(15, 23, 42, 0.95)),
          url('https://images.unsplash.com/photo-1553413077-190dd305871c?w=1920&h=1080&fit=crop') center/cover fixed;
        position: relative;
        overflow: hidden;
        padding: 2rem;
      }

      /* PARTÍCULAS ANIMADAS */
      .particles {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
        opacity: 0.3;
      }

      .particle {
        position: absolute;
        width: 3px;
        height: 3px;
        background: rgba(102, 126, 234, 0.4);
        border-radius: 50%;
        animation: float 20s infinite ease-in-out;
        box-shadow: 0 0 8px rgba(102, 126, 234, 0.6);
      }

      @keyframes float {
        0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(-100vh) translateX(50px); opacity: 0; }
      }

      .login-container {
        display: grid;
        grid-template-columns: 1fr 500px;
        max-width: 1400px;
        width: 100%;
        gap: 3rem;
        position: relative;
        z-index: 1;
        animation: fadeIn 0.8s ease-out;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* CARD DE LOGIN */
      .login-card {
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(20px);
        border-radius: 24px;
        padding: 2.5rem;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.2);
        position: relative;
        overflow: hidden;
        animation: slideInRight 0.8s ease-out;
      }

      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(50px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      .card-glow {
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%);
        animation: rotate 20s linear infinite;
      }

      @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      .card-header {
        text-align: center;
        margin-bottom: 2rem;
        position: relative;
        z-index: 1;
      }

      .card-header h2 {
        font-size: 1.8rem;
        color: #1e293b;
        margin-bottom: 0.5rem;
        font-weight: 700;
      }

      .card-header .subtitle {
        color: #64748b;
        font-size: 0.95rem;
      }

      .login-form {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
        position: relative;
        z-index: 1;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .form-group label {
        font-size: 0.9rem;
        font-weight: 600;
        color: #334155;
      }

      .input-wrapper {
        position: relative;
      }

      .input-icon {
        position: absolute;
        left: 1rem;
        top: 50%;
        transform: translateY(-50%);
        width: 20px;
        height: 20px;
        color: #94a3b8;
        pointer-events: none;
      }

      .form-group input {
        width: 100%;
        padding: 0.95rem 1.2rem 0.95rem 3rem;
        border: 2px solid #e2e8f0;
        border-radius: 12px;
        font-size: 1rem;
        transition: all 0.3s ease;
        background: #f8fafc;
        color: #1e293b;
      }

      .form-group input::placeholder {
        color: #94a3b8;
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
        margin-top: -0.5rem;
      }

      .remember-me {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
        color: #64748b;
        cursor: pointer;
        user-select: none;
      }

      .remember-me input {
        cursor: pointer;
        width: 16px;
        height: 16px;
      }

      .forgot-link {
        font-size: 0.9rem;
        color: #667eea;
        text-decoration: none;
        font-weight: 600;
        transition: color 0.2s;
      }

      .forgot-link:hover {
        color: #764ba2;
        text-decoration: underline;
      }

      .submit-btn {
        margin-top: 0.5rem;
        padding: 1rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 12px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        position: relative;
        overflow: hidden;
      }

      .submit-btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
        transition: left 0.5s;
      }

      .submit-btn:hover:not(:disabled)::before {
        left: 100%;
      }

      .submit-btn svg {
        width: 20px;
        height: 20px;
      }

      .submit-btn:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 6px 25px rgba(102, 126, 234, 0.6);
      }

      .submit-btn:active:not(:disabled) {
        transform: translateY(0);
      }

      .submit-btn:disabled {
        background: linear-gradient(135deg, #94a3b8 0%, #cbd5e1 100%);
        cursor: not-allowed;
        box-shadow: none;
      }

      .loading {
        display: flex;
        align-items: center;
        gap: 0.75rem;
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
        padding: 1rem;
        border-radius: 12px;
        font-size: 0.9rem;
        font-weight: 500;
        animation: slideIn 0.3s ease-out;
        display: flex;
        align-items: center;
        gap: 0.75rem;
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
        margin: 2rem 0 1.5rem;
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
        background: rgba(255, 255, 255, 0.98);
        padding: 0 1rem;
        color: #94a3b8;
        font-size: 0.9rem;
        font-weight: 600;
      }

      .register-section {
        text-align: center;
      }

      .register-section p {
        color: #64748b;
        font-size: 0.95rem;
        margin-bottom: 1rem;
      }

      .register-link {
        display: inline-block;
        color: #667eea;
        text-decoration: none;
        font-weight: 600;
        font-size: 1rem;
        transition: color 0.2s;
      }

      .register-link:hover {
        color: #764ba2;
        text-decoration: underline;
      }

      .security-note {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        margin-top: 1.5rem;
        padding: 0.6rem;
        color: #10b981;
        font-size: 0.85rem;
        font-weight: 500;
      }

      .security-note svg {
        width: 16px;
        height: 16px;
      }

      /* PANEL INFORMATIVO */
      .info-panel {
        display: flex;
        align-items: center;
        position: relative;
        animation: slideInLeft 0.8s ease-out 0.2s both;
      }

      @keyframes slideInLeft {
        from {
          opacity: 0;
          transform: translateX(-50px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      .info-content {
        width: 100%;
      }

      .brand-header {
        display: flex;
        align-items: center;
        gap: 1.25rem;
        margin-bottom: 3rem;
      }

      .brand-icon {
        width: 70px;
        height: 70px;
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(10px);
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2.5rem;
        flex-shrink: 0;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      }

      .brand-header h1 {
        font-size: 2rem;
        color: white;
        margin: 0 0 0.25rem 0;
        font-weight: 800;
        text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
      }

      .brand-tagline {
        color: rgba(255, 255, 255, 0.9);
        font-size: 1rem;
        margin: 0;
        text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.3);
      }

      .hero-text {
        margin-bottom: 2.5rem;
      }

      .hero-text h2 {
        font-size: 2.25rem;
        color: white;
        margin-bottom: 1rem;
        font-weight: 800;
        line-height: 1.2;
        text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
      }

      .hero-text p {
        color: rgba(255, 255, 255, 0.9);
        font-size: 1.15rem;
        line-height: 1.6;
        text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.3);
      }

      .benefits-list {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
        margin-bottom: 3rem;
      }

      .benefit-item {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        padding: 1.25rem;
        transition: all 0.3s ease;
      }

      .benefit-item:hover {
        background: rgba(255, 255, 255, 0.15);
        transform: translateX(8px);
      }

      .benefit-icon {
        width: 32px;
        height: 32px;
        background: rgba(16, 185, 129, 0.2);
        border: 2px solid rgba(16, 185, 129, 0.4);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        color: #10b981;
        flex-shrink: 0;
        font-size: 1.1rem;
      }

      .benefit-text {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .benefit-text strong {
        color: white;
        font-size: 1.05rem;
        font-weight: 700;
      }

      .benefit-text span {
        color: rgba(255, 255, 255, 0.8);
        font-size: 0.9rem;
      }

      .trust-badges {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1.25rem;
      }

      .badge-item {
        text-align: center;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 14px;
        padding: 1.5rem 1rem;
      }

      .badge-number {
        font-size: 2rem;
        font-weight: 800;
        color: white;
        margin-bottom: 0.5rem;
        text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
      }

      .badge-label {
        color: rgba(255, 255, 255, 0.9);
        font-size: 0.9rem;
        font-weight: 500;
      }

      /* RESPONSIVE */
      @media (max-width: 1200px) {
        .login-container {
          grid-template-columns: 1fr 450px;
          gap: 2rem;
        }

        .hero-text h2 {
          font-size: 1.85rem;
        }

        .benefits-list {
          gap: 1rem;
        }

        .benefit-item {
          padding: 1rem;
        }
      }

      @media (max-width: 968px) {
        .login-page {
          padding: 1.5rem;
        }

        .login-container {
          grid-template-columns: 1fr;
          max-width: 500px;
        }

        .login-card {
          padding: 2rem;
          order: 1;
        }

        .info-panel {
          display: none;
        }
      }

      @media (max-width: 640px) {
        .login-page {
          padding: 1rem;
        }

        .login-card {
          padding: 1.5rem;
          border-radius: 20px;
        }

        .card-header h2 {
          font-size: 1.5rem;
        }

        .form-group input {
          padding: 0.85rem 1rem 0.85rem 2.75rem;
          font-size: 0.95rem;
        }

        .input-icon {
          width: 18px;
          height: 18px;
          left: 0.85rem;
        }

        .submit-btn {
          padding: 0.95rem;
          font-size: 0.95rem;
        }

        .form-options {
          flex-direction: column;
          align-items: flex-start;
          gap: 0.75rem;
        }
      }
    `]
  })
  export class LoginComponent {
    correo = '';
    password = '';
    message = '';

    // Partículas animadas
    particles = Array.from({ length: 50 }, (_, i) => ({
      x: Math.random() * 100,
      delay: `${Math.random() * 20}s`,
      duration: `${15 + Math.random() * 10}s`
    }));

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