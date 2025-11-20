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
    <h1 class="app-title">⚡ Almacén Electrónico</h1>
    <div class="menu-carrito-container">
      <!-- Mostrar carrito solo si está logueado y NO es admin -->
      <div *ngIf="isLoggedIn && isCliente" class="carrito-icon" (click)="toggleCarrito()">
        🛒 <span class="carrito-count">{{ carrito.length }}</span>
      </div>

      <div class="user-menu" (click)="toggleMenu()">
        <img src="https://cdn-icons-png.flaticon.com/512/847/847969.png" class="user-icon" />
        <div class="menu-dropdown" *ngIf="menuOpen" (click)="$event.stopPropagation()">
          <ng-container *ngIf="isLoggedIn; else notLogged">
            <div class="menu-item" (click)="goToProfile()">👤 Mi perfil</div>
            <div *ngIf="isCliente" class="menu-item" (click)="goToMisPedidos()">📦 Mis pedidos</div>

            <!-- Opciones de administración -->
            <div *ngIf="isAdmin" class="menu-separator"></div>
            <div *ngIf="isAdmin" class="menu-item" (click)="goToGestion('clientes')">👥 Gestión de Clientes</div>
            <div *ngIf="isAdmin  || isTrabajador" class="menu-item" (click)="goToGestion('productos')">📦 Gestión de Productos</div>
            <div *ngIf="isAdmin || isTrabajador" class="menu-item" (click)="goToGestion('pedidos')">🧾 Gestión de Pedidos</div>

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
    <!-- CARRUSEL DE PRODUCTOS DESTACADOS -->
    <div class="carousel-container">
      <div class="carousel-wrapper">
        <button class="carousel-btn prev" (click)="prevSlide()">❮</button>
        
        <div class="carousel-track" [style.transform]="'translateX(-' + (currentSlide * 100) + '%)'">
          <div class="carousel-slide" *ngFor="let slide of carouselSlides">
            <div class="slide-content" [style.background]="slide.gradient">
              <div class="slide-text">
                <h2 class="slide-title">{{ slide.title }}</h2>
                <p class="slide-description">{{ slide.description }}</p>
                <div class="slide-badge">{{ slide.badge }}</div>
              </div>
              <div class="slide-image">
                <img [src]="slide.image" [alt]="slide.title" />
              </div>
            </div>
          </div>
        </div>

        <button class="carousel-btn next" (click)="nextSlide()">❯</button>
      </div>
      
      <div class="carousel-indicators">
        <span 
          *ngFor="let slide of carouselSlides; let i = index" 
          class="indicator" 
          [class.active]="i === currentSlide"
          (click)="goToSlide(i)">
        </span>
      </div>
    </div>

    <!-- SECCIÓN DE FILTROS Y BÚSQUEDA -->
    <div *ngIf="isCliente" class="filtros-container">
      <div class="filtros-header">
        <h2>🔍 Buscar y Filtrar Productos</h2>
      </div>

      <div class="filtros-content">
        <!-- BUSCADOR -->
        <div *ngIf="isCliente" class="search-box">
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

  <!-- Partículas de fondo animadas -->
  <div class="particles">
    <div class="particle" *ngFor="let p of particles" 
         [style.left.%]="p.x" 
         [style.animation-delay]="p.delay"
         [style.animation-duration]="p.duration">
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
  background: 
    linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.92)),
    url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&h=1080&fit=crop') center/cover fixed;
  color: #1f2937;
  position: relative;
  overflow-x: hidden;
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

/* BARRA SUPERIOR */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  color: #1f2937;
  padding: 1rem 2rem;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.app-title {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: none;
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
  background: rgba(102, 126, 234, 0.1);
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
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
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
  background: #f3f4f6;
  color: #667eea;
  padding-left: 1.5rem;
  border-left: 3px solid #667eea;
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
  position: relative;
  z-index: 1;
}

/* CARRUSEL */
.carousel-container {
  margin-bottom: 3rem;
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.carousel-wrapper {
  position: relative;
  width: 100%;
  height: 450px;
  overflow: hidden;
  background: rgba(15, 15, 35, 0.5);
}

.carousel-track {
  display: flex;
  transition: transform 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  height: 100%;
}

.carousel-slide {
  min-width: 100%;
  height: 100%;
}

.slide-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 3rem 4rem;
  position: relative;
  overflow: hidden;
}

.slide-text {
  flex: 1;
  z-index: 2;
  animation: slideInLeft 0.8s ease;
}

@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-50px); }
  to { opacity: 1; transform: translateX(0); }
}

.slide-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin: 0 0 1rem 0;
  color: white;
  text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
  line-height: 1.2;
}

.slide-description {
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 1.5rem 0;
  max-width: 500px;
  text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.5);
}

.slide-badge {
  display: inline-block;
  padding: 0.7rem 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 30px;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.slide-image {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  animation: float 3s ease-in-out infinite;
}

.slide-image img {
  max-width: 100%;
  max-height: 350px;
  object-fit: contain;
  filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.5));
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 5px 20px rgba(255, 255, 255, 0.3);
}

.carousel-btn.prev { left: 20px; }
.carousel-btn.next { right: 20px; }

.carousel-indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 10;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: all 0.3s;
}

.indicator:hover {
  background: rgba(255, 255, 255, 0.6);
  transform: scale(1.2);
}

.indicator.active {
  background: white;
  width: 30px;
  border-radius: 6px;
}

