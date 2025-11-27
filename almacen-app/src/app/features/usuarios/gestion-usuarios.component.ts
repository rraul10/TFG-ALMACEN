import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { UserService, User } from '@core/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  template: `
    <div class="gestion-layout">
      <!-- NAVBAR -->
      <header class="navbar">
        <div class="nav-left">
          <div class="logo-container" (click)="volverAlDashboard()" style="cursor:pointer">
            <span class="logo-icon">⚡</span>
            <div class="logo-text">
              <h1 class="app-title">TechStore</h1>
              <span class="app-subtitle">Premium Electronics</span>
            </div>
          </div>
        </div>
      </header>

      <!-- CONTENT -->
      <main class="main-content">
        <!-- Page Header -->
        <div class="page-header">
          <div class="header-info">
            <h1>👥 Gestión de Usuarios</h1>
            <p>Administra los usuarios del sistema</p>
          </div>
          <button class="btn-primary" (click)="nuevoUsuario()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Nuevo Usuario
          </button>
        </div>

        <!-- Stats -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon blue">👥</div>
            <div class="stat-info">
              <span class="stat-value">{{ usuarios.length }}</span>
              <span class="stat-label">Total Usuarios</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon green">✅</div>
            <div class="stat-info">
              <span class="stat-value">{{ usuariosFiltrados.length }}</span>
              <span class="stat-label">Activos</span>
            </div>
          </div>
        </div>
  
        <!-- Buscador -->
        <div class="search-filter-section">
          <div class="search-box">
            <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <circle cx="11" cy="11" r="8"/>
  <path d="m21 21-4.35-4.35"/>
</svg>

            <input 
              type="text" 
              [(ngModel)]="searchTerm" 
              (input)="aplicarFiltros()"
              placeholder="Buscar usuarios por nombre, apellidos o correo..."
            />
            <button class="clear-btn" *ngIf="searchTerm" (click)="limpiarBusqueda()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6L18 18"/>
              </svg>
            </button>
          </div>

          <div class="results-info" *ngIf="searchTerm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <circle cx="12" cy="12" r="10"/>
  <path d="M12 16v-4M12 8h.01"/>
</svg>

            Mostrando {{ usuariosFiltrados.length }} de {{ usuarios.length }} usuarios
            <button class="btn-reset-filters" (click)="limpiarFiltros()">Limpiar búsqueda</button>
          </div>
        </div>

        <!-- Grid de usuarios -->
        <div class="usuarios-grid" *ngIf="usuariosFiltrados.length > 0">
          <div class="usuario-card" *ngFor="let u of usuariosFiltrados">
            <div class="card-header-user">
              <img [src]="'http://localhost:8080/files/' + u.foto" [alt]="u.nombre" class="usuario-avatar" />
              <span class="badge-activo">✓ Activo</span>
            </div>
            <div class="card-body-user">
              <h3>{{ u.nombre }} {{ u.apellidos }}</h3>
              <div class="user-details">
                <div class="detail-row">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <span>{{ u.correo }}</span>
                </div>
                <div class="detail-row">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  <span>{{ u.telefono }}</span>
                </div>
                <div class="detail-row">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
  <circle cx="12" cy="10" r="3"/>
</svg>

                  <span>{{ u.ciudad }}</span>
                </div>
                <div class="detail-row" *ngIf="u.rol === 'cliente' && u.dni">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span>DNI: {{ u.dni }}</span>
                </div>
                <div class="detail-row" *ngIf="u.rol === 'cliente' && u.direccionEnvio">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3l.71-.71z"/>
                  </svg>
                  <span>Dirección de envío: {{ u.direccionEnvio }}</span>
                </div>
                <div class="detail-row" *ngIf="u.rol === 'trabajador' && u.numeroSeguridadSocial">
                  <!-- ✅ CORRECTO -->
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
  <circle cx="12" cy="7" r="4"></circle>
