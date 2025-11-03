import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { AuthService } from '@core/services/auth.service';
import { ProductosListComponent } from '../../features/productos/productos-list.component';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    CurrencyPipe,
    ProductosListComponent,
    HttpClientModule,
    MatSnackBarModule
  ],
  template: `
  <div class="dashboard-layout">
    <!-- BARRA SUPERIOR -->
    <header class="navbar">
      <h1 class="app-title">📦 Gestión de Almacén</h1>
      <div class="menu-carrito-container">
        <div *ngIf="isLoggedIn" class="carrito-icon" (click)="toggleCarrito()">
          🛒 <span class="carrito-count">{{ carrito.length }}</span>
        </div>
        <div class="user-menu" (click)="toggleMenu()">
          <img src="https://cdn-icons-png.flaticon.com/512/847/847969.png" class="user-icon" />
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
      </div>
    </header>

    <!-- CONTENIDO PRINCIPAL -->
    <main class="main-content">
      <app-productos-list></app-productos-list>
    </main>

    <!-- MODAL CARRITO -->
    <div *ngIf="carritoOpen && isLoggedIn" class="modal-carrito">
      <h3>🛒 Tu Carrito</h3>
      <div *ngIf="carrito.length > 0; else carritoVacio">
        <div class="item-carrito" *ngFor="let item of carrito; let i = index">
          <span>{{ item.nombre }}</span>
          <span>{{ item.precio | currency:'EUR' }}</span>
          <button (click)="eliminarDelCarrito(i)">❌</button>
        </div>
        <div class="total">Total: {{ carritoTotal() | currency:'EUR' }}</div>
        <button class="btn-comprar" (click)="comprar()">🛒 Comprar</button>
      </div>
      <ng-template #carritoVacio>
        <p>Tu carrito está vacío</p>
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
    font-family: 'Segoe UI', Roboto, sans-serif;
    background: url('https://images.unsplash.com/photo-1581091215363-4d08367a6c05?auto=format&fit=crop&w=1470&q=80') no-repeat center center fixed;
    background-size: cover;
    color: #1f2937;
  }

  /* BARRA SUPERIOR */
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(30, 41, 59, 0.9);
    color: white;
    padding: 1rem 2rem;
    box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    position: sticky;
    top: 0;
    z-index: 100;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
  }

  .app-title {
    margin: 0;
    font-size: 1.8rem;
    font-weight: 700;
  }

  .menu-carrito-container {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .user-icon {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 2px solid white;
    padding: 2px;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .user-icon:hover {
    transform: scale(1.15);
    box-shadow: 0 4px 15px rgba(0,0,0,0.4);
  }

  .menu-dropdown {
    position: absolute;
    top: 55px;
    right: 0;
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(0,0,0,0.3);
    width: 220px;
    overflow: hidden;
    animation: fadeIn 0.25s ease-in-out;
    z-index: 10;
  }

  .menu-item {
    padding: 0.9rem 1.2rem;
    font-size: 1rem;
    color: #1f2937;
    transition: background 0.2s, color 0.2s;
  }

  .menu-item:hover { background-color: #f3f4f6; color: #2563eb; }
  .menu-item.logout { color: #dc2626; font-weight: 500; }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* CONTENIDO PRINCIPAL */
  .main-content {
    flex: 1;
    width: 100%;
    max-width: 1280px;
    margin: 2rem auto;
    padding: 0 1rem;
    background: rgba(255,255,255,0.85);
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
    backdrop-filter: blur(5px);
  }

  /* CARRITO */
  .carrito-icon {
    position: relative;
    font-size: 1.6rem;
    cursor: pointer;
  }

  .carrito-count {
    position: absolute;
    top: -8px;
    right: -8px;
    background: #dc2626;
    color: white;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.85rem;
  }

  .modal-carrito {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #f9fafb;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    z-index: 50;
    width: 360px;
    animation: fadeIn 0.25s ease-in-out;
  }

  .item-carrito {
    display: flex;
    justify-content: space-between;
    margin: 0.6rem 0;
    font-weight: 500;
  }

  .total {
    margin-top: 1rem;
    font-weight: 700;
    font-size: 1.1rem;
    text-align: right;
  }

  .btn-comprar, .btn-cerrar {
    margin-top: 1rem;
    padding: 0.65rem 1rem;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    width: 100%;
    font-weight: 600;
    transition: background 0.2s, transform 0.2s;
  }

  .btn-comprar { background-color: #2563eb; color: white; }
  .btn-comprar:hover { background-color: #1e40af; transform: translateY(-2px); }

  .btn-cerrar { background-color: #e2e8f0; }
  .btn-cerrar:hover { background-color: #cbd5e1; transform: translateY(-2px); }

  .snackbar-grande {
    font-size: 1.2rem;
    padding: 1rem 2rem;
    background-color: #1e293b !important;
    color: #fff !important;
    border-radius: 12px;
  }
  `]
})
export class DashboardComponent {
  menuOpen = false;
  carritoOpen = false;
  isLoggedIn = false;
  carrito: any[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private notificationService: NotificationService
  ) {
    this.isLoggedIn = !!localStorage.getItem('token');
    this.loadCarrito();
    window.addEventListener('carritoActualizado', () => this.loadCarrito());
  }

