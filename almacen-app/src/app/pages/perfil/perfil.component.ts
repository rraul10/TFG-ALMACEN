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
        <div class="navbar-left">
          <button class="btn-dashboard" (click)="goToDashboard()">🏠 Dashboard</button>
        </div>

        <div class="user-menu" (click)="toggleMenu()">
          <img 
            src="https://cdn-icons-png.flaticon.com/512/847/847969.png" 
            alt="Usuario" 
            class="user-icon"
          />
          <div class="menu-dropdown" *ngIf="menuOpen">
            <ng-container *ngIf="isLoggedIn; else notLogged">
              <div class="menu-item" (click)="goToProfile()">👤 Mi perfil</div>
              <div class="menu-item" (click)="goToMisPedidos()">📦 Mis pedidos</div>
              <div class="menu-item logout" (click)="logout()">🚪 Cerrar sesión</div>
            </ng-container>

            <ng-template #notLogged>
              <div class="menu-item" (click)="goToLogin()">🔐 Iniciar sesión</div>
              <div class="menu-item" (click)="goToRegister()">📝 Registrarse</div>
            </ng-template>
          </div>
        </div>
      </header>

      <!-- TARJETA DE PERFIL -->
      <div class="profile-page">
        <div class="profile-card">
          <div class="profile-header">
            <img 
              [src]="fotoPerfil" 
              alt="Foto de perfil"
              class="profile-pic"
            />
            <h2>{{ user.nombre }} {{ user.apellidos }}</h2>
            <p class="user-role">👤 Usuario del sistema</p>
          </div>

          <form (ngSubmit)="guardarCambios()" class="profile-info">

            <div class="info-item">
              <label>Nombre:</label>
              <input type="text" [(ngModel)]="user.nombre" name="nombre" />
            </div>
            <div class="error" *ngIf="errores.nombre">{{ errores.nombre }}</div>

            <div class="info-item">
              <label>Apellidos:</label>
              <input type="text" [(ngModel)]="user.apellidos" name="apellidos" />
            </div>
            <div class="error" *ngIf="errores.apellidos">{{ errores.apellidos }}</div>

            <div class="info-item">
              <label>Correo:</label>
              <input type="email" [(ngModel)]="user.correo" name="correo" />
            </div>
            <div class="error" *ngIf="errores.correo">{{ errores.correo }}</div>

            <div class="info-item">
              <label>Teléfono:</label>
              <input type="tel" [(ngModel)]="user.telefono" name="telefono" />
            </div>
            <div class="error" *ngIf="errores.telefono">{{ errores.telefono }}</div>

            <div class="info-item">
              <label>Ciudad:</label>
              <input type="text" [(ngModel)]="user.ciudad" name="ciudad" />
            </div>
            <div class="error" *ngIf="errores.ciudad">{{ errores.ciudad }}</div>

            <div class="info-item">
              <label>Foto:</label>
              <input type="file" (change)="onFileSelected($event)" />
            </div>
            <div class="error" *ngIf="errores.foto">{{ errores.foto }}</div>

            <button type="submit">💾 Guardar cambios</button>
          </form>

          <button class="logout" (click)="logout()">🚪 Cerrar sesión</button>
          <p class="message">{{ message }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* BARRA SUPERIOR */
    .navbar {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      background: #1e293b;
      color: white;
      padding: 0.8rem 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .navbar-left {
      margin-right: auto;
    }

    .btn-dashboard {
      background: transparent;
      color: white;
      border: 1px solid white;
      border-radius: 8px;
      padding: 0.4rem 0.8rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s, transform 0.2s;
    }
    .btn-dashboard:hover {
      background: white;
      color: #1e293b;
      transform: translateY(-2px);
    }

    .btn-dashboard-card {
      background-color: #10b981;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 0.75rem;
      font-weight: 500;
      cursor: pointer;
      margin-top: 0.5rem;
      transition: background 0.2s, transform 0.2s;
      width: 100%;
    }

    .user-menu {
      position: relative;
      cursor: pointer;
    }

    .user-icon {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background-color: white;
      padding: 4px;
      transition: transform 0.2s;
    }

    .user-icon:hover {
      transform: scale(1.1);
    }

    .menu-dropdown {
      position: absolute;
      top: 50px;
      right: 0;
      background-color: white;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      width: 180px;
      overflow: hidden;
      animation: fadeIn 0.2s ease-in-out;
      z-index: 10;
    }

    .menu-item {
      padding: 0.8rem 1rem;
      font-size: 0.95rem;
      color: #1f2937;
      transition: background 0.2s;
    }

    .menu-item:hover {
      background-color: #f3f4f6;
    }

    .menu-item.logout {
      color: #dc2626;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-5px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* PERFIL */
    .profile-page { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f3f4f6; font-family: 'Segoe UI', Roboto, sans-serif; padding: 1rem; }
    .profile-card { background: white; border-radius: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.12); padding: 2.5rem; max-width: 480px; width: 100%; text-align: center; }
    .profile-header { margin-bottom: 1.8rem; }
    .profile-pic { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 3px solid #2563eb; margin-bottom: 0.7rem; }
    .profile-header h2 { margin: 0.3rem 0; color: #1f2937; font-size: 1.5rem; font-weight: 600; }
    .user-role { color: #64748b; font-size: 0.95rem; }

    .profile-info { text-align: left; margin-top: 1.5rem; margin-bottom: 1.8rem; display: flex; flex-direction: column; gap: 0.5rem; }
    .info-item { display: flex; justify-content: space-between; align-items: center; }
    label { font-weight: 500; color: #475569; }
    input[type="text"], input[type="email"], input[type="tel"] { flex: 1; margin-left: 0.5rem; padding: 0.5rem 0.8rem; border: 1px solid #d1d5db; border-radius: 8px; }
    input[type="file"] { margin-left: 0.5rem; }

    button { padding: 0.75rem; border: none; border-radius: 8px; font-weight: 500; cursor: pointer; background-color: #2563eb; color: white; margin-top: 1rem; transition: background 0.2s, transform 0.2s; }
    button:hover { background-color: #1e40af; transform: translateY(-2px); }
    button.logout { background-color: #dc2626; margin-top: 0.5rem; }
    button.logout:hover { background-color: #b91c1c; transform: translateY(-2px); }

    .message { margin-top: 1rem; color: #ef4444; font-weight: 500; text-align: center; }
    .error { color: #dc2626; font-size: 0.85rem; margin-bottom: 0.5rem; }
  `]
})
export class PerfilComponent implements OnInit {
  user: any = {
    nombre: '',
    apellidos: '',
    correo: '',
    telefono: '',
    ciudad: '',
    foto: '',
    fechaRegistro: ''
  };
  message = '';
  errores: any = {};
  menuOpen = false;
  isLoggedIn = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;

    if (userData && token) {
      this.user = JSON.parse(userData);
    } 
  }

  guardarCambios() {
    this.errores = {};
    this.message = '';

    if (!this.user.nombre.trim()) this.errores.nombre = '❌ El nombre es obligatorio';
    if (!this.user.apellidos.trim()) this.errores.apellidos = '❌ Los apellidos son obligatorios';
    if (!this.user.correo.trim()) this.errores.correo = '❌ El correo es obligatorio';
    else if (!this.validarEmail(this.user.correo)) this.errores.correo = '❌ Correo inválido';
    if (!this.user.telefono.trim()) this.errores.telefono = '❌ El teléfono es obligatorio';
    else if (!this.validarTelefono(this.user.telefono)) this.errores.telefono = '❌ Teléfono inválido';
    if (!this.user.ciudad.trim()) this.errores.ciudad = '❌ La ciudad es obligatoria';

    if (Object.keys(this.errores).length > 0) {
      this.message = '❌ Corrige los errores antes de guardar';
      return;
    }

    localStorage.setItem('user', JSON.stringify(this.user));
    this.message = '✅ Cambios guardados correctamente';

    setTimeout(() => this.router.navigate(['/dashboard']), 1000);
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

  validarEmail(email: string): boolean {
    const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return re.test(email);
  }

  validarTelefono(telefono: string): boolean {
    const re = /^[0-9]{7,15}$/;
    return re.test(telefono);
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
