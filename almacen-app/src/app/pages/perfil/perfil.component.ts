import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="perfil-layout">
      <!-- NAVBAR IGUAL AL DASHBOARD -->
      <header class="navbar">
        <div class="nav-left">
          <div class="logo-container" (click)="goToDashboard()" style="cursor:pointer">
            <span class="logo-icon">⚡</span>
            <div class="logo-text">
              <h1 class="app-title">TechStore</h1>
              <span class="app-subtitle">Premium Electronics</span>
            </div>
          </div>
        </div>
        
        <div class="nav-right">
          <div class="user-menu" (click)="toggleMenu()">
            <div class="avatar-btn">
              <img [src]="user.foto || 'assets/img/default.jpg'" class="user-icon" />

              <svg class="chevron" [class.rotated]="menuOpen" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </div>
            
            <div class="menu-dropdown" *ngIf="menuOpen" (click)="$event.stopPropagation()">
              <ng-container *ngIf="isLoggedIn; else notLogged">
                <div class="menu-user-info">
                  <span class="menu-greeting">¡Hola!</span>
                  <span class="menu-role">{{ isAdmin ? 'Administrador' : isCliente ? 'Cliente' : 'Trabajador' }}</span>
                </div>
                <div class="menu-divider"></div>
                <div class="menu-item active" (click)="goToProfile()">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  Mi perfil
                </div>
                <div *ngIf="isCliente" class="menu-item" (click)="goToMisPedidos()">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                  Mis pedidos
                </div>
                <div *ngIf="isAdmin || isTrabajador" class="menu-divider"></div>
                <div *ngIf="isAdmin" class="menu-item" (click)="goToGestionUsuarios()">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  Gestión Usuarios
                </div>
                <div *ngIf="isAdmin || isTrabajador" class="menu-item" (click)="goToGestionProductos()">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                  Gestión Productos
                </div>
                <div *ngIf="isAdmin || isTrabajador" class="menu-item" (click)="goToGestionPedidos()">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                  Gestión Pedidos
                </div>
                <div class="menu-divider"></div>
                <div class="menu-item logout" (click)="logout()">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  Cerrar sesión
                </div>
              </ng-container>
              <ng-template #notLogged>
                <div class="menu-item" (click)="goToLogin()">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                  Iniciar sesión
                </div>
                <div class="menu-item" (click)="goToRegister()">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                  Registrarse
                </div>
              </ng-template>
            </div>
          </div>
        </div>
      </header>

      <!-- CONTENIDO DEL PERFIL -->
      <div class="profile-page">
        <div class="profile-container">
          <!-- Header Card -->
          <div class="profile-header-card">
            <div class="profile-banner"></div>
            <div class="profile-info-header">
              <div class="avatar-wrapper">
                <img [src]="user.foto || 'assets/img/default.jpg'" (error)="onImageError($event)">
                <label class="avatar-edit-btn" for="file-input">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"/>
                    <path d="M21 16V8C21 6.89543 20.1046 6 19 6H17.62L16 3H8L6.38 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 17.1046 21 16Z"/>
                  </svg>
                </label>
                <input id="file-input" type="file" (change)="onFileSelected($event)" accept="image/*" style="display:none"/>
              </div>
              <div class="user-details">
                <h1>{{ user.nombre }} {{ user.apellidos }}</h1>
                <p class="user-email">{{ user.correo }}</p>
                <div class="user-badges">
                  <span class="badge" [class.badge-trabajador]="esTrabajador" [class.badge-cliente]="!esTrabajador && !esAdmin">
                  {{ esAdmin ? '👑 Administrador' : esTrabajador ? '👷 Trabajador' : '👤 Cliente' }}
                </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Form Content -->
          <div class="profile-content">
            <form (ngSubmit)="guardarCambios()" class="profile-form">
              <!-- Información Personal -->
              <div class="form-section">
                <div class="section-header">
                  <div class="section-icon">👤</div>
                  <h2>Información Personal</h2>
                </div>
                <div class="form-grid">
                  <div class="form-group">
                    <label for="nombre">Nombre</label>
                    <input id="nombre" type="text" [(ngModel)]="user.nombre" name="nombre" placeholder="Tu nombre" [class.error-input]="errores.nombre"/>
                    <span class="error-message" *ngIf="errores.nombre">{{ errores.nombre }}</span>
                  </div>
                  <div class="form-group">
                    <label for="apellidos">Apellidos</label>
                    <input id="apellidos" type="text" [(ngModel)]="user.apellidos" name="apellidos" placeholder="Tus apellidos" [class.error-input]="errores.apellidos"/>
                    <span class="error-message" *ngIf="errores.apellidos">{{ errores.apellidos }}</span>
                  </div>
                </div>
              </div>

              <!-- Información de Contacto -->
              <div class="form-section">
                <div class="section-header">
                  <div class="section-icon">📧</div>
                  <h2>Información de Contacto</h2>
                </div>
                <div class="form-grid">
                  <div class="form-group">
                    <label for="correo">Correo electrónico</label>
                    <input id="correo" type="email" [(ngModel)]="user.correo" name="correo" placeholder="correo@ejemplo.com" [class.error-input]="errores.correo"/>
                    <span class="error-message" *ngIf="errores.correo">{{ errores.correo }}</span>
                  </div>
                  <div class="form-group">
                    <label for="telefono">Teléfono</label>
                    <input id="telefono" type="tel" [(ngModel)]="user.telefono" name="telefono" placeholder="+34 600 000 000" [class.error-input]="errores.telefono"/>
                    <span class="error-message" *ngIf="errores.telefono">{{ errores.telefono }}</span>
                  </div>
                  <div class="form-group full-width">
                    <label for="ciudad">Ciudad</label>
                    <input id="ciudad" tyactualizarUsuariope="text" [(ngModel)]="user.ciudad" name="ciudad" placeholder="Tu ciudad" [class.error-input]="errores.ciudad"/>
                    <span class="error-message" *ngIf="errores.ciudad">{{ errores.ciudad }}</span>
                  </div>
                </div>
              </div>

              <!-- Info según rol -->
              <div class="form-section" *ngIf="!esAdmin">
                <div class="section-header">
                  <div class="section-icon">{{ esTrabajador ? '💼' : '🏠' }}</div>
                  <h2>{{ esTrabajador ? 'Información Laboral' : 'Información de Envío' }}</h2>
                </div>
                <div class="form-grid">
                  <ng-container *ngIf="esTrabajador">
                    <div class="form-group full-width">
                      <label for="nss">Número de Seguridad Social</label>
                      <input id="nss" type="text" [(ngModel)]="trabajadorData.numero_seguridad_social" name="nss" placeholder="SS001234567890" [class.error-input]="errores.nss"/>
                      <span class="error-message" *ngIf="errores.nss">{{ errores.nss }}</span>
                    </div>
                  </ng-container>
                  <ng-container *ngIf="isCliente">
                    <div class="form-group">
                      <label for="dni">DNI</label>
                      <input id="dni" type="text" [(ngModel)]="clienteData.dni" name="dni" placeholder="12345678A" maxlength="9" [class.error-input]="errores.dni"/>
                      <span class="error-message" *ngIf="errores.dni">{{ errores.dni }}</span>
                    </div>
                    <div class="form-group full-width">
                      <label for="direccion">Dirección de envío</label>
                      <input id="direccion" type="text" [(ngModel)]="clienteData.direccion_envio" name="direccion" placeholder="Calle Principal, 123, 28001 Madrid" [class.error-input]="errores.direccion"/>
                      <span class="error-message" *ngIf="errores.direccion">{{ errores.direccion }}</span>
                    </div>
                  </ng-container>
                </div>
              </div>



              <!-- Actions -->
              <div class="form-actions">
                <button type="button" class="btn-secondary" (click)="goToDashboard()">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                  Volver
                </button>
                <button type="submit" class="btn-primary">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                  Guardar Cambios
                </button>
              </div>

              <div *ngIf="message" [class]="message.includes('✅') ? 'alert success' : 'alert error'">{{ message }}</div>
            </form>

          </div>
        </div>
      </div>

      <!-- Partículas -->
      <div class="particles-bg">
        <div class="particle" *ngFor="let p of particles" [style.left.%]="p.x" [style.animationDelay]="p.delay" [style.animationDuration]="p.duration"></div>
      </div>
    </div>
  `,
  styles: [`