</svg>

                  <span>Número Seguridad Social: {{ u.numeroSeguridadSocial }}</span>
                </div>
              </div>
            </div>
            <div class="card-footer-user">
              <button class="btn-edit" (click)="editarUsuario(u)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Editar
              </button>
              <button class="btn-delete" (click)="eliminarUsuario(u.id)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
                Eliminar
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div class="empty-state" *ngIf="usuariosFiltrados.length === 0 && usuarios.length === 0">
          <div class="empty-icon">👥</div>
          <h3>No hay usuarios</h3>
          <p>Añade el primer usuario al sistema</p>
          <button class="btn-primary" (click)="nuevoUsuario()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Crear Usuario
          </button>
        </div>

        <!-- Sin resultados -->
        <div class="empty-state" *ngIf="usuariosFiltrados.length === 0 && usuarios.length > 0">
          <div class="empty-icon">🔍</div>
          <h3>No se encontraron usuarios</h3>
          <p>No hay usuarios que coincidan con tu búsqueda</p>
          <button class="btn-primary" (click)="limpiarFiltros()">Limpiar búsqueda</button>
        </div>
      </main>

      <!-- MODAL -->
      <div class="modal-overlay" *ngIf="usuarioSeleccionado" (click)="cancelarEdicion()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{ usuarioSeleccionado.id ? '✏️ Editar Usuario' : '➕ Nuevo Usuario' }}</h2>
            <button class="btn-close" (click)="cancelarEdicion()">&times;</button>
          </div>

          <form #usuarioForm="ngForm" (ngSubmit)="guardarUsuario(usuarioForm)">
            <div class="modal-body">
              <div class="form-grid">
                <div class="form-group">
                  <label>Nombre</label>
                  <input type="text" name="nombre" [(ngModel)]="usuarioSeleccionado.nombre" required #nombre="ngModel" placeholder="Nombre"/>
                  <div class="error-msg" *ngIf="nombre.invalid && (nombre.touched || mostrarErrores)">
                    El nombre es obligatorio
                  </div>
                </div>

                <div class="form-group">
                  <label>Apellidos</label>
                  <input type="text" name="apellidos" [(ngModel)]="usuarioSeleccionado.apellidos" required #apellidos="ngModel" placeholder="Apellidos"/>
                  <div class="error-msg" *ngIf="apellidos.invalid && (apellidos.touched || mostrarErrores)">
                    Los apellidos son obligatorios
                  </div>
                </div>

                <div class="form-group full-width">
                  <label>Correo Electrónico</label>
                  <input type="email" name="correo" [(ngModel)]="usuarioSeleccionado.correo" required email #correo="ngModel" placeholder="correo@ejemplo.com"/>
                  <div class="error-msg" *ngIf="correo.invalid && (correo.touched || mostrarErrores)">
                    Ingresa un correo válido
                  </div>
                </div>

                <div class="form-group full-width">
                  <label>Contraseña</label>
                  <input type="password" name="password" [(ngModel)]="usuarioSeleccionado.password" required minlength="6" #password="ngModel" placeholder="••••••••"/>
                  <div class="error-msg" *ngIf="password.invalid && (password.touched || mostrarErrores)">
                    La contraseña debe tener al menos 6 caracteres
                  </div>
                </div>

                <div class="form-group">
                  <label>Teléfono</label>
                  <input type="tel" name="telefono" [(ngModel)]="usuarioSeleccionado.telefono" required pattern="^\\+?\\d{9,15}$" #telefono="ngModel" placeholder="+34 600 000 000"/>
                  <div class="error-msg" *ngIf="telefono.invalid && (telefono.touched || mostrarErrores)">
                    Ingresa un teléfono válido (9-15 dígitos, opcional +)
                  </div>
                </div>

                <div class="form-group">
                  <label>Ciudad</label>
                  <input type="text" name="ciudad" [(ngModel)]="usuarioSeleccionado.ciudad" required #ciudad="ngModel" placeholder="Madrid"/>
                  <div class="error-msg" *ngIf="ciudad.invalid && (ciudad.touched || mostrarErrores)">
                    La ciudad es obligatoria
                  </div>
                </div>

                <div class="form-group full-width">
                  <label>Foto de Perfil</label>
                  <div class="file-upload">
                    <input type="file" id="foto-input" (change)="onFileSelected($event)" accept="image/*"/>
                    <label for="foto-input" class="file-label">
                      {{ selectedFile ? selectedFile.name : 'Seleccionar archivo' }}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button class="btn-secondary" type="button" (click)="cancelarEdicion()">Cancelar</button>
              <button class="btn-primary" type="submit">Guardar</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Particles -->
      <div class="particles-bg">
        <div class="particle" *ngFor="let p of particles" [style.left.%]="p.x" [style.animationDelay]="p.delay" [style.animationDuration]="p.duration"></div>
      </div>
    </div>
  `,
  styles: [`
