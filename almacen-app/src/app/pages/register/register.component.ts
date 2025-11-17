import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="register-page">
      <div class="background-pattern"></div>
      
      <div class="register-card">
        <!-- Logo/Icono del almacén -->
        <div class="logo-container">
          <svg class="warehouse-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9 22V12H15V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>

        <h2>Crear cuenta</h2>
        <p class="subtitle">Formulario de registro.</p>

        <form (ngSubmit)="onSubmit()" #registerForm="ngForm" novalidate class="register-form">
          
          <!-- Nombre -->
          <div class="form-group">
            <label for="nombre">Nombre completo</label>
            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <input
                id="nombre"
                type="text"
                name="nombre"
                [(ngModel)]="nombre"
                placeholder="Ej: Juan"
                required
                pattern="^[a-zA-ZÁÉÍÓÚáéíóúÑñ ]+$">
            </div>
            <div class="error" *ngIf="registerForm.submitted && (!nombre || !registerForm.controls['nombre']?.valid)">
              El nombre solo puede contener letras
            </div>
          </div>

          <!-- Apellidos -->
          <div class="form-group">
            <label for="apellidos">Apellidos</label>
            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <input
                id="apellidos"
                type="text"
                name="apellidos"
                [(ngModel)]="apellidos"
                placeholder="Ej: García López"
                required
                pattern="^[a-zA-ZÁÉÍÓÚáéíóúÑñ ]+$">
            </div>
            <div class="error" *ngIf="registerForm.submitted && (!apellidos || !registerForm.controls['apellidos']?.valid)">
              Los apellidos solo pueden contener letras
            </div>
          </div>

          <!-- Correo -->
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
                pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.com$">
            </div>
            <div class="error" *ngIf="registerForm.submitted && (!correo || !registerForm.controls['correo']?.valid)">
              Ingresa un correo válido que termine en .com
            </div>
          </div>

          <!-- Teléfono -->
          <div class="form-group">
            <label for="telefono">Teléfono</label>
            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 16.92V19.92C22 20.4696 21.5523 20.9204 21.0034 20.9931C20.3657 21.0753 19.7749 21.12 19.24 21.12C10.4486 21.12 3.32001 13.9914 3.32001 5.2C3.32001 4.66506 3.36472 4.07427 3.44694 3.43658C3.51964 2.88774 3.97046 2.44 4.52001 2.44H7.52001C7.77615 2.44 7.99177 2.62835 8.03515 2.88074C8.07154 3.09498 8.10458 3.27782 8.13514 3.43658C8.34471 4.62784 8.71401 5.76806 9.23478 6.83726C9.35808 7.09362 9.27866 7.40156 9.04652 7.5701L7.44001 8.68C8.88001 11.68 11.32 14.12 14.32 15.56L15.4295 13.9535C15.5151 13.8279 15.6447 13.7402 15.7918 13.7088C15.9388 13.6773 16.0923 13.7043 16.2205 13.7839C17.2897 14.3047 18.4299 14.6741 19.6212 14.8836C19.78 14.9142 19.9628 14.9473 20.177 14.9836C20.4294 15.027 20.6178 15.2426 20.6178 15.4988V16.92H22Z" fill="currentColor"/>
              </svg>
              <input
                id="telefono"
                type="tel"
                name="telefono"
                [(ngModel)]="telefono"
                placeholder="123456789"
                required
                pattern="^[0-9]{9}$">
            </div>
            <div class="error" *ngIf="registerForm.submitted && (!telefono || !registerForm.controls['telefono']?.valid)">
              Ingresa un teléfono válido de 9 dígitos
            </div>
          </div>

          <!-- Ciudad -->
          <div class="form-group">
            <label for="ciudad">Ciudad</label>
            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <input
                id="ciudad"
                type="text"
                name="ciudad"
                [(ngModel)]="ciudad"
                placeholder="Ej: Madrid"
                required>
            </div>
            <div class="error" *ngIf="registerForm.submitted && !ciudad">
              La ciudad es obligatoria
            </div>
          </div>

          <!-- Contraseña -->
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
                placeholder="Mínimo 6 caracteres"
                required
                minlength="6">
            </div>
            <div class="error" *ngIf="registerForm.submitted && (!password || password.length < 6)">
              La contraseña debe tener al menos 6 caracteres
            </div>
          </div>

          <button type="submit" [disabled]="registerForm.invalid" class="submit-btn">
            <span *ngIf="!message.includes('Intentando')">Crear cuenta</span>
            <span *ngIf="message.includes('Intentando')" class="loading">
              <span class="spinner"></span>
              Registrando...
            </span>
          </button>

          <div *ngIf="message && !message.includes('Intentando')" 
               [class]="message.includes('Error') || message.includes('error') ? 'message error' : 'message success'">
            {{ message }}
          </div>
        </form>

        <div class="login-section">
          <p>¿Ya tienes una cuenta? <a routerLink="login" class="login-link">Inicia sesión</a></p>
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

    .register-page {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      font-family: 'Inter', 'Segoe UI', Roboto, sans-serif;
      position: relative;
      padding: 40px 20px;
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

    .register-card {
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      padding: 40px 45px;
      width: 100%;
      max-width: 480px;
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
      width: 70px;
      height: 70px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
    }

    .warehouse-icon {
      width: 40px;
      height: 40px;
      color: white;
    }

    h2 {
      text-align: center;
      font-size: 1.8rem;
      color: #1e293b;
      margin-bottom: 6px;
      font-weight: 700;
    }

    .subtitle {
      text-align: center;
      color: #64748b;
      font-size: 0.9rem;
      margin-bottom: 30px;
    }

    .register-form {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-group label {
      font-size: 0.875rem;
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
      left: 14px;
      width: 18px;
      height: 18px;
      color: #94a3b8;
      pointer-events: none;
    }

    .input-wrapper input {
      width: 100%;
      padding: 12px 14px 12px 44px;
      border: 2px solid #e2e8f0;
      border-radius: 10px;
      font-size: 0.95rem;
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

    .error {
      color: #ef4444;
      font-size: 0.8rem;
      margin-top: 2px;
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-5px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .submit-btn {
      margin-top: 10px;
      padding: 14px;
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

    .login-section {
      text-align: center;
      margin-top: 25px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
    }

    .login-section p {
      color: #64748b;
      font-size: 0.9rem;
    }

    .login-link {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.2s;
    }

    .login-link:hover {
      color: #764ba2;
      text-decoration: underline;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .register-page {
        padding: 30px 15px;
      }

      .register-card {
        padding: 35px 30px;
        border-radius: 16px;
      }

      h2 {
        font-size: 1.6rem;
      }

      .logo-container {
        width: 60px;
        height: 60px;
      }

      .warehouse-icon {
        width: 35px;
        height: 35px;
      }

      .register-form {
        gap: 16px;
      }
    }
  `]
})
export class RegisterComponent {
  nombre = '';
  apellidos = '';
  correo = '';
  telefono = '';
  ciudad = '';
  password = '';
  message = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.message = 'Intentando registro...';

    const data = {
      nombre: this.nombre,
      apellidos: this.apellidos,
      correo: this.correo,
      telefono: this.telefono,
      ciudad: this.ciudad,
      password: this.password
    };

    this.authService.register(data).subscribe({
      next: () => {
        // Login automático tras registrarse
        this.authService.login({ correo: this.correo, password: this.password }).subscribe({
          next: (res: any) => {
            localStorage.setItem('token', res.token);
            localStorage.setItem('user', JSON.stringify(res.user));

            if (res.user.roles && res.user.roles.length > 0) {
              localStorage.setItem('rol', res.user.roles[0]);
            }

            this.message = '✓ Registro exitoso. Redirigiendo...';
            setTimeout(() => this.router.navigate(['/']), 1000);
          },
          error: (err: any) => {
            console.error('Error login automático:', err);
            this.message = 'Registro correcto, pero error en login automático';
            setTimeout(() => this.router.navigate(['/login']), 2000);
          }
        });
      },
      error: (err: any) => {
        console.error('Error en registro:', err);
        this.message = 'Error en registro. Verifica tus datos.';
      }
    });
  }
}