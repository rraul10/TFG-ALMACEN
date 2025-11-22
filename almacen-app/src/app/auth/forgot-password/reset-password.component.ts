import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  template: `
    <div class="reset-layout">
      <!-- Top Bar -->
      <div class="top-bar">
        <a class="back-link" routerLink="/login">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Volver al login
        </a>
      </div>

      <!-- Card -->
      <div class="reset-card">
        <div class="card-header">
          <div class="icon-wrapper">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <h1>Nueva contraseña</h1>
          <p>Introduce tu nueva contraseña para restablecer el acceso a tu cuenta.</p>
        </div>

        <form [formGroup]="resetForm" (ngSubmit)="onSubmit()" class="reset-form">
          <div class="form-group">
            <label for="newPassword">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Nueva contraseña
            </label>
            <div class="input-wrapper">
              <input 
                [type]="showPassword ? 'text' : 'password'" 
                id="newPassword" 
                formControlName="newPassword" 
                placeholder="Mínimo 6 caracteres"
                [class.error-input]="resetForm.get('newPassword')?.invalid && resetForm.get('newPassword')?.touched"
              />
              <button type="button" class="toggle-password" (click)="showPassword = !showPassword">
                <svg *ngIf="!showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <svg *ngIf="showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              </button>
            </div>
            <span class="error-text" *ngIf="resetForm.get('newPassword')?.errors?.['required'] && resetForm.get('newPassword')?.touched">
              La contraseña es obligatoria
            </span>
            <span class="error-text" *ngIf="resetForm.get('newPassword')?.errors?.['minlength'] && resetForm.get('newPassword')?.touched">
              Mínimo 6 caracteres
            </span>
          </div>

          <!-- Password Strength -->
          <div class="password-strength" *ngIf="resetForm.get('newPassword')?.value">
            <div class="strength-bar">
              <div class="strength-fill" [style.width.%]="passwordStrength" [attr.data-strength]="strengthLabel"></div>
            </div>
            <span class="strength-label" [attr.data-strength]="strengthLabel">{{ strengthLabel }}</span>
          </div>

          <button type="submit" class="btn-primary" [disabled]="resetForm.invalid || loading">
            <span *ngIf="!loading">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
              Actualizar contraseña
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
          <div class="alert-content">
            <span>{{ message }}</span>
            <a routerLink="/login" class="alert-link">Ir al login →</a>
          </div>
        </div>

        <div *ngIf="error" class="alert error">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          {{ error }}
        </div>

        <!-- Token Error -->
        <div *ngIf="!token" class="alert warning">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          Token no válido. Solicita un nuevo enlace.
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
:host { --primary: #6366f1; --primary-dark: #4f46e5; --accent: #06b6d4; --bg-dark: #0f172a; --bg-card: #1e293b; --text: #f8fafc; --text-muted: #94a3b8; --border: rgba(255,255,255,0.1); --success: #10b981; --danger: #ef4444; --warning: #f59e0b; }

.reset-layout { min-height: 100vh; background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; font-family: 'Inter', -apple-system, sans-serif; position: relative; overflow: hidden; }

/* Top Bar */
.top-bar { position: absolute; top: 2rem; left: 2rem; z-index: 10; }
.back-link { display: flex; align-items: center; gap: 0.5rem; color: var(--text-muted); text-decoration: none; font-size: 0.9rem; font-weight: 500; transition: all 0.3s; }
.back-link:hover { color: var(--text); transform: translateX(-4px); }

/* Card */
.reset-card { background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(20px); border: 1px solid var(--border); border-radius: 24px; padding: 2.5rem; width: 100%; max-width: 420px; box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4); position: relative; z-index: 1; animation: fadeInUp 0.6s ease; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

/* Header */
.card-header { text-align: center; margin-bottom: 2rem; }
.icon-wrapper { width: 70px; height: 70px; background: linear-gradient(135deg, var(--success), var(--accent)); border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem; color: white; box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4); }
.card-header h1 { font-size: 1.5rem; font-weight: 700; color: var(--text); margin: 0 0 0.5rem; }
.card-header p { font-size: 0.9rem; color: var(--text-muted); margin: 0; line-height: 1.5; }

/* Form */
.reset-form { display: flex; flex-direction: column; gap: 1.25rem; }
.form-group { display: flex; flex-direction: column; gap: 0.5rem; }
.form-group label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
.form-group label svg { color: var(--primary); }

.input-wrapper { position: relative; }
.input-wrapper input { width: 85%; padding: 0.9rem 3rem 0.9rem 1rem; background: rgba(15, 23, 42, 0.6); border: 1px solid var(--border); border-radius: 12px; font-size: 1rem; color: var(--text); transition: all 0.3s; }
.input-wrapper input::placeholder { color: rgba(148, 163, 184, 0.5); }
.input-wrapper input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15); background: rgba(15, 23, 42, 0.8); }
.input-wrapper input.error-input { border-color: var(--danger); background: rgba(239, 68, 68, 0.1); }

.toggle-password { position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 0.25rem; transition: color 0.3s; }
.toggle-password:hover { color: var(--text); }

.error-text { font-size: 0.8rem; color: var(--danger); }

/* Password Strength */
.password-strength { display: flex; align-items: center; gap: 0.75rem; }
.strength-bar { flex: 1; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden; }
.strength-fill { height: 100%; border-radius: 3px; transition: all 0.3s; }
.strength-fill[data-strength="Débil"] { background: var(--danger); }
.strength-fill[data-strength="Media"] { background: var(--warning); }
.strength-fill[data-strength="Fuerte"] { background: var(--success); }
.strength-label { font-size: 0.75rem; font-weight: 600; min-width: 50px; }
.strength-label[data-strength="Débil"] { color: var(--danger); }
.strength-label[data-strength="Media"] { color: var(--warning); }
.strength-label[data-strength="Fuerte"] { color: var(--success); }

/* Button */
.btn-primary { display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 1rem; background: linear-gradient(135deg, var(--primary), var(--accent)); border: none; border-radius: 12px; color: white; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4); margin-top: 0.5rem; }
.btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(99, 102, 241, 0.5); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

.loading-spinner { width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Alerts */
.alert { display: flex; align-items: flex-start; gap: 0.75rem; padding: 1rem; border-radius: 12px; font-size: 0.9rem; font-weight: 500; margin-top: 1.5rem; animation: slideIn 0.3s ease; }
@keyframes slideIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
.alert svg { flex-shrink: 0; margin-top: 2px; }
.alert-content { display: flex; flex-direction: column; gap: 0.5rem; }
.alert-link { color: inherit; font-weight: 600; text-decoration: underline; }

.alert.success { background: rgba(16, 185, 129, 0.15); color: var(--success); border: 1px solid rgba(16, 185, 129, 0.3); }
.alert.error { background: rgba(239, 68, 68, 0.15); color: var(--danger); border: 1px solid rgba(239, 68, 68, 0.3); }
.alert.warning { background: rgba(245, 158, 11, 0.15); color: var(--warning); border: 1px solid rgba(245, 158, 11, 0.3); }

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
  .reset-layout { padding: 1rem; }
  .reset-card { padding: 2rem 1.5rem; border-radius: 20px; }
  .top-bar { top: 1rem; left: 1rem; }
  .card-header h1 { font-size: 1.25rem; }
  .icon-wrapper { width: 60px; height: 60px; }
}
  `]
})
export class ResetPasswordComponent {
  resetForm: FormGroup;
  message = '';
  error = '';
  token = '';
  loading = false;
  showPassword = false;