:host { --primary: #6366f1; --primary-dark: #4f46e5; --accent: #06b6d4; --bg-dark: #0f172a; --bg-card: #1e293b; --text: #f8fafc; --text-muted: #94a3b8; --border: rgba(255,255,255,0.1); --success: #10b981; --danger: #ef4444; }

.perfil-layout { min-height: 100vh; background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%); color: var(--text); font-family: 'Inter', -apple-system, sans-serif; position: relative; overflow-x: hidden; }

/* NAVBAR */
.navbar { display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(20px); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 100; }
.nav-left { display: flex; align-items: center; gap: 1rem; }
.logo-container { display: flex; align-items: center; gap: 0.75rem; }
.logo-icon { font-size: 2rem; filter: drop-shadow(0 0 10px rgba(99, 102, 241, 0.5)); }
.logo-text { display: flex; flex-direction: column; }
.app-title { margin: 0; font-size: 1.5rem; font-weight: 700; background: linear-gradient(135deg, #6366f1, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.app-subtitle { font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 2px; }
.nav-right { display: flex; align-items: center; gap: 1rem; }

/* User Menu - Igual al Dashboard */
.user-menu { position: relative; }
.avatar-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; border-radius: 12px; cursor: pointer; transition: background 0.3s; }
.avatar-btn:hover { background: rgba(255,255,255,0.05); }
.user-icon { width: 40px; height: 40px; border-radius: 10px; border: 2px solid var(--primary); object-fit: cover; }
.chevron { color: var(--text-muted); transition: transform 0.3s; }
.chevron.rotated { transform: rotate(180deg); }

.menu-dropdown { position: absolute; top: calc(100% + 8px); right: 0; background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; min-width: 220px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.4); animation: dropIn 0.2s ease; }
@keyframes dropIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

