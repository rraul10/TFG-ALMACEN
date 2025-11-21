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
      <!-- BARRA SUPERIOR -->
      <header class="navbar">
        <div class="navbar-content">
          <button class="btn-dashboard" (click)="goToDashboard()">
            <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Dashboard
          </button>

          <div class="user-menu" (click)="toggleMenu()">
            <div class="user-avatar">
              <img [src]="fotoPerfil" alt="Usuario" />
            </div>
            <div class="menu-dropdown" *ngIf="menuOpen">
  <ng-container *ngIf="isLoggedIn; else notLogged">

    <!-- SOLO CLIENTE -->
    <div class="menu-item" *ngIf="isCliente" (click)="goToMisPedidos()">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 16L12 12M12 12L8 8M12 12L16 8M12 12L8 16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Mis pedidos
    </div>

    <!-- SOLO ADMIN o TRABAJADOR -->
    <ng-container *ngIf="isLoggedIn; else notLogged">

            <!-- PERFIL -->
            <div class="menu-item" (click)="goToProfile()">👤 Mi perfil</div>

            <!-- CLIENTE: MIS PEDIDOS -->
            <div *ngIf="isCliente" class="menu-item" (click)="goToMisPedidos()">📦 Mis pedidos</div>

            <!-- OPCIONES DE ADMIN / TRABAJADOR -->
            <div *ngIf="isAdmin || isTrabajador" class="menu-separator"></div>

            <div *ngIf="isAdmin" class="menu-item" (click)="goToGestionUsuarios()">👥 Gestión de Usuarios</div>

            <div *ngIf="isAdmin || isTrabajador" class="menu-item" (click)="goToGestionProductos()">📦 Gestión de Productos</div>

            <div *ngIf="isAdmin || isTrabajador" class="menu-item" (click)="goToGestionPedidos()">🧾 Gestión de Pedidos</div>

          </ng-container>

    <div class="menu-divider"></div>

    <!-- LOGOUT -->
    <div class="menu-item logout" (click)="logout()">
      Cerrar sesión
    </div>
              </ng-container>

              <ng-template #notLogged>
                <div class="menu-item" (click)="goToLogin()">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15M10 17L15 12M15 12L10 7M15 12H3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Iniciar sesión
                </div>
                <div class="menu-item" (click)="goToRegister()">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M22 21V19C21.9993 18.1137 21.7044 17.2528 21.1614 16.5523C20.6184 15.8519 19.8581 15.3516 19 15.13M15.5 3.13C16.3604 3.35031 17.123 3.85071 17.6676 4.55232C18.2122 5.25392 18.5078 6.11683 18.5078 7.005C18.5078 7.89317 18.2122 8.75608 17.6676 9.45768C17.123 10.1593 16.3604 10.6597 15.5 10.88M12 7C12 9.20914 10.2091 11 8 11C5.79086 11 4 9.20914 4 7C4 4.79086 5.79086 3 8 3C10.2091 3 12 4.79086 12 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Registrarse
                </div>
              </ng-template>
            </div>
          </div>
        </div>
      </header>

      <!-- CONTENIDO DEL PERFIL -->
      <div class="profile-page">
        <div class="background-pattern"></div>
        
        <div class="profile-container">
          <!-- Cabecera del perfil con foto -->
          <div class="profile-header-card">
            <div class="profile-banner"></div>
            <div class="profile-info-header">
              <div class="avatar-wrapper">
                <img [src]="fotoPerfil" alt="Foto de perfil" class="profile-avatar" />
                <label class="avatar-edit-btn" for="file-input">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M21 16V8C21 6.89543 20.1046 6 19 6H17.62L16 3H8L6.38 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 17.1046 21 16Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </label>
                <input 
                  id="file-input" 
                  type="file" 
                  (change)="onFileSelected($event)" 
                  accept="image/*"
                  style="display: none;"
                />
              </div>
              <div class="user-details">
                <h1>{{ user.nombre }} {{ user.apellidos }}</h1>
                <p class="user-email">{{ user.correo }}</p>
                <div class="user-badges">
                  <span class="badge" [class.badge-trabajador]="esTrabajador" [class.badge-cliente]="!esTrabajador">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    {{ esTrabajador ? 'Trabajador' : 'Cliente' }}
                  </span>
                  <span class="badge" *ngIf="user.fechaRegistro">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Miembro desde {{ user.fechaRegistro | date:'MMM yyyy' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Formulario de datos personales -->
          <div class="profile-content">
            <form (ngSubmit)="guardarCambios()" class="profile-form">
              <div class="form-section">
                <div class="section-header">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <h2>Información Personal</h2>
                </div>

                <div class="form-grid">
                  <div class="form-group">
                    <label for="nombre">Nombre</label>
                    <input 
                      id="nombre"
                      type="text" 
                      [(ngModel)]="user.nombre" 
                      name="nombre"
                      placeholder="Tu nombre"
                      [class.error-input]="errores.nombre"
                    />
                    <span class="error-message" *ngIf="errores.nombre">{{ errores.nombre }}</span>
                  </div>

                  <div class="form-group">
                    <label for="apellidos">Apellidos</label>
                    <input 
                      id="apellidos"
                      type="text" 
                      [(ngModel)]="user.apellidos" 
                      name="apellidos"
                      placeholder="Tus apellidos"
                      [class.error-input]="errores.apellidos"
                    />
                    <span class="error-message" *ngIf="errores.apellidos">{{ errores.apellidos }}</span>
                  </div>
                </div>
              </div>

              <div class="form-section">
                <div class="section-header">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <h2>Información de Contacto</h2>
                </div>

                <div class="form-grid">
                  <div class="form-group">
                    <label for="correo">Correo electrónico</label>
                    <input 
                      id="correo"
                      type="email" 
                      [(ngModel)]="user.correo" 
                      name="correo"
                      placeholder="correo@ejemplo.com"
                      [class.error-input]="errores.correo"
                    />
                    <span class="error-message" *ngIf="errores.correo">{{ errores.correo }}</span>
                  </div>

                  <div class="form-group">
                    <label for="telefono">Teléfono</label>
                    <input 
                      id="telefono"
                      type="tel" 
                      [(ngModel)]="user.telefono" 
                      name="telefono"
                      placeholder="+34 600 000 000"
                      [class.error-input]="errores.telefono"
                    />
                    <span class="error-message" *ngIf="errores.telefono">{{ errores.telefono }}</span>
                  </div>

                  <div class="form-group full-width">
                    <label for="ciudad">Ciudad</label>
                    <input 
                      id="ciudad"
                      type="text" 
                      [(ngModel)]="user.ciudad" 
                      name="ciudad"
                      placeholder="Tu ciudad"
                      [class.error-input]="errores.ciudad"
                    />
                    <span class="error-message" *ngIf="errores.ciudad">{{ errores.ciudad }}</span>
                  </div>
                </div>
              </div>

              <!-- SECCIÓN SEGÚN ROL -->
              <div class="form-section">
                <div class="section-header">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <h2>Información {{ esTrabajador ? 'Laboral' : 'de Cliente' }}</h2>
                </div>

                <div class="form-grid">
                  <!-- SI ES CLIENTE: DNI y Dirección -->
                  <ng-container *ngIf="!esTrabajador">
                    <div class="form-group">
                      <label for="dni">DNI</label>
                      <input 
                        id="dni"
                        type="text" 
                        [(ngModel)]="clienteData.dni" 
                        name="dni"
                        placeholder="12345678A"
                        maxlength="9"
                        [class.error-input]="errores.dni"
                      />
                      <span class="error-message" *ngIf="errores.dni">{{ errores.dni }}</span>
                    </div>

                    <div class="form-group full-width">
                      <label for="direccion">Dirección de envío</label>
                      <input 
                        id="direccion"
                        type="text" 
                        [(ngModel)]="clienteData.direccion_envio" 
                        name="direccion"
                        placeholder="Calle Principal, 123, 28001 Madrid"
                        [class.error-input]="errores.direccion"
                      />
                      <span class="error-message" *ngIf="errores.direccion">{{ errores.direccion }}</span>
                    </div>

                    <!-- Upload foto DNI -->
                    <div class="form-group full-width">
                      <label for="foto-dni">Foto del DNI (opcional)</label>
                      <div class="file-upload-wrapper">
                        <input 
                          id="foto-dni" 
                          type="file" 
                          (change)="onDniFileSelected($event)" 
                          accept="image/*"
                          class="file-input"
                        />
                        <label for="foto-dni" class="file-upload-label">
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M17 8L12 3M12 3L7 8M12 3V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                          {{ clienteData.foto_dni && clienteData.foto_dni !== 'default.jpg' ? 'Cambiar foto del DNI' : 'Subir foto del DNI' }}
                        </label>
                      </div>
                      <div *ngIf="clienteData.foto_dni && clienteData.foto_dni !== 'default.jpg'" class="file-preview">
                        <img [src]="'http://localhost:8080/uploads/' + clienteData.foto_dni" alt="DNI">
                        <button type="button" class="btn-remove" (click)="removeDniFile()">
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </ng-container>

                  <!-- SI ES TRABAJADOR: NSS -->
                  <ng-container *ngIf="esTrabajador">
                    <div class="form-group">
                      <label for="nss">Número de Seguridad Social</label>
                      <input 
                        id="nss"
                        type="text" 
                        [(ngModel)]="trabajadorData.numero_seguridad_social" 
                        name="nss"
                        placeholder="SS001234567890"
                        [class.error-input]="errores.nss"
                      />
                      <span class="error-message" *ngIf="errores.nss">{{ errores.nss }}</span>
                    </div>
                  </ng-container>
                </div>
              </div>

              <div class="form-actions">
                <button type="button" class="btn-secondary" (click)="goToDashboard()">
                  Cancelar
                </button>
                <button type="submit" class="btn-primary">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M17 21V13H7V21M7 3V8H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Guardar Cambios
                </button>
              </div>

              <div *ngIf="message" 
                   [class]="message.includes('✅') ? 'alert success' : 'alert error'">
                {{ message }}
              </div>
            </form>

            <!-- Zona de peligro -->
            <div class="danger-zone">
              <div class="section-header danger">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 9V13M12 17H12.01M10.29 3.86L1.82 18C1.64537 18.3024 1.55296 18.6453 1.55199 18.9945C1.55101 19.3437 1.64151 19.6871 1.81445 19.9905C1.98738 20.2939 2.23674 20.5467 2.53771 20.7239C2.83868 20.9011 3.18058 20.9962 3.53 21H20.47C20.8194 20.9962 21.1613 20.9011 21.4623 20.7239C21.7633 20.5467 22.0126 20.2939 22.1856 19.9905C22.3585 19.6871 22.449 19.3437 22.448 18.9945C22.447 18.6453 22.3546 18.3024 22.18 18L13.71 3.86C13.5317 3.56611 13.2807 3.32312 12.9812 3.15448C12.6817 2.98585 12.3437 2.89725 12 2.89725C11.6563 2.89725 11.3183 2.98585 11.0188 3.15448C10.7193 3.32312 10.4683 3.56611 10.29 3.86Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <h2>Zona de Peligro</h2>
              </div>
              <p class="danger-text">Una vez cerrada la sesión, deberás iniciar sesión nuevamente.</p>
              <button type="button" class="btn-danger" (click)="logout()">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12M21 12L16 7M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    * /* === VARIABLES Y BASE === */
:host {
  --primary: #6366f1;
  --primary-dark: #4f46e5;
  --accent: #06b6d4;
  --purple: #764ba2;
  --bg-dark: #0f172a;
  --bg-card: #1e293b;
  --text: #f8fafc;
  --text-muted: #94a3b8;
  --border: rgba(255,255,255,0.1);
  --success: #10b981;
  --danger: #ef4444;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

.perfil-layout {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
  color: var(--text);
  font-family: 'Inter', -apple-system, sans-serif;
  position: relative;
  overflow-x: hidden;
}

/* === PARTICLES === */
.particles-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.particle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: rgba(99, 102, 241, 0.4);
  border-radius: 50%;
  animation: rise 20s infinite ease-in-out;
}

@keyframes rise {
  0%, 100% { transform: translateY(100vh) scale(0); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(-10vh) scale(1); opacity: 0; }
}

/* === NAVBAR === */
.navbar {
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-dashboard {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 10px 18px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-dashboard:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.btn-dashboard .icon { width: 18px; height: 18px; }

/* USER MENU */
.user-menu { position: relative; cursor: pointer; }

.user-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid rgba(99, 102, 241, 0.5);
  overflow: hidden;
  transition: all 0.3s ease;
}

.user-avatar:hover {
  transform: scale(1.05);
  border-color: rgba(99, 102, 241, 0.8);
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.menu-dropdown {
  position: absolute;
  top: 60px;
  right: 0;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  min-width: 220px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
  animation: dropIn 0.2s ease;
}

@keyframes dropIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.menu-user-info {
  padding: 1rem;
  background: rgba(99, 102, 241, 0.1);
  border-bottom: 1px solid var(--border);
}

.menu-greeting {
  display: block;
  font-weight: 600;
  color: var(--text);
}

.menu-role {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.menu-divider {
  height: 1px;
  background: var(--border);
  margin: 0.25rem 0;
}

.menu-separator { 
  height: 1px; 
  background: var(--border); 
  margin: 0.5rem 0; 
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.menu-item svg {
  width: 18px;
  height: 18px;
  color: var(--text-muted);
}

.menu-item:hover {
  background: rgba(99, 102, 241, 0.1);
  color: var(--text);
  padding-left: 1.25rem;
}

.menu-item.logout {
  color: var(--danger);
}

.menu-item.logout svg {
  color: var(--danger);
}

.menu-item.logout:hover {
  background: rgba(239, 68, 68, 0.1);
}

/* === PROFILE PAGE === */
.profile-page {
  min-height: calc(100vh - 76px);
  position: relative;
  padding: 2rem;
}

.background-pattern {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  pointer-events: none;
}

.profile-container {
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

/* === PROFILE HEADER CARD === */
.profile-header-card {
  background: rgba(30, 41, 59, 0.5);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border);
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  margin-bottom: 2rem;
  animation: fadeInUp 0.6s ease;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.profile-banner {
  height: 140px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.profile-info-header {
  padding: 0 2rem 2rem;
  position: relative;
  margin-top: -60px;
  display: flex;
  gap: 2rem;
  align-items: flex-end;
}

.avatar-wrapper {
  position: relative;
  flex-shrink: 0;
}

.profile-avatar {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  border: 5px solid var(--bg-dark);
  object-fit: cover;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
}

.avatar-edit-btn {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
  transition: all 0.3s ease;
  border: none;
}

.avatar-edit-btn:hover {
  transform: scale(1.1);
}

.avatar-edit-btn svg {
  width: 20px;
  height: 20px;
  color: white;
}

.user-details {
  flex: 1;
  padding-bottom: 10px;
}

.user-details h1 {
  font-size: 2rem;
  color: var(--text);
  font-weight: 700;
  margin-bottom: 8px;
}

.user-email {
  color: var(--text-muted);
  font-size: 1rem;
  margin-bottom: 12px;
}

.user-badges {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.badge {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(100, 116, 139, 0.2);
  color: var(--text-muted);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  border: 1px solid var(--border);
}

.badge svg {
  width: 16px;
  height: 16px;
}

.badge-trabajador {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border-color: rgba(16, 185, 129, 0.3);
}

.badge-cliente {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: rgba(102, 126, 234, 0.3);
}

/* === PROFILE CONTENT === */
.profile-content {
  background: rgba(30, 41, 59, 0.5);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border);
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: 2.5rem;
  animation: fadeInUp 0.6s ease 0.2s backwards;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--border);
}

.section-header-icon {
  width: 40px;
  height: 40px;
  background: rgba(99, 102, 241, 0.2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-header svg {
  width: 20px;
  height: 20px;
  color: var(--primary);
}

.section-header h2 {
  font-size: 1.25rem;
  color: var(--text);
  font-weight: 600;
}

.section-header.danger .section-header-icon {
  background: rgba(239, 68, 68, 0.2);
}

.section-header.danger svg {
  color: var(--danger);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-muted);
}

.form-group input,
.form-group select {
  padding: 12px 16px;
  border: 2px solid var(--border);
  border-radius: 12px;
  font-size: 1rem;
  background: rgba(15, 23, 42, 0.5);
  color: var(--text);
  transition: all 0.3s ease;
}

.form-group input::placeholder {
  color: rgba(148, 163, 184, 0.5);
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--primary);
  background: rgba(15, 23, 42, 0.8);
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

.form-group input.error-input {
  border-color: var(--danger);
  background: rgba(239, 68, 68, 0.1);
}

.error-message {
  font-size: 0.85rem;
  color: var(--danger);
  display: flex;
  align-items: center;
  gap: 4px;
}

/* === FILE UPLOAD === */
.file-upload-wrapper {
  position: relative;
}

.file-input {
  display: none;
}

.file-upload-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px;
  background: rgba(15, 23, 42, 0.5);
  border: 2px dashed rgba(203, 213, 225, 0.3);
  border-radius: 12px;
  color: var(--text-muted);
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.file-upload-label svg {
  width: 20px;
  height: 20px;
}

.file-upload-label:hover {
  background: rgba(15, 23, 42, 0.7);
  border-color: var(--primary);
  color: var(--primary);
}

.file-preview {
  margin-top: 12px;
  position: relative;
  display: inline-block;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.file-preview img {
  max-width: 200px;
  height: auto;
  display: block;
}

.btn-remove {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  background: var(--danger);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

.btn-remove svg {
  width: 16px;
  height: 16px;
  color: white;
}

.btn-remove:hover {
  background: #b91c1c;
  transform: scale(1.1);
}

/* === FORM ACTIONS === */
.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
}

.btn-primary,
.btn-secondary,
.btn-danger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary svg,
.btn-secondary svg,
.btn-danger svg {
  width: 18px;
  height: 18px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.5);
}

.btn-secondary {
  background: rgba(100, 116, 139, 0.2);
  color: var(--text-muted);
  border: 1px solid var(--border);
}

.btn-secondary:hover {
  background: rgba(100, 116, 139, 0.3);
  color: var(--text);
}

.btn-danger {
  background: var(--danger);
  color: white;
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
}

.btn-danger:hover {
  background: #b91c1c;
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(239, 68, 68, 0.5);
}

/* === ALERTS === */
.alert {
  padding: 14px 18px;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 500;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.alert.success {
  background: rgba(16, 185, 129, 0.2);
  color: var(--success);
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.alert.error {
  background: rgba(239, 68, 68, 0.2);
  color: var(--danger);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

/* === DANGER ZONE === */
.danger-zone {
  margin-top: 2rem;
  padding: 2rem;
  background: rgba(239, 68, 68, 0.1);
  border: 2px solid rgba(239, 68, 68, 0.3);
  border-radius: 16px;
}

.danger-text {
  color: #fca5a5;
  margin: 1rem 0 1.5rem;
  font-size: 0.95rem;
}

/* === RESPONSIVE === */
@media (max-width: 768px) {
  .navbar-content { padding: 1rem; }
  
  .profile-page { padding: 1rem; }
  
  .profile-info-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 0 1.5rem 1.5rem;
    margin-top: -70px;
  }
  
  .profile-avatar {
    width: 120px;
    height: 120px;
  }
  
  .user-details h1 { font-size: 1.5rem; }
  
  .user-badges { justify-content: center; }
  
  .profile-content { padding: 1.5rem; }
  
  .form-grid { grid-template-columns: 1fr; }
  
  .form-actions {
    flex-direction: column-reverse;
  }
  
  .btn-primary,
  .btn-secondary,
  .btn-danger {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .user-details h1 { font-size: 1.25rem; }
  
  .profile-banner { height: 120px; }
  
  .profile-avatar {
    width: 100px;
    height: 100px;
  }
  
  .section-header h2 { font-size: 1.1rem; }
}
  `]
})
export class PerfilComponent implements OnInit {
    isAdmin = false;
  isCliente = false;
  isTrabajador = false;
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

  message = '';
  errores: any = {};
  menuOpen = false;
  isLoggedIn = false;
  esTrabajador = false;
  esAdmin: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    this.isLoggedIn = !!token;

    if (userData && token) {
      this.user = JSON.parse(userData);

      let roles: string[] = this.user.roles?.map((r: string) => r.toLowerCase()) || [];

      this.isAdmin = roles.includes('admin');
      this.isTrabajador = roles.includes('trabajador') || this.isAdmin; 
      this.isCliente = roles.includes('cliente');

      this.esTrabajador = this.isTrabajador;
      this.esAdmin = this.isAdmin;

      if (this.isTrabajador) {
        this.cargarDatosTrabajador();
      } else {
        this.cargarDatosCliente();
      }
    }
  }

  cargarDatosCliente() {
    this.authService.getClienteData(this.user.id).subscribe({
      next: (response: any) => {
        if (response) {
          this.clienteData.dni = response.dni || '';
          this.clienteData.direccion_envio = response.direccion_envio || '';
          this.clienteData.foto_dni = response.foto_dni || 'default.jpg';
        }
      },
      error: (err) => {
        console.error('Error al cargar datos del cliente:', err);
      }
    });
  }

  goToGestionPedidos() {
    this.router.navigate(['/admin/pedidos']);
  }

  goToGestionProductos() {
    this.router.navigate(['/admin/productos']);
  }

  goToGestionUsuarios() {
    this.router.navigate(['/admin/clientes']);
  }

  cargarDatosTrabajador() {
    this.authService.getTrabajadorData(this.user.id).subscribe({
      next: (response: any) => {
        if (response) {
          this.trabajadorData.numero_seguridad_social = response.numero_seguridad_social || '';
        }
      },
      error: (err) => {
        console.error('Error al cargar datos del trabajador:', err);
      }
    });
  }

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
    } else {
      if (!this.clienteData.dni.trim()) {
        this.errores.dni = '❌ El DNI es obligatorio';
      } else if (!this.validarDNI(this.clienteData.dni)) {
        this.errores.dni = '❌ DNI inválido (8 números + letra)';
      }
      
      if (!this.clienteData.direccion_envio.trim()) {
        this.errores.direccion = '❌ La dirección de envío es obligatoria';
      }
    }

    if (Object.keys(this.errores).length > 0) {
      this.message = '❌ Corrige los errores antes de guardar';
      return;
    }

    const userData = {
      nombre: this.user.nombre,
      apellidos: this.user.apellidos,
      correo: this.user.correo,
      telefono: this.user.telefono,
      ciudad: this.user.ciudad
    };

    this.authService.updateUserData(this.user.id, userData).subscribe({
      next: () => {
        const updatedUser = { ...this.user };
        localStorage.setItem('user', JSON.stringify(updatedUser));

        if (this.esTrabajador) {
          this.guardarDatosTrabajador();
        } else {
          this.guardarDatosCliente();
        }
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
        setTimeout(() => {
          this.message = '';
        }, 3000);
      },
      error: (err) => {
        console.error('Error al actualizar datos del cliente:', err);
        this.message = '❌ Error al guardar los datos del cliente.';
      }
    });
  }

  guardarDatosTrabajador() {
    const trabajadorData = {
      numero_seguridad_social: this.trabajadorData.numero_seguridad_social
    };

    this.authService.updateTrabajadorData(this.user.id, trabajadorData).subscribe({
      next: () => {
        this.message = '✅ Cambios guardados correctamente';
        setTimeout(() => {
          this.message = '';
        }, 3000);
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

    const reader = new FileReader();
    reader.onload = () => {
      this.user.foto = reader.result as string;
      this.errores.foto = '';
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
    reader.onload = () => {
      this.clienteData.foto_dni = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  removeDniFile() {
    this.clienteData.foto_dni = 'default.jpg';
  }

  validarEmail(email: string): boolean {
    const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return re.test(email);
  }

  validarTelefono(telefono: string): boolean {
    const re = /^[0-9]{7,15}$/;
    return re.test(telefono);
  }

  validarDNI(dni: string): boolean {
    const re = /^[0-9]{8}[A-Za-z]$/;
    return re.test(dni);
  }

  get fotoPerfil(): string {
    return this.user.foto && this.user.foto !== 'default.jpg'
      ? 'http://localhost:8080/uploads/' + this.user.foto
      : 'http://localhost:8080/uploads/default.jpg';
  }

  toggleMenu() { this.menuOpen = !this.menuOpen; }

  goToProfile() { this.menuOpen = false; this.router.navigate(['/perfil']); }
  goToMisPedidos() { this.menuOpen = false; this.router.navigate(['/mispedidos']); }
  goToDashboard() { this.router.navigate(['/dashboard']); }

  logout() { 
    this.menuOpen = false; 
    localStorage.removeItem('token'); 
    localStorage.removeItem('user'); 
    this.isLoggedIn = false;
    this.router.navigate(['/dashboard']);
  }

  goToLogin() { this.menuOpen = false; this.router.navigate(['/login']); }
  goToRegister() { this.menuOpen = false; this.router.navigate(['/register']); }
}