import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  template: `
    <div class="register-page">
      <!-- Partículas de fondo -->
      <div class="particles">
        <div class="particle" *ngFor="let p of particles" 
             [style.left.%]="p.x" 
             [style.animation-delay]="p.delay"
             [style.animation-duration]="p.duration">
        </div>
      </div>

      <div class="register-container">
        <!-- Panel informativo -->
        <div class="info-panel">
          <div class="info-content">
            <div class="brand-header">
              <div class="brand-icon">⚡</div>
              <div>
                <h1>TechStore</h1>
                <p class="brand-tagline">Tu tienda de tecnología de confianza</p>
              </div>
            </div>

            <div class="hero-text">
              <h2>Únete a nuestra comunidad tecnológica</h2>
              <p>Crea tu cuenta y accede a ofertas exclusivas, seguimiento de pedidos y mucho más</p>
            </div>
            
            <div class="benefits-list">
              <div class="benefit-item">
                <div class="benefit-icon">🎁</div>
                <div class="benefit-text">
                  <strong>10% de descuento</strong>
                  <span>en tu primera compra al registrarte</span>
                </div>
              </div>
              
              <div class="benefit-item">
                <div class="benefit-icon">📦</div>
                <div class="benefit-text">
                  <strong>Seguimiento en tiempo real</strong>
                  <span>de todos tus pedidos</span>
                </div>
              </div>
              
              <div class="benefit-item">
                <div class="benefit-icon">⭐</div>
                <div class="benefit-text">
                  <strong>Programa de puntos</strong>
                  <span>acumula y canjea por descuentos</span>
                </div>
              </div>

              <div class="benefit-item">
                <div class="benefit-icon">🔔</div>
                <div class="benefit-text">
                  <strong>Alertas de ofertas</strong>
                  <span>sé el primero en enterarte</span>
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

        <!-- Panel de Registro -->
        <div class="register-card">
          <div class="card-glow"></div>
          
          <div class="card-header">
            <h2>Crear Cuenta</h2>
            <p class="subtitle">Completa tus datos para registrarte</p>
          </div>

          <form (ngSubmit)="onSubmit()" #registerForm="ngForm" novalidate class="register-form">

          <!-- Nombre y Apellidos en fila -->
          <div class="form-row">
            <div class="form-group">
              <label for="nombre">Nombre</label>
              <div class="input-wrapper">
                <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                <input 
                  id="nombre"
                  type="text"
                  name="nombre"
                  [(ngModel)]="nombre"
                  placeholder="Raul"
                  required
                  pattern="^[a-zA-ZÁÉÍÓÚáéíóúÑñ ]+$"
                  autocomplete="given-name">
              </div>
              <div class="error" *ngIf="registerForm.submitted && (!nombre || !registerForm.controls['nombre']?.valid)">
                Solo letras permitidas
              </div>
            </div>

            <div class="form-group">
              <label for="apellidos">Apellidos</label>
              <div class="input-wrapper">
                <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                <input 
                  id="apellidos"
                  type="text"
                  name="apellidos"
                  [(ngModel)]="apellidos"
                  placeholder="Fernandez Delgado"
                  required
                  pattern="^[a-zA-ZÁÉÍÓÚáéíóúÑñ ]+$"
                  autocomplete="family-name">
              </div>
              <div class="error" *ngIf="registerForm.submitted && (!apellidos || !registerForm.controls['apellidos']?.valid)">
                Solo letras permitidas
              </div>
            </div>
          </div>

          <!-- Correo -->
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
                placeholder="raul@ejemplo.com"
                required
                pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.com$"
                autocomplete="email">
            </div>
            <div class="error" *ngIf="registerForm.submitted && (!correo || !registerForm.controls['correo']?.valid)">
              Ingresa un correo válido terminado en .com
            </div>
          </div>

          <!-- Teléfono y Ciudad en fila -->
          <div class="form-row">
            <div class="form-group">
              <label for="telefono">Teléfono</label>
              <div class="input-wrapper">
                <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                <input 
                  id="telefono"
                  type="tel"
                  name="telefono"
                  [(ngModel)]="telefono"
                  placeholder="612345678"
                  required
                  pattern="^[0-9]{9}$"
                  autocomplete="tel">
              </div>
              <div class="error" *ngIf="registerForm.submitted && (!telefono || !registerForm.controls['telefono']?.valid)">
                9 dígitos requeridos
              </div>
            </div>

            <div class="form-group">
              <label for="ciudad">Ciudad</label>
              <div class="input-wrapper">
                <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <input 
                  id="ciudad"
                  type="text"
                  name="ciudad"
                  [(ngModel)]="ciudad"
                  placeholder="Madrid"
                  required
                  autocomplete="address-level2">
              </div>
              <div class="error" *ngIf="registerForm.submitted && !ciudad">
                Ciudad requerida
              </div>
            </div>
          </div>

          <!-- DNI y Dirección -->
          <div class="form-row">
            
            <!-- DNI -->
            <div class="form-group">
              <label for="dni">DNI</label>
              <div class="input-wrapper">
                <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"/>
                </svg>
                <input 
                  id="dni"
                  type="text"
                  name="dni"
                  [(ngModel)]="dni"
                  placeholder="12345678A"
                  required
                  pattern="^[0-9]{8}[A-Za-z]$"
                  maxlength="9">
              </div>
              <div class="error" *ngIf="registerForm.submitted && (!dni || !registerForm.controls['dni']?.valid)">
                DNI inválido (8 números + 1 letra)
              </div>
            </div>

            <!-- Dirección -->
            <div class="form-group">
              <label for="direccionEnvio">Dirección de Envío</label>
              <div class="input-wrapper">
                <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
                <input 
                  id="direccionEnvio"
                  type="text"
                  name="direccionEnvio"
                  [(ngModel)]="direccionEnvio"
                  placeholder="Calle Ejemplo 123"
                  required>
              </div>
              <div class="error" *ngIf="registerForm.submitted && !direccionEnvio">
                Dirección requerida
              </div>
            </div>

          </div>

          <!-- Contraseña -->
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
                placeholder="Mínimo 6 caracteres"
                required
                minlength="6"
                autocomplete="new-password">
            </div>
            <div class="error" *ngIf="registerForm.submitted && (!password || password.length < 6)">
              Mínimo 6 caracteres
            </div>
          </div>

          <!-- Términos -->
          <div class="terms-checkbox">
            <label class="checkbox-label">
              <input type="checkbox" name="terms" [(ngModel)]="acceptTerms" required>
              <span class="checkmark"></span>
              <span>Acepto los <a href="#" class="terms-link">términos y condiciones</a> y la 
                <a href="#" class="terms-link">política de privacidad</a></span>
            </label>
            <div class="error" *ngIf="registerForm.submitted && !acceptTerms">
              Debes aceptar los términos y condiciones
            </div>
          </div>

          <button type="submit" [disabled]="!registerForm.form.valid" class="submit-btn">
            <span *ngIf="!message.includes('Intentando')">Crear mi cuenta</span>
            <span *ngIf="message.includes('Intentando')" class="loading">
              <span class="spinner"></span> Registrando...
            </span>
          </button>

          <div *ngIf="message && !message.includes('Intentando')" 
              [class]="message.includes('Error') || message.includes('error') ? 'message error' : 'message success'">
            {{ message }}
          </div>

        </form>


          <div class="divider">
            <span>o</span>
          </div>

          <div class="login-section">
            <p>¿Ya tienes una cuenta?</p>
            <a routerLink="/login" class="login-link">Iniciar sesión</a>
          </div>

          <div class="security-note">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
            <span>Tus datos están protegidos</span>
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

    .card-glow {
      pointer-events: none;
    }

    .register-page {
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

    .register-container {
      display: grid;
      grid-template-columns: 1fr 520px;
      max-width: 1400px;
      width: 100%;
      gap: 3rem;
      position: relative;
      z-index: 1;
      animation: fadeIn 0.8s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* CARD DE REGISTRO */
    .register-card {
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
      from { opacity: 0; transform: translateX(50px); }
      to { opacity: 1; transform: translateX(0); }
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
      margin-bottom: 1.5rem;
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

    .register-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      position: relative;
      z-index: 1;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .form-group label {
      font-size: 0.85rem;
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
      width: 18px;
      height: 18px;
      color: #94a3b8;
      pointer-events: none;
    }

    .form-group input {
      width: 100%;
      padding: 0.85rem 1rem 0.85rem 2.75rem;
      border: 2px solid #e2e8f0;
      border-radius: 10px;
      font-size: 0.95rem;
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

    .error {
      color: #ef4444;
      font-size: 0.75rem;
      animation: slideIn 0.3s ease-out;
      margin-top: 0.25rem;
    }

    @keyframes slideIn {
      from { opacity: 0; transform: translateY(-5px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .terms-checkbox {
      margin-top: 0.5rem;
    }

    .checkbox-label {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      font-size: 0.85rem;
      color: #64748b;
      cursor: pointer;
      line-height: 1.4;
    }

    .checkbox-label input[type="checkbox"] {
      width: 18px;
      height: 18px;
      margin-top: 2px;
      cursor: pointer;
      accent-color: #667eea;
    }

    .terms-link {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
    }

    .terms-link:hover {
      text-decoration: underline;
    }

    .submit-btn {
      margin-top: 0.75rem;
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
      margin: 1.5rem 0 1rem;
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

    .login-section {
      text-align: center;
    }

    .login-section p {
      color: #64748b;
      font-size: 0.95rem;
      margin-bottom: 0.75rem;
    }

    .login-link {
      display: inline-block;
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
      font-size: 1rem;
      transition: color 0.2s;
    }

    .login-link:hover {
      color: #764ba2;
      text-decoration: underline;
    }

    .security-note {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 1.25rem;
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
      from { opacity: 0; transform: translateX(-50px); }
      to { opacity: 1; transform: translateX(0); }
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
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.3rem;
      flex-shrink: 0;
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
      .register-container {
        grid-template-columns: 1fr 480px;
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
      .register-page {
        padding: 1.5rem;
      }

      .register-container {
        grid-template-columns: 1fr;
        max-width: 520px;
      }

      .register-card {
        padding: 2rem;
        order: 1;
      }

      .info-panel {
        display: none;
      }
    }

    @media (max-width: 640px) {
      .register-page {
        padding: 1rem;
      }

      .register-card {
        padding: 1.5rem;
        border-radius: 20px;
      }

      .card-header h2 {
        font-size: 1.5rem;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .form-group input {
        padding: 0.8rem 1rem 0.8rem 2.5rem;
        font-size: 0.9rem;
      }

      .input-icon {
        width: 16px;
        height: 16px;
        left: 0.85rem;
      }

      .submit-btn {
        padding: 0.9rem;
        font-size: 0.95rem;
      }

      .checkbox-label {
        font-size: 0.8rem;
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
  acceptTerms = false;
  message = '';
  dni: string = "";
  direccionEnvio: string = "";
  fotoDni: File | null = null;


  // Partículas animadas
  particles = Array.from({ length: 50 }, (_, i) => ({
    x: Math.random() * 100,
    delay: `${Math.random() * 20}s`,
    duration: `${15 + Math.random() * 10}s`
  }));

  constructor(private authService: AuthService, private router: Router) {}

  onFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.fotoDni = file;
  }
}


  onSubmit() {
    this.message = 'Intentando registro...';

    const data = {
      nombre: this.nombre,
      apellidos: this.apellidos,
      correo: this.correo,
      telefono: this.telefono,
      ciudad: this.ciudad,
      password: this.password,
      dni: this.dni,
      direccionEnvio: this.direccionEnvio,
      fotoDni: null
    };

    this.authService.registerCliente(data).subscribe({
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
            setTimeout(() => this.router.navigate(['/']), 1500);
          },
          error: (err: any) => {
            console.error('Error login automático:', err);
            this.message = 'Registro correcto. Redirigiendo al login...';
            setTimeout(() => this.router.navigate(['/login']), 2000);
          }
        });
      },
      error: (err: any) => {
        console.error('Error en registro:', err);
        this.message = 'Error en registro. Verifica tus datos e inténtalo de nuevo.';
      }
    });
  }
}


