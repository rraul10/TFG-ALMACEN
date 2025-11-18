import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { UserService, User } from '@core/services/user.service'; 
import { Router } from '@angular/router';

@Component({    
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  template: `
    <div class="gestion-layout">
      <!-- HEADER -->
      <header class="page-header">
        <div class="header-content">
          <div class="header-title">
            <svg class="title-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div>
              <h1>Gestión de Usuarios</h1>
              <p class="subtitle">Administra los usuarios del sistema</p>
            </div>
          </div>
          <div class="header-actions">
            <button class="btn btn-primary" (click)="nuevoUsuario()">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Nuevo Usuario
            </button>
            <button class="btn btn-secondary" (click)="volverAlDashboard()">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Dashboard
            </button>
          </div>
        </div>
      </header>

      <!-- CONTENIDO -->
      <div class="page-content">
        <div class="background-pattern"></div>
        
        <div class="usuarios-grid">
          <div *ngFor="let u of usuarios" class="usuario-card">
            <div class="card-header">
              <img [src]="'http://localhost:8080/files/' + u.foto" alt="{{ u.nombre }}" class="usuario-avatar" />
              <div class="usuario-badge">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Activo
              </div>
            </div>

            <div class="card-body">
              <h3 class="usuario-nombre">{{ u.nombre }} {{ u.apellidos }}</h3>
              
              <div class="usuario-details">
                <div class="detail-item">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>{{ u.correo }}</span>
                </div>

                <div class="detail-item">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.18999 12.85C3.49997 10.2412 2.44824 7.27099 2.11999 4.17997C2.095 3.90344 2.12787 3.62474 2.21649 3.3616C2.30512 3.09846 2.44756 2.85666 2.63476 2.6516C2.82196 2.44653 3.0498 2.28268 3.30379 2.1705C3.55777 2.05831 3.83233 2.00024 4.10999 1.99997H7.10999C7.5953 1.9952 8.06579 2.16705 8.43376 2.48351C8.80173 2.79996 9.04207 3.23945 9.10999 3.71997C9.23662 4.68004 9.47144 5.6227 9.80999 6.52997C9.94454 6.8879 9.97366 7.27689 9.8939 7.65086C9.81415 8.02482 9.62886 8.36809 9.35999 8.63998L8.08999 9.90997C9.51355 12.4135 11.5864 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9751 14.1858 16.3491 14.1061C16.7231 14.0263 17.1121 14.0554 17.47 14.19C18.3773 14.5285 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>{{ u.telefono }}</span>
                </div>

                <div class="detail-item">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>{{ u.ciudad }}</span>
                </div>
              </div>
            </div>

            <div class="card-footer">
              <button class="btn btn-edit" (click)="editarUsuario(u)">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13M18.5 2.5C18.8978 2.1022 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.1022 21.5 2.5C21.8978 2.8978 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.1022 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Editar
              </button>
              <button class="btn btn-delete" (click)="eliminarUsuario(u.id)">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Eliminar
              </button>
            </div>
          </div>
        </div>

        <!-- Mensaje si no hay usuarios -->
        <div *ngIf="usuarios.length === 0" class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <h3>No hay usuarios registrados</h3>
          <p>Comienza agregando tu primer usuario</p>
          <button class="btn btn-primary" (click)="nuevoUsuario()">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Crear Usuario
          </button>
        </div>
      </div>

      <!-- MODAL -->
      <div class="modal-backdrop" *ngIf="usuarioSeleccionado" (click)="cancelarEdicion()">
        <div class="modal-container" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              {{ usuarioSeleccionado.id ? 'Editar Usuario' : 'Nuevo Usuario' }}
            </h2>
            <button class="btn-close" (click)="cancelarEdicion()">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <div class="form-grid">
              <div class="form-group">
                <label>Nombre</label>
                <input type="text" [(ngModel)]="usuarioSeleccionado!.nombre" placeholder="Nombre del usuario" />
              </div>

              <div class="form-group">
                <label>Apellidos</label>
                <input type="text" [(ngModel)]="usuarioSeleccionado!.apellidos" placeholder="Apellidos del usuario" />
              </div>

              <div class="form-group full-width">
                <label>Correo Electrónico</label>
                <input type="email" [(ngModel)]="usuarioSeleccionado!.correo" placeholder="correo@ejemplo.com" />
              </div>

              <div class="form-group full-width">
                <label>Contraseña</label>
                <input type="password" [(ngModel)]="usuarioSeleccionado!.password" placeholder="••••••••" />
              </div>

              <div class="form-group">
                <label>Teléfono</label>
                <input type="tel" [(ngModel)]="usuarioSeleccionado!.telefono" placeholder="+34 600 000 000" />
              </div>

              <div class="form-group">
                <label>Ciudad</label>
                <input type="text" [(ngModel)]="usuarioSeleccionado!.ciudad" placeholder="Madrid" />
              </div>

              <div class="form-group full-width">
                <label>Foto de Perfil</label>
                <div class="file-input-wrapper">
                  <input type="file" id="foto-input" (change)="onFileSelected($event)" accept="image/*" />
                  <label for="foto-input" class="file-label">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M17 8L12 3M12 3L7 8M12 3V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    {{ selectedFile ? selectedFile.name : 'Seleccionar archivo' }}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="cancelarEdicion()">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Cancelar
            </button>
            <button class="btn btn-primary" (click)="guardarUsuario()">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M17 21V13H7V21M7 3V8H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Guardar
            </button>
          </div>
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

    .gestion-layout {
      min-height: 100vh;
      background: #f8fafc;
      font-family: 'Inter', 'Segoe UI', Roboto, sans-serif;
    }

    /* HEADER */
    .page-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
      position: sticky;
      top: 0;
      z-index: 50;
    }

    .header-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
    }

    .header-title {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      color: white;
    }

    .title-icon {
      width: 60px;
      height: 60px;
      background: rgba(255, 255, 255, 0.2);
      padding: 12px;
      border-radius: 16px;
      backdrop-filter: blur(10px);
    }

    .header-title h1 {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 4px;
    }

    .subtitle {
      font-size: 0.95rem;
      opacity: 0.9;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }

    /* BUTTONS */
    .btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      border: none;
      border-radius: 10px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn svg {
      width: 18px;
      height: 18px;
    }

    .btn-primary {
      background: white;
      color: #667eea;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .btn-edit {
      background: #3b82f6;
      color: white;
      flex: 1;
    }

    .btn-edit:hover {
      background: #2563eb;
      transform: translateY(-2px);
    }

    .btn-delete {
      background: #dc2626;
      color: white;
      flex: 1;
    }

    .btn-delete:hover {
      background: #b91c1c;
      transform: translateY(-2px);
    }

    /* CONTENT */
    .page-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
      position: relative;
    }

    .background-pattern {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%);
      pointer-events: none;
    }

    /* USUARIOS GRID */
    .usuarios-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 1.5rem;
      position: relative;
      z-index: 1;
    }

    .usuario-card {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
      animation: fadeInUp 0.5s ease;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .usuario-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }

    .card-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      position: relative;
    }

    .usuario-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      border: 4px solid white;
      object-fit: cover;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .usuario-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(255, 255, 255, 0.2);
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      margin-left: auto;
      backdrop-filter: blur(10px);
    }

    .usuario-badge svg {
      width: 16px;
      height: 16px;
    }

    .card-body {
      padding: 1.5rem;
    }

    .usuario-nombre {
      font-size: 1.25rem;
      color: #1e293b;
      font-weight: 700;
      margin-bottom: 1rem;
    }

    .usuario-details {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #64748b;
      font-size: 0.9rem;
    }

    .detail-item svg {
      width: 18px;
      height: 18px;
      color: #94a3b8;
      flex-shrink: 0;
    }

    .detail-item span {
      word-break: break-word;
    }

    .card-footer {
      padding: 1rem 1.5rem;
      background: #f8fafc;
      display: flex;
      gap: 0.75rem;
      border-top: 1px solid #e2e8f0;
    }

    /* EMPTY STATE */
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    .empty-state svg {
      width: 80px;
      height: 80px;
      color: #cbd5e1;
      margin-bottom: 1.5rem;
    }

    .empty-state h3 {
      font-size: 1.5rem;
      color: #1e293b;
      margin-bottom: 0.5rem;
    }

    .empty-state p {
      color: #64748b;
      margin-bottom: 2rem;
    }

    /* MODAL */
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      padding: 1rem;
      animation: fadeIn 0.3s ease;
      backdrop-filter: blur(4px);
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .modal-container {
      background: white;
      border-radius: 20px;
      width: 100%;
      max-width: 700px;
      max-height: 90vh;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      animation: slideUp 0.3s ease;
      display: flex;
      flex-direction: column;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .modal-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1.5rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-header h2 {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 1.5rem;
      font-weight: 700;
    }

    .modal-header h2 svg {
      width: 28px;
      height: 28px;
    }

    .btn-close {
      width: 40px;
      height: 40px;
      border: none;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-close:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.1);
    }

    .btn-close svg {
      width: 20px;
      height: 20px;
      color: white;
    }

    .modal-body {
      padding: 2rem;
      overflow-y: auto;
      flex: 1;
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
      color: #334155;
    }

    .form-group input {
      padding: 12px 16px;
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

    /* FILE INPUT */
    .file-input-wrapper {
      position: relative;
    }

    .file-input-wrapper input[type="file"] {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }

    .file-label {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      border: 2px dashed #cbd5e1;
      border-radius: 10px;
      background: #f8fafc;
      cursor: pointer;
      transition: all 0.3s ease;
      color: #64748b;
      font-weight: 500;
    }

    .file-label:hover {
      border-color: #667eea;
      background: white;
      color: #667eea;
    }

    .file-label svg {
      width: 20px;
      height: 20px;
    }

    .modal-footer {
      padding: 1.5rem 2rem;
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }

    /* RESPONSIVE */
    @media (max-width: 1024px) {
      .header-content {
        flex-direction: column;
        align-items: flex-start;
      }

      .header-actions {
        width: 100%;
        justify-content: flex-start;
      }

      .usuarios-grid {
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      }
    }

    @media (max-width: 768px) {
      .header-content {
        padding: 1.5rem;
      }

      .header-title {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .title-icon {
        width: 50px;
        height: 50px;
      }

      .header-title h1 {
        font-size: 1.5rem;
      }

      .header-actions {
        flex-direction: column;
        gap: 8px;
      }

      .header-actions .btn {
        width: 100%;
        justify-content: center;
      }

      .page-content {
        padding: 1rem;
      }

      .usuarios-grid {
        grid-template-columns: 1fr;
      }

      .card-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .usuario-badge {
        margin-left: 0;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .modal-body {
        padding: 1.5rem;
      }

      .modal-footer {
        flex-direction: column-reverse;
      }

      .modal-footer .btn {
        width: 100%;
        justify-content: center;
      }
    }

    @media (max-width: 480px) {
      .header-title h1 {
        font-size: 1.25rem;
      }

      .usuario-card {
        border-radius: 12px;
      }

      .usuario-nombre {
        font-size: 1.1rem;
      }

      .modal-container {
        border-radius: 16px;
      }
    }
  `]
})
export class GestionUsuariosComponent implements OnInit {
  usuarios: User[] = [];
  usuarioSeleccionado: User | null = null;
  selectedFile: File | null = null;

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
      next: (data: User[]) => (this.usuarios = data),
      error: (err: any) => console.error('Error cargando usuarios', err)
    });
  }

  nuevoUsuario() {
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
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  guardarUsuario() {
    if (!this.usuarioSeleccionado) return;

    const userToSend: Partial<User> = { ...this.usuarioSeleccionado };
    if (userToSend.id === 0) delete userToSend.id;

    const formData = new FormData();
    formData.append('user', JSON.stringify(userToSend));
    if (this.selectedFile) {
      formData.append('foto', this.selectedFile);
    }

    const req = this.usuarioSeleccionado.id
      ? this.userService.updateWithFile(this.usuarioSeleccionado.id, formData)
      : this.userService.createWithFile(formData);

    req.subscribe({
      next: () => {
        this.snackBar.open(
          this.usuarioSeleccionado!.id ? 'Usuario actualizado correctamente ✅' : 'Usuario creado correctamente ✅',
          'Cerrar',
          { duration: 3000 }
        );
        this.cargarUsuarios();
        this.cancelarEdicion();
      },
      error: (err) => {
        console.error('Error guardando usuario', err);
        this.snackBar.open('Error al guardar el usuario ❌', 'Cerrar', { duration: 3000 });
      }
    });
  }

  eliminarUsuario(id: number) {
    if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;
    
    this.userService.delete(id).subscribe({
      next: () => {
        this.snackBar.open('Usuario eliminado correctamente ✅', 'Cerrar', { duration: 3000 });
        this.cargarUsuarios();
      },
      error: (err: any) => {
        console.error('Error eliminando usuario', err);
        this.snackBar.open('Error al eliminar el usuario ❌', 'Cerrar', { duration: 3000 });
      }
    });
  }

  volverAlDashboard() {
    this.router.navigate(['/dashboard']);
  }
}