:host { --primary: #6366f1; --accent: #06b6d4; --bg-dark: #0f172a; --bg-card: #1e293b; --text: #f8fafc; --text-muted: #94a3b8; --border: rgba(255,255,255,0.1); --success: #10b981; --danger: #ef4444; }

.gestion-layout { min-height: 100vh; background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%); color: var(--text); font-family: 'Inter', -apple-system, sans-serif; position: relative; overflow-x: hidden; }

/* NAVBAR */
.navbar { display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(20px); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 100; }
.nav-left { display: flex; align-items: center; }
.logo-container { display: flex; align-items: center; gap: 0.75rem; }
.logo-icon { font-size: 2rem; }
.logo-text { display: flex; flex-direction: column; }
.app-title { margin: 0; font-size: 1.5rem; font-weight: 700; background: linear-gradient(135deg, #6366f1, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.app-subtitle { font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 2px; }
.nav-right { display: flex; gap: 0.75rem; }
.btn-nav { display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1rem; background: rgba(255,255,255,0.1); border: 1px solid var(--border); border-radius: 10px; color: var(--text); font-size: 0.9rem; cursor: pointer; transition: all 0.3s; }
.btn-nav:hover { background: rgba(255,255,255,0.15); }

/* MAIN */
.main-content { position: relative; z-index: 1; max-width: 1300px; margin: 0 auto; padding: 2rem; }
.modal-content {
  background: var(--bg-dark);
  border: 1px solid var(--border);
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh; /* altura máxima de la ventana */
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 25px 60px rgba(0,0,0,0.5);
  animation: slideUp 0.3s ease;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;  /* scroll interno si se desborda */
  flex: 1;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  flex-shrink: 0; /* evita que se comprima */
}


.modal-header {
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.file-upload {
  width: 100%;
}

.file-label {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 1rem;
  background: rgba(15, 23, 42, 0.6);
  border: 1px dashed var(--border);
  border-radius: 10px;
  color: var(--text-muted);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
  width: 100%;
  box-sizing: border-box;
}


/* Para móviles */
@media (max-width: 768px) {
  .modal-body {
    padding: 1rem;
  }
  .form-grid {
    grid-template-columns: 1fr;
  }
  .modal-footer {
    flex-direction: column-reverse;
  }
  .modal-footer button {
    width: 100%;
    justify-content: center;
  }
}

/* Page Header */
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
.header-info h1 { font-size: 1.75rem; font-weight: 700; margin: 0 0 0.25rem; }
.header-info p { color: var(--text-muted); font-size: 0.9rem; margin: 0; }

/* Buttons */
.btn-primary { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.25rem; background: linear-gradient(135deg, var(--primary), var(--accent)); border: none; border-radius: 10px; color: white; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4); }
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5); }
.btn-secondary { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.25rem; background: rgba(100, 116, 139, 0.2); border: 1px solid var(--border); border-radius: 10px; color: var(--text-muted); font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.3s; }
.btn-secondary:hover { background: rgba(100, 116, 139, 0.3); color: var(--text); }