  ngOnInit() {
    this.notificationService.notification$.subscribe((msg: string) => this.showNotification(msg));
  }

  toggleMenu() { this.menuOpen = !this.menuOpen; }
  toggleCarrito() { this.carritoOpen = !this.carritoOpen; }

  showNotification(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['snackbar-grande']
    });
  }

  loadCarrito() {
    this.carrito = this.isLoggedIn ? JSON.parse(localStorage.getItem('carrito') || '[]') : [];
  }

  carritoTotal() { return this.carrito.reduce((sum, item) => sum + item.precio, 0); }
  eliminarDelCarrito(index: number) { this.carrito.splice(index, 1); this.updateCarrito(); }
  updateCarrito() { if (this.isLoggedIn) localStorage.setItem('carrito', JSON.stringify(this.carrito)); }

  comprar() {
    if (!this.carrito.length) { this.showNotification('El carrito está vacío 🛒'); return; }
    const token = localStorage.getItem('token');
    if (!token) { this.showNotification('Debes iniciar sesión 🔐'); return; }

    const clienteId = 5;
    const pedidoBody = { clienteId, lineasVenta: this.carrito.map(item => ({ productoId: item.id, cantidad: item.cantidad || 1 })) };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` });

    const snackRef = this.snackBar.open('⏳ Procesando tu pedido...', undefined, { horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['snackbar-grande'], duration: undefined });
    
    this.http.post<any>('http://localhost:8080/api/pedidos', pedidoBody, { headers }).subscribe({
      next: res => {
        snackRef.dismiss();
        this.carrito = [];
        localStorage.removeItem('carrito');
        this.carritoOpen = false;
        this.showNotification('✅ Pedido realizado correctamente');
        this.router.navigate(['/dashboard']);
        if (res.url) window.location.href = res.url;
      },
      error: err => {
        snackRef.dismiss();
        console.error('Error al realizar pedido', err);
        this.showNotification('❌ Hubo un error al realizar el pedido. Intenta de nuevo.');
      }
    });
  }

  goToLogin() { this.menuOpen = false; this.router.navigate(['/login']); }
  goToRegister() { this.menuOpen = false; this.router.navigate(['/register']); }
  goToProfile() { this.menuOpen = false; this.router.navigate(['/perfil']); }
  goToMisPedidos() { this.menuOpen = false; this.router.navigate(['/mispedidos']); }
  logout() { this.menuOpen = false; localStorage.removeItem('token'); this.isLoggedIn = false; this.carrito = []; localStorage.removeItem('carrito'); this.router.navigate(['/']); }
}