.menu-user-info { padding: 1rem; background: rgba(99, 102, 241, 0.1); }
.menu-greeting { display: block; font-weight: 600; color: var(--text); }
.menu-role { font-size: 0.8rem; color: var(--text-muted); }
.menu-divider { height: 1px; background: var(--border); margin: 0.25rem 0; }
.menu-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.85rem 1rem; color: var(--text-muted); cursor: pointer; transition: all 0.2s; }
.menu-item:hover { background: rgba(99, 102, 241, 0.1); color: var(--text); padding-left: 1.25rem; }
.menu-item.active { background: rgba(99, 102, 241, 0.15); color: var(--primary); border-left: 3px solid var(--primary); }
.menu-item.logout { color: var(--danger); }
.menu-item.logout:hover { background: rgba(239, 68, 68, 0.1); }

/* Profile Page */
.profile-page { min-height: calc(100vh - 76px); position: relative; z-index: 1; padding: 2rem; }
.profile-container { max-width: 900px; margin: 0 auto; }

/* Header Card */
.profile-header-card { background: rgba(30, 41, 59, 0.6); backdrop-filter: blur(20px); border: 1px solid var(--border); border-radius: 20px; overflow: hidden; margin-bottom: 1.5rem; box-shadow: 0 20px 50px rgba(0,0,0,0.3); }
.profile-banner { height: 100px; background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #06b6d4 100%); }
.profile-info-header { padding: 0 2rem 1.5rem; margin-top: -50px; display: flex; gap: 1.5rem; align-items: flex-end; }
.avatar-wrapper img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 4px solid var(--bg-dark);
  object-fit: cover;
  box-shadow: 0 10px 30px rgba(0,0,0,0.4);
}

.profile-avatar { width: 100px; height: 100px; border-radius: 50%; border: 4px solid var(--bg-dark); object-fit: cover; box-shadow: 0 10px 30px rgba(0,0,0,0.4); }
.avatar-edit-btn { position: absolute; bottom: 4px; right: 4px; width: 32px; height: 32px; background: linear-gradient(135deg, var(--primary), var(--accent)); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.5); transition: transform 0.3s; color: white; }
.avatar-edit-btn:hover { transform: scale(1.1); }

.user-details { flex: 1; padding-bottom: 0.5rem; }
.user-details h1 { font-size: 1.5rem; font-weight: 700; margin: 0 0 0.25rem; color: var(--text); }
.user-email { color: var(--text-muted); font-size: 0.9rem; margin: 0 0 0.75rem; }
.user-badges { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.badge { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.35rem 0.75rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600; background: rgba(100, 116, 139, 0.2); color: var(--text-muted); border: 1px solid var(--border); }
.badge-trabajador { background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2)); color: var(--success); border-color: rgba(16, 185, 129, 0.3); }
.badge-cliente { background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(6, 182, 212, 0.2)); color: var(--accent); border-color: rgba(99, 102, 241, 0.3); }

/* Form Content */
.profile-content { background: rgba(30, 41, 59, 0.6); backdrop-filter: blur(20px); border: 1px solid var(--border); border-radius: 20px; padding: 2rem; box-shadow: 0 20px 50px rgba(0,0,0,0.3); }
.profile-form { display: flex; flex-direction: column; gap: 2rem; }