/* Stats */
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
.stat-card { background: rgba(30, 41, 59, 0.6); backdrop-filter: blur(10px); border: 1px solid var(--border); border-radius: 16px; padding: 1.25rem; display: flex; align-items: center; gap: 1rem; }
.stat-icon { font-size: 2rem; width: 56px; height: 56px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
.stat-icon.blue { background: rgba(59, 130, 246, 0.2); }
.stat-icon.green { background: rgba(16, 185, 129, 0.2); }
.stat-info { display: flex; flex-direction: column; }
.stat-value { font-size: 1.75rem; font-weight: 700; }
.stat-label { font-size: 0.8rem; color: var(--text-muted); }

/* Search and Filters */
.search-filter-section { background: rgba(30, 41, 59, 0.6); backdrop-filter: blur(10px); border: 1px solid var(--border); border-radius: 16px; padding: 1.5rem; margin-bottom: 2rem; }
.search-box { position: relative; margin-bottom: 0; }
.search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--text-muted); pointer-events: none; }
.search-box input { width: 100%; padding: 0.85rem 3rem 0.85rem 3rem; background: rgba(15, 23, 42, 0.6); border: 1px solid var(--border); border-radius: 10px; color: var(--text); font-size: 0.95rem; transition: all 0.3s; box-sizing: border-box; }
.search-box input::placeholder { color: rgba(148, 163, 184, 0.5); }
.search-box input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15); }
.clear-btn { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); width: 32px; height: 32px; border: none; background: rgba(100, 116, 139, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
.clear-btn:hover { background: rgba(100, 116, 139, 0.3); }
.clear-btn svg { color: var(--text-muted); }

.results-info { display: flex; align-items: center; gap: 8px; padding: 0.75rem 1rem; background: rgba(100, 116, 139, 0.15); border-radius: 10px; color: var(--text-muted); font-size: 0.85rem; font-weight: 500; margin-top: 1rem; }
.results-info svg { color: var(--primary); flex-shrink: 0; }
.btn-reset-filters { margin-left: auto; padding: 0.4rem 0.85rem; background: rgba(99, 102, 241, 0.2); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 8px; font-size: 0.8rem; font-weight: 600; color: var(--primary); cursor: pointer; transition: all 0.2s; }
.btn-reset-filters:hover { background: var(--primary); color: white; border-color: var(--primary); }

/* Grid Usuarios */
.usuarios-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }
.usuario-card { background: rgba(30, 41, 59, 0.6); backdrop-filter: blur(10px); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; transition: all 0.3s; }
.usuario-card:hover { transform: translateY(-4px); border-color: rgba(99, 102, 241, 0.3); box-shadow: 0 15px 40px rgba(0,0,0,0.3); }

