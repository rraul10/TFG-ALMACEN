import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { AuthService } from '@core/services/auth.service';
import { ProductosListComponent } from '../../features/productos/productos-list.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface PedidoRequest {
  productos: { id: number; cantidad: number }[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,         
    CurrencyPipe,         
    ProductosListComponent,
    HttpClientModule
  ],
  template: `
    <div class="dashboard-layout">
      <!-- Barra superior -->
      <header class="navbar">
        <h1 class="app-title">📦 Gestión de Almacén</h1>

        <div class="menu-carrito-container">
          <!-- Icono de carrito, solo visible si el usuario está logueado -->
          <div *ngIf="isLoggedIn" class="carrito-icon" (click)="toggleCarrito()">
            🛒 <span class="carrito-count">{{ carrito.length }}</span>
          </div>

          <!-- Menú usuario -->
          <!-- Menú usuario -->
          <div class="user-menu" (click)="toggleMenu()">
            <img 
              src="https://cdn-icons-png.flaticon.com/512/847/847969.png" 
              alt="Usuario" 
              class="user-icon"
            />
            <div class="menu-dropdown" *ngIf="menuOpen">
              <!-- Mostrar opciones si el usuario está logueado -->
              <ng-container *ngIf="isLoggedIn; else notLogged">
                <div class="menu-item" (click)="goToProfile()">👤 Mi perfil</div>
                <div class="menu-item logout" (click)="logout()">🚪 Cerrar sesión</div>
              </ng-container>

              <!-- Si no está logueado -->
              <ng-template #notLogged>
                <div class="menu-item" (click)="goToLogin()">🔐 Iniciar sesión</div>
                <div class="menu-item" (click)="goToRegister()">📝 Registrarse</div>
              </ng-template>
            </div>
          </div>
        </div>
      </header>

      <!-- Contenido principal -->
      <main class="main-content">
        <app-productos-list></app-productos-list> <!-- Los productos siempre se muestran -->
      </main>

      <!-- Modal de carrito, solo visible si el usuario está logueado -->
      <div *ngIf="carritoOpen && isLoggedIn" class="modal-carrito">
        <h3>🛒 Tu Carrito</h3>
        <div *ngIf="carrito.length > 0; else carritoVacio">
          <div class="item-carrito" *ngFor="let item of carrito; let i = index">
            <span>{{ item.nombre }}</span>
            <span>{{ item.precio | currency:'EUR' }}</span>
            <button (click)="eliminarDelCarrito(i)">❌</button>
          </div>
          <div class="total">
            Total: {{ carritoTotal() | currency:'EUR' }}
          </div>
          <button class="btn-comprar" (click)="comprar()">🛒 Comprar</button>
        </div>
        <ng-template #carritoVacio>
          <p>El carrito está vacío</p>
        </ng-template>
        <button class="btn-cerrar" (click)="toggleCarrito()">Cerrar</button>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-layout {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: #f3f4f6;
      font-family: 'Segoe UI', Roboto, sans-serif;
    }

    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #1e293b;
      color: white;
      padding: 0.8rem 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }

    .app-title {
      margin: 0;
      font-size: 1.6rem;
      font-weight: 700;
    }

    .menu-carrito-container {
      display: flex;
      align-items: center;
      gap: 1rem;
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
      width: 200px;
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

    .main-content {
      flex: 1;
      width: 100%;
      max-width: 1280px;
      margin: 2rem auto;
      padding: 0 1rem;
      display: block;
    }

    .carrito-icon {
      position: relative;
      font-size: 1.6rem;
      cursor: pointer;
    }

    .carrito-count {
      position: absolute;
      top: -8px;
      right: -8px;
      background: red;
      color: white;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
    }

    .modal-carrito {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border-radius: 12px;
      padding: 1rem 2rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      z-index: 50;
      width: 320px;
    }

    .item-carrito {
      display: flex;
      justify-content: space-between;
      margin: 0.5rem 0;
    }

    .total {
      margin-top: 1rem;
      font-weight: bold;
      text-align: right;
    }

    .btn-comprar, .btn-cerrar {
      margin-top: 1rem;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      width: 100%;
    }

    .btn-comprar {
      background: #16a34a;
      color: white;
    }

    .btn-comprar:hover {
      background: #15803d;
    }

    .btn-cerrar {
      background: #e2e8f0;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-5px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class DashboardComponent {
  menuOpen = false;
  carritoOpen = false;
  isLoggedIn = false;
  carrito: any[] = [];

  constructor(private router: Router, private authService: AuthService, private http: HttpClient) {
    this.isLoggedIn = !!localStorage.getItem('token');
    this.loadCarrito();
    window.addEventListener('carritoActualizado', () => this.loadCarrito());
  }

  // Métodos de UI
  toggleMenu() { this.menuOpen = !this.menuOpen; }
  toggleCarrito() { this.carritoOpen = !this.carritoOpen; }

  // Cargar y actualizar el carrito
  loadCarrito() {
    if (this.isLoggedIn) {
      this.carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    } else {
      this.carrito = [];
    }
  }

  // Calcular el total del carrito
  carritoTotal() {
    return this.carrito.reduce((sum, item) => sum + item.precio, 0);
  }

  // Eliminar producto del carrito
  eliminarDelCarrito(index: number) {
    this.carrito.splice(index, 1);
    this.updateCarrito();
  }

  // Actualizar carrito en el almacenamiento local
  updateCarrito() {
    if (this.isLoggedIn) {
      localStorage.setItem('carrito', JSON.stringify(this.carrito));
    }
  }

  // Realizar compra
  comprar() {
    if (!this.carrito.length) {
      return alert('El carrito está vacío');
    }

    const pedido: PedidoRequest = {
      productos: this.carrito.map(p => ({ id: p.id, cantidad: 1 }))
    };

    this.http.post('http://localhost:8080/api/pedidos', pedido).subscribe({
      next: () => {
        alert('Pedido realizado correctamente ✅');
        this.carrito = [];
        localStorage.removeItem('carrito');
        this.carritoOpen = false;
      },
      error: err => {
        console.error('Error al realizar pedido', err);
        alert('Hubo un error al realizar el pedido. Intenta de nuevo.');
      }
    });
  }

  // Navegación
  goToLogin() { this.menuOpen = false; this.router.navigate(['/login']); }
  goToRegister() { this.menuOpen = false; this.router.navigate(['/register']); }
  goToProfile() { this.menuOpen = false; this.router.navigate(['/perfil']); }
  logout() { 
    this.menuOpen = false; 
    localStorage.removeItem('token'); 
    this.isLoggedIn = false; 
    this.carrito = [];
    localStorage.removeItem('carrito');
    this.router.navigate(['/']);
  }
}