.form-section { display: flex; flex-direction: column; gap: 1rem; }
.section-header { display: flex; align-items: center; gap: 0.75rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--border); }
.section-icon { font-size: 1.25rem; }
.section-header h2 { font-size: 1.1rem; font-weight: 600; color: var(--text); margin: 0; }

.form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
.form-group { display: flex; flex-direction: column; gap: 0.4rem; }
.form-group.full-width { grid-column: 1 / -1; }
.form-group label { font-size: 0.8rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
.form-group input { padding: 0.75rem 1rem; border: 1px solid var(--border); border-radius: 10px; font-size: 0.95rem; background: rgba(15, 23, 42, 0.5); color: var(--text); transition: all 0.3s; }
.form-group input::placeholder { color: rgba(148, 163, 184, 0.5); }
.form-group input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15); }
.form-group input.error-input { border-color: var(--danger); background: rgba(239, 68, 68, 0.1); }
.error-message { font-size: 0.75rem; color: var(--danger); }

/* Actions */
.form-actions { display: flex; gap: 1rem; justify-content: flex-end; padding-top: 1rem; border-top: 1px solid var(--border); }
.btn-primary, .btn-secondary { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; border: none; border-radius: 10px; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.3s; }
.btn-primary { background: linear-gradient(135deg, var(--primary), var(--accent)); color: white; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4); }
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5); }
.btn-secondary { background: rgba(100, 116, 139, 0.2); color: var(--text-muted); border: 1px solid var(--border); }
.btn-secondary:hover { background: rgba(100, 116, 139, 0.3); color: var(--text); }

/* Alert */
.alert { padding: 0.75rem 1rem; border-radius: 10px; font-size: 0.9rem; font-weight: 500; margin-top: 1rem; }
.alert.success { background: rgba(16, 185, 129, 0.15); color: var(--success); border: 1px solid rgba(16, 185, 129, 0.3); }
.alert.error { background: rgba(239, 68, 68, 0.15); color: var(--danger); border: 1px solid rgba(239, 68, 68, 0.3); }