.card-header-user { background: linear-gradient(135deg, var(--primary), #764ba2); padding: 1.5rem; display: flex; align-items: center; gap: 1rem; position: relative; }
.usuario-avatar { width: 70px; height: 70px; border-radius: 50%; border: 3px solid white; object-fit: cover; box-shadow: 0 4px 15px rgba(0,0,0,0.3); }
.badge-activo { position: absolute; top: 1rem; right: 1rem; background: rgba(16, 185, 129, 0.95); color: white; padding: 0.3rem 0.75rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600; backdrop-filter: blur(10px); }

.card-body-user { padding: 1.25rem; }
.card-body-user h3 { font-size: 1.1rem; font-weight: 700; margin: 0 0 1rem; color: var(--text); }
.user-details { display: flex; flex-direction: column; gap: 0.6rem; }
.detail-row { display: flex; align-items: center; gap: 0.6rem; font-size: 0.85rem; color: var(--text-muted); }
.detail-row svg { color: var(--primary); flex-shrink: 0; }
.detail-row span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.card-footer-user { padding: 1rem 1.25rem; border-top: 1px solid var(--border); display: flex; gap: 0.75rem; }
.btn-edit, .btn-delete { flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.4rem; padding: 0.65rem; border: none; border-radius: 8px; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.3s; }
.btn-edit { background: rgba(59, 130, 246, 0.2); color: #3b82f6; }
.btn-edit:hover { background: rgba(59, 130, 246, 0.3); }
.btn-delete { background: rgba(239, 68, 68, 0.2); color: var(--danger); }
.btn-delete:hover { background: rgba(239, 68, 68, 0.3); }

/* Empty State */
.empty-state { text-align: center; padding: 4rem 2rem; background: rgba(30, 41, 59, 0.6); border: 1px solid var(--border); border-radius: 20px; }
.empty-icon { font-size: 4rem; margin-bottom: 1rem; opacity: 0.5; }
.empty-state h3 { font-size: 1.5rem; margin: 0 0 0.5rem; }
.empty-state p { color: var(--text-muted); margin: 0 0 1.5rem; }

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); z-index: 200; display: flex; justify-content: center; align-items: center; padding: 1rem; }
.modal-content { background: var(--bg-dark); border: 1px solid var(--border); border-radius: 20px; width: 100%; max-width: 600px; max-height: 90vh; overflow: hidden; box-shadow: 0 25px 60px rgba(0,0,0,0.5); animation: slideUp 0.3s ease; display: flex; flex-direction: column; }
@keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

.modal-header { padding: 1.25rem 1.5rem; background: linear-gradient(135deg, var(--primary), var(--accent)); display: flex; justify-content: space-between; align-items: center; }
.modal-header h2 { margin: 0; font-size: 1.25rem; color: white; }
.btn-close { width: 36px; height: 36px; background: rgba(255,255,255,0.2); border: none; border-radius: 50%; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
.btn-close:hover { background: rgba(255,255,255,0.3); }

.modal-body { padding: 1.5rem; overflow-y: auto; flex: 1; }
.form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
.form-group { display: flex; flex-direction: column; gap: 0.4rem; }
.form-group.full-width { grid-column: 1 / -1; }
.form-group label { font-size: 0.8rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
.form-group input { padding: 0.75rem 1rem; background: rgba(15, 23, 42, 0.6); border: 1px solid var(--border); border-radius: 10px; color: var(--text); font-size: 0.95rem; transition: all 0.3s; }
.form-group input::placeholder { color: rgba(148, 163, 184, 0.5); }
.form-group input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15); }

.file-upload { position: relative; }
.file-upload input[type="file"] { position: absolute; opacity: 0; width: 0; height: 0; }
.file-label { display: flex; align-items: center; gap: 0.6rem; padding: 0.75rem 1rem; background: rgba(15, 23, 42, 0.6); border: 1px dashed var(--border); border-radius: 10px; color: var(--text-muted); font-size: 0.9rem; cursor: pointer; transition: all 0.3s; }
.file-label:hover { border-color: var(--primary); color: var(--primary); }

.modal-footer { padding: 1rem 1.5rem; border-top: 1px solid var(--border); display: flex; justify-content: flex-end; gap: 0.75rem; }

/* Particles */
.particles-bg { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
.particle { position: absolute; width: 3px; height: 3px; background: rgba(99, 102, 241, 0.4); border-radius: 50%; animation: rise 20s infinite ease-in-out; }
@keyframes rise { 0%, 100% { transform: translateY(100vh) scale(0); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translateY(-10vh) scale(1); opacity: 0; } }

/* Responsive */
@media (max-width: 768px) {
  .navbar { padding: 0.75rem 1rem; }
  .app-subtitle { display: none; }
  .main-content { padding: 1rem; }
  .page-header { flex-direction: column; align-items: flex-start; }
  .btn-primary { width: 100%; justify-content: center; }
  .stats-grid { grid-template-columns: 1fr 1fr; }
  .usuarios-grid { grid-template-columns: 1fr; }
  .form-grid { grid-template-columns: 1fr; }
  .modal-footer { flex-direction: column-reverse; }
  .modal-footer button { width: 100%; justify-content: center; }
}
  `]
})
export class GestionUsuariosComponent implements OnInit {
  usuarios: User[] = [];
  usuarioSeleccionado: User | null = null;
  selectedFile: File | null = null;
  searchTerm: string = '';
  usuariosFiltrados: User[] = [];
  mostrarErrores = false;

  particles = Array.from({ length: 30 }, () => ({
    x: Math.random() * 100,
    delay: `${Math.random() * 20}s`,
    duration: `${15 + Math.random() * 10}s`
  }));

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.userService.getAll().subscribe({
      next: (data: User[]) => {
        console.log('Usuarios desde API:', data);
        this.usuarios = data;
        this.usuariosFiltrados = [...this.usuarios];
      },
      error: (err: any) => console.error('Error cargando usuarios', err)
    });
  }

  aplicarFiltros() {
    const termino = this.searchTerm.trim().toLowerCase();
    this.usuariosFiltrados = this.usuarios.filter(u =>
      u.nombre.toLowerCase().includes(termino) ||
      u.apellidos.toLowerCase().includes(termino) ||
      u.correo.toLowerCase().includes(termino)
    );
  }

  limpiarBusqueda() {
    this.searchTerm = '';
    this.aplicarFiltros();
  }

  limpiarFiltros() {
    this.searchTerm = '';
    this.aplicarFiltros();
  }

  nuevoUsuario(form?: NgForm) {
    if(form) form.resetForm();
    this.usuarioSeleccionado = {
      id: 0,
      nombre: '',
      apellidos: '',
      correo: '',
      password: '',
      telefono: '',
      ciudad: '',
      foto: '',
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      deleted: false,
      rol: ''
    };
    this.selectedFile = null;
    this.mostrarErrores = false;
  }

  editarUsuario(u: User) {
    this.usuarioSeleccionado = { ...u };
    this.selectedFile = null;
  }

  cancelarEdicion() {
    this.usuarioSeleccionado = null;
    this.selectedFile = null;
  }

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) this.selectedFile = input.files[0];
  }

  guardarUsuario(form: NgForm) {
    if (!this.usuarioSeleccionado) return;

    this.mostrarErrores = true;
    Object.values(form.controls).forEach(control => control?.markAsTouched());

    if (!form.valid) return;

    const userToSend: Partial<User> = { ...this.usuarioSeleccionado };
    if (userToSend.id === 0) delete userToSend.id;

    const formData = new FormData();
    formData.append('user', JSON.stringify(userToSend));
    if (this.selectedFile) formData.append('foto', this.selectedFile);

    const req = this.usuarioSeleccionado.id
      ? this.userService.updateWithFile(this.usuarioSeleccionado.id, formData)
      : this.userService.createWithFile(formData);

    req.subscribe({
      next: () => {
        this.snackBar.open(
          this.usuarioSeleccionado!.id ? '✅ Usuario actualizado' : '✅ Usuario creado',
          'Cerrar',
          { duration: 3000 }
        );
        this.cargarUsuarios();
        this.cancelarEdicion();
      },
      error: (err) => {
        console.error('Error en guardarUsuario:', err);
        this.snackBar.open('❌ Error al guardar', 'Cerrar', { duration: 3000 });
      }
    });
  }

  eliminarUsuario(id: number) {
    if (!confirm('¿Eliminar este usuario?')) return;
    this.userService.delete(id).subscribe({
      next: () => {
        this.snackBar.open('✅ Usuario eliminado', 'Cerrar', { duration: 3000 });
        this.cargarUsuarios();
      },
      error: () => this.snackBar.open('❌ Error al eliminar', 'Cerrar', { duration: 3000 })
    });
  }

  volverAlDashboard() {
    this.router.navigate(['/dashboard']);
  }
}