/* FILTROS */
.filtros-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 1rem 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  animation: fadeInUp 0.5s ease;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.filtros-header h2 {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #1f2937;
}

.filtros-content {
  display: grid;
  grid-template-columns: 2fr 1fr auto;
  gap: 1rem;
  align-items: end;
}

/* BUSCADOR */
.search-box {
  position: relative;
  width: 90%;
} 

.search-input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.95rem;
  transition: all 0.3s;
  background: white;
  color: #1f2937;
}

.search-input::placeholder {
  color: #9ca3af;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.clear-btn {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  font-size: 1.1rem;
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
  gap: 0.5rem;
}

.filter-label {
  font-weight: 600;
  color: #4b5563;
  font-size: 0.85rem;
  margin-bottom: -0.25rem;
}

.select-tipo {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  background: white;
  color: #1f2937;
  cursor: pointer;
  transition: all 0.3s;
}

.select-tipo option {
  background: white;
  color: #1f2937;
}

.select-tipo:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* RESULTADOS */
.resultados-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;
}

.resultados-count {
  font-weight: 600;
  color: #667eea;
  font-size: 0.9rem;
  white-space: nowrap;
}

.reset-filters-btn {
  padding: 0.5rem 0.9rem;
  border: none;
  border-radius: 8px;
  background: #f3f4f6;
  color: #4b5563;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.85rem;
  transition: all 0.2s;
  white-space: nowrap;
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
  background: #ff4444;
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
  box-shadow: 0 0 10px rgba(255, 68, 68, 0.8);
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
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
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
  background: rgba(15, 15, 35, 0.98);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
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
  border-bottom: 1px solid rgba(102, 126, 234, 0.2);
}

.modal-header h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.close-icon {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.6);
  padding: 0.25rem;
  transition: color 0.2s;
}

.close-icon:hover {
  color: #ff4444;
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
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 12px;
  transition: all 0.2s;
}

.item-carrito:hover {
  background: rgba(102, 126, 234, 0.15);
  transform: translateX(4px);
  border-color: rgba(102, 126, 234, 0.4);
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.item-nombre {
  font-weight: 600;
  color: white;
}

.item-tipo {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.item-precio {
  font-weight: 700;
  color: #00f5ff;
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
  color: white;
  margin: 0.5rem 0;
}

.carrito-vacio small {
  color: rgba(255, 255, 255, 0.5);
}

.modal-footer {
  border-top: 2px solid rgba(102, 126, 234, 0.2);
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
  color: rgba(255, 255, 255, 0.8);
}

.total-amount {
  font-weight: 700;
  color: white;
  font-size: 1.5rem;
}

.btn-comprar {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #00f5ff 100%);
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  position: relative;
  overflow: hidden;
}

.btn-comprar::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
}

.btn-comprar:hover::before {
  left: 100%;
}

.btn-comprar:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(102, 126, 234, 0.6);
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

  .carousel-wrapper {
    height: 350px;
  }

  .slide-content {
    flex-direction: column;
    padding: 2rem 1.5rem;
    text-align: center;
  }

  .slide-title {
    font-size: 2rem;
  }

  .slide-description {
    font-size: 1rem;
  }

  .slide-image img {
    max-height: 200px;
  }

  .carousel-btn {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }

  .carousel-btn.prev { left: 10px; }
  .carousel-btn.next { right: 10px; }

  .filtros-container {
    padding: 1rem;
  }

  .filtros-content {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .resultados-info {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
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

  // CARRUSEL
  currentSlide = 0;
  carouselInterval: any;

  carouselSlides = [
    {
      title: 'Gaming de Alta Gama',
      description: 'Las últimas tarjetas gráficas RTX y componentes premium para gaming extremo',
      badge: '🎮 Ofertas Especiales',
      image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&h=400&fit=crop',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      title: 'Periféricos Pro',
      description: 'Teclados mecánicos, ratones gaming y auriculares con audio 7.1',
      badge: '⚡ Nuevo Stock',
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=400&fit=crop',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      title: 'Monitores 4K',
      description: 'Pantallas de alto rendimiento con 144Hz y tecnología HDR',
      badge: '🖥️ Lo Más Vendido',
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&h=400&fit=crop',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      title: 'Setup Completo',
      description: 'Todo lo que necesitas para tu estación de trabajo perfecta',
      badge: '💼 Para Profesionales',
      image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=600&h=400&fit=crop',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    }
  ];

  // Partículas animadas
  particles = Array.from({ length: 50 }, (_, i) => ({
    x: Math.random() * 100,
    delay: `${Math.random() * 20}s`,
    duration: `${15 + Math.random() * 10}s`
  }));

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
    
    // Iniciar carrusel automático
    this.startCarousel();
  }

  ngOnDestroy() {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }

  // MÉTODOS DEL CARRUSEL
  startCarousel() {
    this.carouselInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.carouselSlides.length;
  }

  prevSlide() {
    this.currentSlide = this.currentSlide === 0 
      ? this.carouselSlides.length - 1 
      : this.currentSlide - 1;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
    // Reiniciar el auto-play
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
      this.startCarousel();
    }
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

    this.http.post('http://localhost:8080/api/pedidos', pedidoBody, { headers }).subscribe({
      next: (res: any) => {
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
    console.log('Navegando a:', path);
    this.router.navigateByUrl(`/admin/${path}`);
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