/* Danger Zone Compacta */
.danger-zone { margin-top: 1.5rem; padding: 1rem 1.25rem; background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 12px; }
.danger-content { display: flex; align-items: right; justify-content: space-between; gap: 1rem; }
.danger-info { display: flex; align-items: center; gap: 0.75rem; }
.danger-icon { font-size: 1.25rem; }
.danger-text { display: flex; flex-direction: column; }
.danger-text strong { font-size: 0.9rem; color: #fca5a5; }
.danger-text span { font-size: 0.75rem; color: var(--text-muted); }
.btn-danger-sm { display: flex; align-items: center; gap: 0.4rem; padding: 0.6rem 1rem; background: var(--danger); color: white; border: none; border-radius: 8px; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.3s; white-space: nowrap; }
.btn-danger-sm:hover { background: #dc2626; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4); }

/* Particles */
.particles-bg { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
.particle { position: absolute; width: 3px; height: 3px; background: rgba(99, 102, 241, 0.4); border-radius: 50%; animation: rise 20s infinite ease-in-out; }
@keyframes rise { 0%, 100% { transform: translateY(100vh) scale(0); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translateY(-10vh) scale(1); opacity: 0; } }

/* Responsive */
@media (max-width: 768px) {
  .navbar { padding: 0.75rem 1rem; }
  .app-subtitle { display: none; }
  .profile-page { padding: 1rem; }
  .profile-info-header { flex-direction: column; align-items: center; text-align: center; padding: 0 1.5rem 1.5rem; margin-top: -50px; }
  .profile-avatar { width: 80px; height: 80px; }
  .user-details h1 { font-size: 1.25rem; }
  .user-badges { justify-content: center; }
  .profile-content { padding: 1.5rem; }
  .form-grid { grid-template-columns: 1fr; }
  .form-actions { flex-direction: column-reverse; }
  .btn-primary, .btn-secondary { width: 100%; justify-content: center; }
  .danger-content { flex-direction: column; text-align: center; }
  .danger-info { flex-direction: column; }
  .btn-danger-sm { width: 100%; justify-content: center; }
}
  `]
})
export class PerfilComponent implements OnInit {

  isAdmin = false;
  isCliente = false;
  isTrabajador = false;
  esTrabajador = false;
  esAdmin = false;
  isLoggedIn = false;
  menuOpen = false;
  message = '';
  errores: any = {};

  user: any = {
    nombre: '',
    apellidos: '',
    correo: '',
    telefono: '',
    ciudad: '',
    foto: '',
    fechaRegistro: ''
  };

  clienteData: any = {
    dni: '',
    direccion_envio: '',
    foto_dni: 'default.jpg'
  };

  trabajadorData: any = {
    numero_seguridad_social: ''
  };

  particles = Array.from({ length: 30 }, () => ({
    x: Math.random() * 100,
    delay: `${Math.random() * 20}s`,
    duration: `${15 + Math.random() * 10}s`
  }));

  constructor(private authService: AuthService, private router: Router) {}
    
  ngOnInit() {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;

    if (userData && token) {
      this.user = JSON.parse(userData);
      let roles: string[] = this.user.roles?.map((r: string) => r.toLowerCase()) || [];

      this.isAdmin = roles.includes('admin');
      this.isTrabajador = roles.includes('trabajador') && !this.isAdmin; 
      this.isCliente = roles.includes('cliente') && !this.isAdmin;     

      this.esTrabajador = this.isTrabajador;
      this.esAdmin = this.isAdmin;

      if (this.isTrabajador) {
        this.trabajadorData.numero_seguridad_social = this.user.numero_seguridad_social || '';
        this.cargarDatosTrabajador();
      } 
      if (this.isCliente) {
        this.clienteData.dni = this.user.dni || '';
        this.clienteData.direccion_envio = this.user.direccionEnvio || '';
        this.clienteData.foto_dni = this.user.fotoDni || 'default.jpg';
        this.cargarDatosCliente();
      }
    }
  }

  cargarDatosCliente() {
    this.authService.getClienteData(this.user.id).subscribe({
      next: (res: any) => {
        if (res) {
          this.clienteData.dni = res.dni || this.clienteData.dni;
          this.clienteData.direccion_envio = res.direccionEnvio || this.clienteData.direccion_envio;
          this.clienteData.foto_dni = res.fotoDni || this.clienteData.foto_dni;
        }
      },
      error: (err) => console.error('Error al cargar datos del cliente:', err)
    });
  }

  cargarDatosTrabajador() {
    this.authService.getTrabajadorData(this.user.id).subscribe({
      next: (res: any) => {
        if (res) {
          this.trabajadorData.numero_seguridad_social = res.numeroSeguridadSocial || this.trabajadorData.numero_seguridad_social;
          this.user.numero_seguridad_social = res.numeroSeguridadSocial || this.user.numero_seguridad_social;
          localStorage.setItem('user', JSON.stringify(this.user));
        }
      },
      error: (err) => console.error('Error al cargar datos del trabajador:', err)
    });
  }

 fotoFile: File | null = null; // declara esto en la clase

  guardarCambios() {
    this.errores = {};
    this.message = '';

    if (!this.user.nombre.trim()) this.errores.nombre = '❌ El nombre es obligatorio';
    if (!this.user.apellidos.trim()) this.errores.apellidos = '❌ Los apellidos son obligatorios';
    if (!this.user.correo.trim()) this.errores.correo = '❌ El correo es obligatorio';
    else if (!this.validarEmail(this.user.correo)) this.errores.correo = '❌ Correo inválido';
    if (!this.user.telefono.trim()) this.errores.telefono = '❌ El teléfono es obligatorio';
    else if (!this.validarTelefono(this.user.telefono)) this.errores.telefono = '❌ Teléfono inválido (7-15 dígitos)';
    if (!this.user.ciudad.trim()) this.errores.ciudad = '❌ La ciudad es obligatoria';

    if (this.esTrabajador) {
      if (!this.trabajadorData.numero_seguridad_social.trim()) {
        this.errores.nss = '❌ El número de seguridad social es obligatorio';
      }
    }
    if (this.isCliente) {
      if (!this.clienteData.dni.trim()) this.errores.dni = '❌ El DNI es obligatorio';
      else if (!this.validarDNI(this.clienteData.dni)) this.errores.dni = '❌ DNI inválido (8 números + letra)';
      if (!this.clienteData.direccion_envio.trim()) this.errores.direccion = '❌ La dirección de envío es obligatoria';
    }

    if (Object.keys(this.errores).length > 0) {
      this.message = '❌ Corrige los errores antes de guardar';
      return;
    }

    const userPayload = {
      nombre: this.user.nombre,
      apellidos: this.user.apellidos,
      correo: this.user.correo,
      telefono: this.user.telefono,
      ciudad: this.user.ciudad,
      foto: this.user.foto,
      roles: this.user.roles,

      dni: this.clienteData.dni,
      direccionEnvio: this.clienteData.direccion_envio,
      fotoDni: this.clienteData.foto_dni,

      numeroSeguridadSocial: this.trabajadorData.numero_seguridad_social
    };

    const formData = new FormData();
    formData.append(
      'user',
      new Blob([JSON.stringify(userPayload)], { type: 'application/json' })
    );

    if (this.fotoFile) {
      formData.append('foto', this.fotoFile);
    }

    this.authService.updateUserData(this.user.id, formData).subscribe({
      next: (res: any) => {
        localStorage.setItem('user', JSON.stringify(res));
        this.user = res;
        this.message = '✅ Cambios guardados correctamente';
        setTimeout(() => (this.message = ''), 3000);
      },
      error: (err) => {
        console.error('Error al actualizar usuario:', err);
        this.message = '❌ Error al guardar los cambios. Intenta de nuevo.';
      }
    });
  }


  guardarDatosCliente() {
    const clienteData = {
      dni: this.clienteData.dni,
      direccion_envio: this.clienteData.direccion_envio,
      foto_dni: this.clienteData.foto_dni
    };
    this.authService.updateClienteData(this.user.id, clienteData).subscribe({
      next: () => {
        this.message = '✅ Cambios guardados correctamente';
        setTimeout(() => this.message = '', 3000);
      },
      error: (err) => {
        console.error('Error al actualizar datos del cliente:', err);
        this.message = '❌ Error al guardar los datos del cliente.';
      }
    });
  }

  guardarDatosTrabajador() {
    const trabajadorData = { numero_seguridad_social: this.trabajadorData.numero_seguridad_social };
    this.authService.updateTrabajadorData(this.user.id, trabajadorData).subscribe({
      next: () => {
        this.message = '✅ Cambios guardados correctamente';
        setTimeout(() => this.message = '', 3000);
      },
      error: (err) => {
        console.error('Error al actualizar datos del trabajador:', err);
        this.message = '❌ Error al guardar los datos del trabajador.';
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      this.errores.foto = '❌ Solo se permiten imágenes';
      return;
    }

    this.fotoFile = file; 

    const reader = new FileReader();
    reader.onload = () => {
      this.user.foto = reader.result as string;
      localStorage.setItem('user', JSON.stringify(this.user));
      window.dispatchEvent(new CustomEvent('user-updated', { detail: this.user }));
    };
    reader.readAsDataURL(file);
  }

  onDniFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('❌ Solo se permiten imágenes');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => this.clienteData.foto_dni = reader.result as string;
    reader.readAsDataURL(file);
  }

  removeDniFile() {
    this.clienteData.foto_dni = 'default.jpg';
  }

  validarEmail(email: string) { return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email); }
  validarTelefono(tel: string) { return /^[0-9]{7,15}$/.test(tel); }
  validarDNI(dni: string) { return /^[0-9]{8}[A-Za-z]$/.test(dni); }

  get fotoPerfil(): string {
    return this.user.foto && this.user.foto !== 'default.jpg'
      ? 'http://localhost:8080/uploads/' + this.user.foto
      : 'http://localhost:8080/uploads/default.jpg';
  }

  get fotoPerfilUrl() {
  if (!this.user || !this.user.foto) {
    return 'assets/default-avatar.png';
  }

  return 'http://localhost:8000/storage/perfiles/' + this.user.foto;
}

onImageError(event: any) {
  event.target.src = 'assets/img/default.jpg';
}



  // Navegación
  goToLogin() { this.menuOpen = false; this.router.navigate(['/login']); }
  goToRegister() { this.menuOpen = false; this.router.navigate(['/register']); }
  toggleMenu() { this.menuOpen = !this.menuOpen; }
  goToProfile() { this.menuOpen = false; this.router.navigate(['/perfil']); }
  goToMisPedidos() { this.menuOpen = false; this.router.navigate(['/mispedidos']); }
  goToDashboard() { this.router.navigate(['/dashboard']); }
  goToGestionPedidos() { this.router.navigate(['/admin/pedidos']); }
  goToGestionProductos() { this.router.navigate(['/admin/productos']); }
  goToGestionUsuarios() { this.router.navigate(['/admin/clientes']); }
  logout() {
    this.menuOpen = false;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.isLoggedIn = false;
    this.router.navigate(['/dashboard']);
  }
}
