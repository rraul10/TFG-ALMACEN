import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@core/services/auth.service';
import { RoleService } from '@core/services/role.service';
import { ProductosListComponent } from '../../features/productos/productos-list.component';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    CurrencyPipe,
    FormsModule,
    ProductosListComponent,
    HttpClientModule,
    MatSnackBarModule
  ],
  template: `
  <div class="dashboard-layout">
    <!-- BARRA SUPERIOR -->
    <header class="navbar">
      <h1 class="app-title">📦 Almacén electrónico</h1>
      <div class="menu-carrito-container">
        <!-- Mostrar carrito solo si está logueado y NO es admin -->
        <div *ngIf="isLoggedIn && isCliente" class="carrito-icon" (click)="toggleCarrito()">
          🛒 <span class="carrito-count">{{ carrito.length }}</span>
        </div>

        <div class="user-menu" (click)="toggleMenu()">
          <img src="https://cdn-icons-png.flaticon.com/512/847/847969.png" class="user-icon" />
          <div class="menu-dropdown" *ngIf="menuOpen">
            <ng-container *ngIf="isLoggedIn; else notLogged">
              <div class="menu-item" (click)="goToProfile()">👤 Mi perfil</div>
              <div *ngIf="isCliente" class="menu-item" (click)="goToMisPedidos()">📦 Mis pedidos</div>

              <!-- Opciones de administración -->
              <div *ngIf="isAdmin" class="menu-separator"></div>
              <div *ngIf="isAdmin" class="menu-item" (click)="goToGestion('clientes')">👥 Gestión de Clientes</div>
              <div *ngIf="isAdmin" class="menu-item" (click)="goToGestion('productos')">📦 Gestión de Productos</div>
              <div *ngIf="isAdmin" class="menu-item" (click)="goToGestion('pedidos')">🧾 Gestión de Pedidos</div>

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
      <!-- SECCIÓN DE FILTROS Y BÚSQUEDA -->
      <div *ngIf="isCliente" class="filtros-container">
        <div class="filtros-header">
          <h2>🔍 Buscar y Filtrar Productos</h2>
        </div>
        
        <div class="filtros-content">
          <!-- BUSCADOR -->
            <div *ngIf="isCliente"  class="search-box">
            <input 
              type="text" 
              [(ngModel)]="searchTerm" 
              (ngModelChange)="applyFilters()"
              placeholder="🔎 Buscar por nombre..."
              class="search-input"
            />
            <button *ngIf="searchTerm" (click)="clearSearch()" class="clear-btn">✖</button>
          </div>

          <!-- FILTRO POR TIPO -->
          <div *ngIf="isCliente" class="tipo-filter">
            <label class="filter-label">Filtrar por tipo:</label>

            <select 
              [(ngModel)]="tipoSeleccionado" 
              (change)="applyFilters()"
              class="select-tipo"
            >
              <option value="">Todos</option>
              <option *ngFor="let tipo of tiposDisponibles" [value]="tipo">
                {{ tipo }}
              </option>
            </select>
          </div>

          <!-- CONTADOR DE RESULTADOS -->
          <div class="resultados-info">
            <span class="resultados-count">
              {{ productosFiltrados.length }} producto(s) encontrado(s)
            </span>
            <button 
              *ngIf="searchTerm || tipoSeleccionado" 
              (click)="clearAllFilters()" 
              class="reset-filters-btn"
            >
              🔄 Limpiar filtros
            </button>
          </div>
        </div>
      </div>

      <!-- GRID DE PRODUCTOS PAGINADO -->
      <app-productos-list 
        [searchTerm]="searchTerm" 
        [tipoSeleccionado]="tipoSeleccionado"
        (productosFiltered)="onProductosFiltered($event)">
      </app-productos-list>
    </main>

    <!-- MODAL CARRITO -->
    <div *ngIf="carritoOpen && isLoggedIn && isCliente" class="modal-overlay" (click)="toggleCarrito()">
      <div class="modal-carrito" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>🛒 Tu Carrito</h3>
          <button class="close-icon" (click)="toggleCarrito()">✖</button>
        </div>
        
        <div class="modal-body">
          <div *ngIf="carrito.length > 0; else carritoVacio">
            <div class="item-carrito" *ngFor="let item of carrito; let i = index">
              <div class="item-info">
                <span class="item-nombre">{{ item.nombre }}</span>
                <span class="item-tipo">{{ item.tipo }}</span>
              </div>
              <div class="item-actions">
                <span class="item-precio">{{ item.precio | currency:'EUR' }}</span>
                <button (click)="eliminarDelCarrito(i)" class="delete-btn">🗑️</button>
              </div>
            </div>
            
            <div class="modal-footer">
              <div class="total">
                <span>Total:</span>
                <span class="total-amount">{{ carritoTotal() | currency:'EUR' }}</span>
              </div>
              <button class="btn-comprar" (click)="comprar()">
                <span>🛒 Realizar Pedido</span>
              </button>
            </div>
          </div>
          
          <ng-template #carritoVacio>
            <div class="carrito-vacio">
              <div class="vacio-icon">🛒</div>
              <p>Tu carrito está vacío</p>
              <small>Agrega productos para comenzar</small>
            </div>
          </ng-template>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [`
  .dashboard-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    font-family: 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #1f2937;
  }

  /* BARRA SUPERIOR */
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    color: #1f2937;
    padding: 1rem 2rem;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .select-tipo {
    width: 100%;
    padding: 0.9rem 1rem;
    font-size: 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    background: white;
    cursor: pointer;
    transition: all 0.3s;
  }

  .select-tipo:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
  }


  .app-title {
    margin: 0;
    font-size: 1.8rem;
    font-weight: 700;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .menu-carrito-container {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .user-menu {
    position: relative;
    cursor: pointer;
  }

  .user-icon {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 2px solid #667eea;
    padding: 2px;
    transition: all 0.3s ease;
  }

  .user-icon:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  }

  .menu-dropdown {
    position: absolute;
    top: 55px;
    right: 0;
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    width: 220px;
    overflow: hidden;
    animation: slideDown 0.3s ease;
    z-index: 10;
  }

  .menu-item {
    padding: 0.9rem 1.2rem;
    font-size: 1rem;
    color: #1f2937;
    cursor: pointer;
    transition: all 0.2s;
  }

  .menu-item:hover { 
    background-color: #f3f4f6; 
    color: #667eea;
    padding-left: 1.5rem;
  }
  
  .menu-item.logout { 
    color: #dc2626; 
    font-weight: 500;
    border-top: 1px solid #e5e7eb;
  }

  .menu-separator {
    height: 1px;
    background: #e5e7eb;
    margin: 0.5rem 0;
  }

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* CONTENIDO PRINCIPAL */
  .main-content {
    flex: 1;
    width: 100%;
    max-width: 1400px;
    margin: 2rem auto;
    padding: 0 1.5rem;
  }

  /* FILTROS */
  .filtros-container {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 8px 30px rgba(0,0,0,0.12);
    animation: fadeInUp 0.5s ease;
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .filtros-header h2 {
    margin: 0 0 1.5rem 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
  }

  .filtros-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  /* BUSCADOR */
  .search-box {
    position: relative;
    width: 100%;
  }

  .search-input {
    width: 100%;
    padding: 1rem 3rem 1rem 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    font-size: 1rem;
    transition: all 0.3s;
    background: white;
  }

  .search-input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  .clear-btn {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #9ca3af;
    cursor: pointer;
    font-size: 1.2rem;
    padding: 0.25rem;
    transition: color 0.2s;
  }

  .clear-btn:hover {
    color: #dc2626;
  }

  /* FILTRO POR TIPO */
  .tipo-filter {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .filter-label {
    font-weight: 600;
    color: #4b5563;
    font-size: 0.95rem;
  }

  .tipo-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .chip {
    padding: 0.5rem 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 20px;
    background: white;
    color: #4b5563;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.3s;
  }

  .chip:hover {
    border-color: #667eea;
    background: #f0f4ff;
    transform: translateY(-2px);
  }

  .chip.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-color: transparent;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }

  /* RESULTADOS */
  .resultados-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
  }

  .resultados-count {
    font-weight: 600;
    color: #667eea;
    font-size: 1rem;
  }

  .reset-filters-btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 8px;
    background: #f3f4f6;
    color: #4b5563;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s;
  }

  .reset-filters-btn:hover {
    background: #e5e7eb;
    transform: translateY(-1px);
  }

  /* CARRITO */
  .carrito-icon {
    position: relative;
    font-size: 1.8rem;
    cursor: pointer;
    transition: transform 0.2s;
  }

  .carrito-icon:hover {
    transform: scale(1.1);
  }

  .carrito-count {
    position: absolute;
    top: -8px;
    right: -8px;
    background: #dc2626;
    color: white;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 700;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }

  /* MODAL */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .modal-carrito {
    background: white;
    border-radius: 20px;
    width: 90%;
    max-width: 500px;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    animation: slideUp 0.3s ease;
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(50px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .modal-header h3 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
  }

  .close-icon {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #9ca3af;
    padding: 0.25rem;
    transition: color 0.2s;
  }

  .close-icon:hover {
    color: #dc2626;
  }

  .modal-body {
    padding: 1.5rem;
    overflow-y: auto;
    flex: 1;
  }

  .item-carrito {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    margin-bottom: 0.75rem;
    background: #f9fafb;
    border-radius: 12px;
    transition: all 0.2s;
  }

  .item-carrito:hover {
    background: #f3f4f6;
    transform: translateX(4px);
  }

  .item-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .item-nombre {
    font-weight: 600;
    color: #1f2937;
  }

  .item-tipo {
    font-size: 0.85rem;
    color: #6b7280;
  }

  .item-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .item-precio {
    font-weight: 700;
    color: #667eea;
    font-size: 1.1rem;
  }

  .delete-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
    padding: 0.25rem;
    transition: transform 0.2s;
  }

  .delete-btn:hover {
    transform: scale(1.2);
  }

  .carrito-vacio {
    text-align: center;
    padding: 3rem 1rem;
  }

  .vacio-icon {
    font-size: 4rem;
    opacity: 0.3;
    margin-bottom: 1rem;
  }

  .carrito-vacio p {
    font-size: 1.1rem;
    font-weight: 600;
    color: #4b5563;
    margin: 0.5rem 0;
  }

  .carrito-vacio small {
    color: #9ca3af;
  }

  .modal-footer {
    border-top: 2px solid #e5e7eb;
    padding-top: 1rem;
    margin-top: 1rem;
  }

  .total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }

  .total span:first-child {
    font-weight: 600;
    color: #4b5563;
  }

  .total-amount {
    font-weight: 700;
    color: #1f2937;
    font-size: 1.5rem;
  }

  .btn-comprar {
    width: 100%;
    padding: 1rem;
    border: none;
    border-radius: 12px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  }

  .btn-comprar:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }

  .btn-comprar:active {
    transform: translateY(0);
  }

  /* RESPONSIVE */
  @media (max-width: 768px) {
    .navbar {
      padding: 1rem;
    }

    .app-title {
      font-size: 1.3rem;
    }

    .filtros-container {
      padding: 1rem;
    }

    .tipo-chips {
      max-height: 200px;
      overflow-y: auto;
    }

    .modal-carrito {
      width: 95%;
      max-height: 90vh;
    }
  }
  `]
})
export class DashboardComponent {
  menuOpen = false;
  carritoOpen = false;
  isLoggedIn = false;
  isAdmin = false;
  isCliente = false;
  isTrabajador = false;
  carrito: any[] = [];
  
  // Filtros
  searchTerm: string = '';
  tipoSeleccionado: string = '';
  productosFiltrados: any[] = [];
  
  // Tipos disponibles basados en tu data.sql
  tiposDisponibles: string[] = [
    'Auriculares',
    'Teclado',
    'Ratón',
    'Monitor',
    'Tarjeta Gráfica',
    'Placa Base',
    'RAM',
    'SSD',
    'Fuente',
    'Refrigeración',
    'Caja PC',
    'Kit Periféricos',
    'Webcam',
    'Micrófono',
    'Altavoces',
    'Silla',
    'Tarjeta de Sonido',
    'Disco Externo'
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private roleService: RoleService,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private notificationService: NotificationService
  ) {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.isAdmin = this.authService.isAdmin();
    this.loadCarrito();
    window.addEventListener('carritoActualizado', () => this.loadCarrito());
  }

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.isAdmin = this.roleService.isAdmin();
    console.log('isAdmin en ngOnInit:', this.isAdmin);
    this.isCliente = this.roleService.isCliente();
    this.isTrabajador = this.roleService.isTrabajador();
    this.notificationService.notification$.subscribe((msg: string) => this.showNotification(msg));
  }

  // --- PAGINACIÓN ---
  currentPage: number = 1;
  pageSize: number = 16; // 4x4 grid
  productosPaginados: any[] = [];

  totalPages(): number {
    return Math.ceil(this.productosFiltrados.length / this.pageSize);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage = page;
    this.updatePaginacion();
    this.animatePageTurn();
  }

  updatePaginacion() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.productosPaginados = this.productosFiltrados.slice(start, end);
  }

  // Opcional: animación de "hojas girando"
  animatePageTurn() {
    const cards = document.querySelectorAll('.producto-card');
    cards.forEach(card => {
      card.classList.add('paginating');
      setTimeout(() => card.classList.remove('paginating'), 600);
    });
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

  // Métodos de filtrado
  selectTipo(tipo: string) {
    this.tipoSeleccionado = tipo;
    this.applyFilters();
  }

  clearSearch() {
    this.searchTerm = '';
    this.applyFilters();
  }

  clearAllFilters() {
    this.searchTerm = '';
    this.tipoSeleccionado = '';
    this.applyFilters();
  }

  applyFilters() {
    // Este método se comunica con el componente hijo
    // Los filtros se aplicarán en productos-list.component
  }

  onProductosFiltered(productos: any[]) {
    this.productosFiltrados = productos;
  }

  carritoTotal() { 
    return this.carrito.reduce((sum, item) => sum + item.precio, 0); 
  }
  
  eliminarDelCarrito(index: number) { 
    this.carrito.splice(index, 1); 
    this.updateCarrito(); 
  }
  
  updateCarrito() { 
    if (this.isLoggedIn) localStorage.setItem('carrito', JSON.stringify(this.carrito)); 
  }

  comprar() {
    if (!this.carrito.length) { 
      this.showNotification('El carrito está vacío 🛒'); 
      return; 
    }
    
    const token = localStorage.getItem('token');
    if (!token) { 
      this.showNotification('Debes iniciar sesión 🔐'); 
      return; 
    }

    const clienteId = 5;
    const pedidoBody = { 
      clienteId, 
      lineasVenta: this.carrito.map(item => ({ 
        productoId: item.id, 
        cantidad: item.cantidad || 1 
      })) 
    };
    
    const headers = new HttpHeaders({ 
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${token}` 
    });

    const snackRef = this.snackBar.open('⏳ Procesando tu pedido...', undefined, { 
      horizontalPosition: 'center', 
      verticalPosition: 'top', 
      panelClass: ['snackbar-grande'], 
      duration: undefined 
    });
    
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

  goToGestion(path: string): void {
  console.log('Navegando a:', path);  // Este log debería mostrarse al hacer clic
  this.router.navigate([`/admin/${path}`]);
}


  logout() {
    this.menuOpen = false;
    this.authService.logout();
    this.isLoggedIn = false;
    this.isAdmin = false;
    this.carrito = [];
    localStorage.removeItem('carrito');
    this.router.navigate(['/']);
  }
}