  particles = Array.from({ length: 25 }, () => ({ x: Math.random() * 100, delay: `${Math.random() * 20}s`, duration: `${15 + Math.random() * 10}s` }));

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private http: HttpClient, private router: Router) {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.route.queryParams.subscribe(params => { this.token = params['token'] || ''; });
  }

  get passwordStrength(): number {
    const pwd = this.resetForm.get('newPassword')?.value || '';
    let strength = 0;
    if (pwd.length >= 6) strength += 33;
    if (pwd.length >= 8 && /[A-Z]/.test(pwd)) strength += 33;
    if (/[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) strength += 34;
    return strength;
  }

  get strengthLabel(): string {
    const s = this.passwordStrength;
    if (s <= 33) return 'Débil';
    if (s <= 66) return 'Media';
    return 'Fuerte';
  }

  onSubmit() {
    if (this.resetForm.invalid || !this.token) return;

    this.loading = true;
    this.message = '';
    this.error = '';

    const newPassword = this.resetForm.value.newPassword;
    this.http.post('http://localhost:8080/auth/reset-password', { token: this.token, newPassword }, { responseType: 'text' }).subscribe({
      next: (res) => { this.loading = false; this.message = '✅ Contraseña actualizada correctamente.'; this.error = ''; },
      error: (err) => { this.loading = false; this.error = 'Error al actualizar la contraseña.'; this.message = ''; console.error(err); }
    });
  }
}