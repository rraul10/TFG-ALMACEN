import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule ],
  template: `
    <div class="forgot-layout">
      <!-- Logo/Back -->
      <div class="top-bar">
        <a class="back-link" routerLink="/login">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Volver al login
        </a>
      </div>

      <!-- Card -->
      <div class="forgot-card">
        <div class="card-header">
          <div class="icon-wrapper">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h1>¿Olvidaste tu contraseña?</h1>
          <p>No te preocupes, te enviaremos instrucciones para restablecerla.</p>
        </div>

        <form [formGroup]="forgotForm" (ngSubmit)="onSubmit()" class="forgot-form">
          <div class="form-group">
            <label for="email">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              Correo electrónico
            </label>
            <input 
              type="email" 
              id="email" 
              formControlName="email" 
              placeholder="tu@email.com"
              [class.error-input]="forgotForm.get('email')?.invalid && forgotForm.get('email')?.touched"
            />
            <span class="error-text" *ngIf="forgotForm.get('email')?.invalid && forgotForm.get('email')?.touched">
              Introduce un correo válido
            </span>
          </div>

          <button type="submit" class="btn-primary" [disabled]="forgotForm.invalid || loading">
            <span *ngIf="!loading">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
              Enviar instrucciones
            </span>
            <span *ngIf="loading" class="loading-spinner"></span>
          </button>
        </form>

        <!-- Messages -->
        <div *ngIf="message" class="alert success">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          {{ message }}
        </div>

        <div *ngIf="error" class="alert error">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          {{ error }}
        </div>

        <div class="card-footer">
          <p>¿Recordaste tu contraseña? <a routerLink="/login">Inicia sesión</a></p>
        </div>
      </div>

      <!-- Particles -->
      <div class="particles-bg">
        <div class="particle" *ngFor="let p of particles" [style.left.%]="p.x" [style.animationDelay]="p.delay" [style.animationDuration]="p.duration"></div>
      </div>
    </div>
  `,
  styles: [`
:host { --primary: #6366f1; --primary-dark: #4f46e5; --accent: #06b6d4; --bg-dark: #0f172a; --bg-card: #1e293b; --text: #f8fafc; --text-muted: #94a3b8; --border: rgba(255,255,255,0.1); --success: #10b981; --danger: #ef4444; }

.forgot-layout { min-height: 100vh; background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; font-family: 'Inter', -apple-system, sans-serif; position: relative; overflow: hidden; }

/* Top Bar */
.top-bar { position: absolute; top: 2rem; left: 2rem; z-index: 10; }
.back-link { display: flex; align-items: center; gap: 0.5rem; color: var(--text-muted); text-decoration: none; font-size: 0.9rem; font-weight: 500; transition: all 0.3s; }
.back-link:hover { color: var(--text); transform: translateX(-4px); }

/* Card */
.forgot-card { background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(20px); border: 1px solid var(--border); border-radius: 24px; padding: 2.5rem; width: 100%; max-width: 420px; box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4); position: relative; z-index: 1; animation: fadeInUp 0.6s ease; }

@keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

/* Header */
.card-header { text-align: center; margin-bottom: 2rem; }
.icon-wrapper { width: 70px; height: 70px; background: linear-gradient(135deg, var(--primary), var(--accent)); border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem; color: white; box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4); }
.card-header h1 { font-size: 1.5rem; font-weight: 700; color: var(--text); margin: 0 0 0.5rem; }
.card-header p { font-size: 0.9rem; color: var(--text-muted); margin: 0; line-height: 1.5; }

/* Form */
.forgot-form { display: flex; flex-direction: column; gap: 1.5rem; }
.form-group { display: flex; flex-direction: column; gap: 0.5rem; }
.form-group label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
.form-group label svg { color: var(--primary); }

.form-group input { padding: 0.9rem 1rem; background: rgba(15, 23, 42, 0.6); border: 1px solid var(--border); border-radius: 12px; font-size: 1rem; color: var(--text); transition: all 0.3s; }
.form-group input::placeholder { color: rgba(148, 163, 184, 0.5); }
.form-group input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15); background: rgba(15, 23, 42, 0.8); }
.form-group input.error-input { border-color: var(--danger); background: rgba(239, 68, 68, 0.1); }

.error-text { font-size: 0.8rem; color: var(--danger); }

/* Button */
.btn-primary { display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 1rem; background: linear-gradient(135deg, var(--primary), var(--accent)); border: none; border-radius: 12px; color: white; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4); }
.btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(99, 102, 241, 0.5); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

.loading-spinner { width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Alerts */
.alert { display: flex; align-items: center; gap: 0.75rem; padding: 1rem; border-radius: 12px; font-size: 0.9rem; font-weight: 500; margin-top: 1.5rem; animation: slideIn 0.3s ease; }
@keyframes slideIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

.alert.success { background: rgba(16, 185, 129, 0.15); color: var(--success); border: 1px solid rgba(16, 185, 129, 0.3); }
.alert.error { background: rgba(239, 68, 68, 0.15); color: var(--danger); border: 1px solid rgba(239, 68, 68, 0.3); }

/* Footer */
.card-footer { text-align: center; margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--border); }
.card-footer p { font-size: 0.9rem; color: var(--text-muted); margin: 0; }
.card-footer a { color: var(--primary); text-decoration: none; font-weight: 600; transition: color 0.3s; }
.card-footer a:hover { color: var(--accent); }

/* Particles */
.particles-bg { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
.particle { position: absolute; width: 3px; height: 3px; background: rgba(99, 102, 241, 0.4); border-radius: 50%; animation: rise 20s infinite ease-in-out; }
@keyframes rise { 0%, 100% { transform: translateY(100vh) scale(0); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translateY(-10vh) scale(1); opacity: 0; } }

/* Responsive */
@media (max-width: 480px) {
  .forgot-layout { padding: 1rem; }
  .forgot-card { padding: 2rem 1.5rem; border-radius: 20px; }
  .top-bar { top: 1rem; left: 1rem; }
  .card-header h1 { font-size: 1.25rem; }
  .icon-wrapper { width: 60px; height: 60px; }
}
  `]
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  message = '';
  error = '';
  loading = false;

  particles = Array.from({ length: 25 }, () => ({ x: Math.random() * 100, delay: `${Math.random() * 20}s`, duration: `${15 + Math.random() * 10}s` }));

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotForm.invalid) return;

    this.loading = true;
    this.message = '';
    this.error = '';

    const email = this.forgotForm.value.email;
    this.http.post<any>('http://localhost:8080/auth/forgot-password', { email }).subscribe({
      next: () => {
        this.loading = false;
        this.message = '✉️ Correo enviado. Revisa tu bandeja de entrada.';
        this.error = '';
      },
      error: () => {
        this.loading = true;
        this.error = 'Error al enviar correo. Intenta de nuevo.';
        this.message = '';
      }
    });
  }
}