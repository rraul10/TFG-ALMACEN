import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@core/services/auth.service';
import { RoleService } from '@core/services/role.service';
import { ProductosListComponent } from '../../features/productos/productos-list.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule, CurrencyPipe, FormsModule, ProductosListComponent, MatSnackBarModule],
  template: `
<div class="dashboard-layout">
  <!-- BARRA SUPERIOR -->
  <header class="navbar">
    <div class="nav-left">
      <div class="logo-container">
        <span class="logo-icon">⚡</span>
        <div class="logo-text">
          <h1 class="app-title">TechStore</h1>
          <span class="app-subtitle">Premium Electronics</span>
        </div>
      </div>
    </div>
    
    <div class="nav-right">
      <div *ngIf="isLoggedIn && isCliente" class="carrito-wrapper" (click)="toggleCarrito()">
        <div class="carrito-icon-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <span class="carrito-badge" *ngIf="carrito.length">{{ carrito.length }}</span>
        </div>
      </div>

      <div class="user-menu" (click)="toggleMenu()">
        <div class="avatar-btn">
          <img [src]="user?.foto || 'https://cdn-icons-png.flaticon.com/512/847/847969.png'" class="user-icon" />
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
            <div class="menu-item" (click)="goToProfile()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Mi perfil
            </div>
            <div *ngIf="isCliente" class="menu-item" (click)="goToMisPedidos()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
              Mis pedidos
            </div>
            <div *ngIf="isAdmin || isTrabajador" class="menu-divider"></div>
            <div *ngIf="isAdmin" class="menu-item" (click)="goToGestion('clientes')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              Gestión Usuarios
            </div>
            <div *ngIf="isAdmin || isTrabajador" class="menu-item" (click)="goToGestion('productos')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
              Gestión Productos
            </div>
            <div *ngIf="isAdmin || isTrabajador" class="menu-item" (click)="goToGestion('pedidos')">
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

  <!-- CONTENIDO PRINCIPAL -->
  <main class="main-content">
    <!-- HERO CARRUSEL -->
    <section class="hero-carousel">
      <div class="carousel-inner">
        <div class="carousel-track" [style.transform]="'translateX(-' + (currentSlide * 100) + '%)'">
          <div class="carousel-slide" *ngFor="let slide of carouselSlides">
            <div class="slide-bg" [style.background]="slide.gradient"></div>
            <div class="slide-content">
              <div class="slide-info">
                <span class="slide-badge">{{ slide.badge }}</span>
                <h2 class="slide-title">{{ slide.title }}</h2>
                <p class="slide-desc">{{ slide.description }}</p>
                <button class="slide-cta">Ver ofertas →</button>
              </div>
              <div class="slide-visual">
                <img [src]="slide.image" [alt]="slide.title" />
              </div>
            </div>
          </div>
        </div>
        
        <button class="nav-btn prev" (click)="prevSlide()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <button class="nav-btn next" (click)="nextSlide()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>
      
      <div class="carousel-dots">
        <button *ngFor="let s of carouselSlides; let i = index" 
                class="dot" [class.active]="i === currentSlide" 
                (click)="goToSlide(i)"></button>
      </div>
    </section>

    <!-- FILTROS MODERNOS -->
    <section *ngIf="isCliente" class="filters-section">
      <div class="filters-bar">
        <div class="search-wrapper">
          <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input type="text" [(ngModel)]="searchTerm" (ngModelChange)="applyFilters()" placeholder="Buscar productos..." class="search-input"/>
          <button *ngIf="searchTerm" class="clear-search" (click)="clearSearch()">×</button>
        </div>

        <div class="filter-group">
          <select [(ngModel)]="tipoSeleccionado" (change)="applyFilters()" class="filter-select">
            <option value="">Categorías</option>
            <option *ngFor="let tipo of tiposDisponibles" [value]="tipo">{{ tipo }}</option>
          </select>
        </div>

        <div class="filter-group">
          <select [(ngModel)]="ordenSeleccionado" (change)="applyFilters()" class="filter-select">
            <option value="">Ordenar por..</option>
            <option value="precio-asc">Precio: Menor a Mayor</option>
            <option value="precio-desc">Precio: Mayor a Menor</option>
            <option value="nombre-asc">Nombre: A - Z</option>
            <option value="nombre-desc">Nombre: Z - A</option>
          </select>
        </div>

        <div class="results-count" [class.hidden]="productosFiltrados.length === 0">
          <span class="count">{{ productosFiltrados.length }}</span> productos
        </div>


        <button *ngIf="searchTerm || tipoSeleccionado || ordenSeleccionado" (click)="clearAllFilters()" class="clear-all-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          Limpiar
        </button>
      </div>
    </section>

    <!-- PRODUCTOS -->
    <app-productos-list
      [searchTerm]="searchTerm"
      [tipoSeleccionado]="tipoSeleccionado"
      [ordenSeleccionado]="ordenSeleccionado"
      (productosFiltered)="onProductosFiltered($event)">
    </app-productos-list>
    <!-- MODAL PRODUCTO -->
    <div *ngIf="productoModalOpen" class="product-modal-overlay" (click)="cerrarProductoModal()">
      <div class="product-modal" (click)="$event.stopPropagation()">
        <button class="close-btn" (click)="cerrarProductoModal()">×</button>
        <div class="modal-content">
          <h2>{{ selectedProducto?.nombre }}</h2>
          <img [src]="selectedProducto?.imagen" alt="{{ selectedProducto?.nombre }}" />
          <p>Tipo: {{ selectedProducto?.tipo }}</p>
          <p>Precio: {{ selectedProducto?.precio | currency:'EUR' }}</p>
          <p>{{ selectedProducto?.descripcion }}</p>
          <button (click)="agregarAlCarrito(selectedProducto)">Añadir al carrito 🛒</button>
        </div>
      </div>
    </div>

  </main>

  <!-- MODAL CARRITO -->
  <div *ngIf="carritoOpen && isLoggedIn && isCliente" class="cart-overlay" (click)="toggleCarrito()">
    <div class="cart-modal" (click)="$event.stopPropagation()">
      <div class="cart-header">
        <h3>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          Tu Carrito
        </h3>
        <button class="close-btn" (click)="toggleCarrito()">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>

      <div class="cart-body">
        <div *ngIf="carrito.length > 0; else emptyCart" class="cart-items">
          <div class="cart-item" *ngFor="let item of carrito; let i = index">
            <div class="item-details">
              <span class="item-name">
                {{ item.nombre }}
                <span *ngIf="item.cantidad > 1">x{{ item.cantidad }}</span>
              </span>
              <span class="item-cat">{{ item.tipo }}</span>
            </div>

            <div class="item-price-action">
              <span class="item-price">{{ (item.precio * item.cantidad) | currency:'EUR' }}</span>

              <div class="qty-control">
                <button (click)="disminuirCantidad(i)">-</button>
                <span>{{ item.cantidad }}</span>
                <button (click)="aumentarCantidad(i)">+</button>
              </div>

              <button class="remove-btn" (click)="eliminarDelCarrito(i)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <ng-template #emptyCart>
          <div class="empty-cart">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <p>Tu carrito está vacío</p>
            <span>Añade productos para comenzar</span>
          </div>
        </ng-template>
      </div>


      <div *ngIf="carrito.length > 0" class="cart-footer">
        <div class="cart-total">
          <span>Total</span>
          <span class="total-price">{{ carritoTotal() | currency:'EUR' }}</span>
        </div>
        <button class="checkout-btn" (click)="comprar()">
          Realizar Pedido
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  </div>

  <!-- PARTÍCULAS -->
  <div class="particles-bg">
    <div class="particle" *ngFor="let p of particles" [style.left.%]="p.x" [style.animationDelay]="p.delay" [style.animationDuration]="p.duration"></div>
  </div>
</div>
  `,
  styles: [`
/* === VARIABLES Y BASE === */
:host { 
  --primary: #6366f1; 
  --primary-dark: #4f46e5; 
  --accent: #06b6d4; 
  --bg-dark: #0f172a; 
  --bg-card: #1e293b; 
  --text: #f8fafc; 
  --text-muted: #94a3b8; 
  --border: rgba(255,255,255,0.1); 
  --success: #10b981; 
  --danger: #ef4444; 
}

.dashboard-layout {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
  color: var(--text);
  font-family: 'Inter', -apple-system, sans-serif;
  position: relative;
  overflow-x: hidden;
}

/* === NAVBAR === */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-left { display: flex; align-items: center; gap: 1rem; }
.logo-container { display: flex; align-items: center; gap: 0.75rem; }
.logo-icon { font-size: 2rem; filter: drop-shadow(0 0 10px rgba(99, 102, 241, 0.5)); }
.logo-text { display: flex; flex-direction: column; }
.app-title { 
  margin: 0; 
  font-size: 1.5rem; 
  font-weight: 700; 
  background: linear-gradient(135deg, #6366f1, #06b6d4); 
  -webkit-background-clip: text; 
  -webkit-text-fill-color: transparent; 
}
.app-subtitle { 
  font-size: 0.7rem; 
  color: var(--text-muted); 
  text-transform: uppercase; 
  letter-spacing: 2px; 
}

.nav-right { display: flex; align-items: center; gap: 1rem; }

.carrito-wrapper { position: relative; cursor: pointer; }
.carrito-icon-btn { 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  width: 44px; 
  height: 44px; 
  border-radius: 12px; 
  background: rgba(99, 102, 241, 0.1); 
  border: 1px solid rgba(99, 102, 241, 0.2); 
  color: var(--primary); 
  transition: all 0.3s; 
}
.carrito-icon-btn:hover { 
  background: rgba(99, 102, 241, 0.2); 
  transform: translateY(-2px); 
}
.carrito-badge { 
  position: absolute; 
  top: -4px; 
  right: -4px; 
  width: 20px; 
  height: 20px; 
  background: var(--danger); 
  color: white; 
  font-size: 0.7rem; 
  font-weight: 700; 
  border-radius: 50%; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
}

.user-menu { position: relative; }
.avatar-btn { 
  display: flex; 
  align-items: center; 
  gap: 0.5rem; 
  padding: 0.5rem; 
  border-radius: 12px; 
  cursor: pointer; 
  transition: background 0.3s; 
}
.avatar-btn:hover { background: rgba(255,255,255,0.05); }
.user-icon { 
  width: 40px; 
  height: 40px; 
  border-radius: 10px; 
  border: 2px solid var(--primary); 
}
.chevron { 
  color: var(--text-muted); 
  transition: transform 0.3s; 
}
.chevron.rotated { transform: rotate(180deg); }

/* === MENU DROPDOWN === */
.menu-dropdown { 
  position: absolute; 
  top: calc(100% + 8px); 
  right: 0; 
  background: var(--bg-card); 
  border: 1px solid rgba(99, 102, 241, 0.3); 
  border-radius: 16px; 
  min-width: 220px; 
  overflow: hidden; 
  box-shadow: 0 20px 40px rgba(0,0,0,0.4); 
  animation: dropIn 0.2s ease;
  backdrop-filter: blur(20px);
  z-index: 1000;
}

@keyframes dropIn { 
  from { opacity: 0; transform: translateY(-10px); } 
  to { opacity: 1; transform: translateY(0); } 
}

.menu-user-info { 
  padding: 1rem; 
  background: radial-gradient(circle at 0 0, rgba(99, 102, 241, 0.15), rgba(99, 102, 241, 0.05));
  border-radius: 12px 12px 0 0;
  margin: -1px;
  position: relative;
}

.menu-user-info::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #6366f1, #06b6d4, transparent);
}

.menu-greeting { 
  display: block; 
  font-weight: 700; 
  color: var(--text); 
  font-size: 1.05rem;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
}

.menu-role { 
  font-size: 0.82rem; 
  color: rgba(99, 102, 241, 0.9);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.menu-divider { 
  height: 1px; 
  background: linear-gradient(90deg, transparent, var(--border), transparent);
  margin: 0.5rem 0;
}

.menu-item { 
  display: flex; 
  align-items: center; 
  gap: 0.75rem; 
  padding: 0.85rem 1rem; 
  color: var(--text-muted); 
  cursor: pointer; 
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 10px;
  margin: 0.2rem 0.3rem;
  position: relative;
}

.menu-item:hover { 
  background: radial-gradient(circle at 0% 0%, rgba(99, 102, 241, 0.2), rgba(99, 102, 241, 0.08));
  color: var(--text); 
  padding-left: 1.35rem;
  transform: translateX(4px);
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.2);
}

.menu-item.logout { 
  color: var(--danger); 
  margin-top: 0.5rem;
  border-top: 1px solid rgba(239, 68, 68, 0.2);
  padding-top: 1rem;
}

.menu-item.logout:hover { 
  background: radial-gradient(circle at 0% 0%, rgba(239, 68, 68, 0.25), rgba(239, 68, 68, 0.1));
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.25);
}

.menu-item svg {
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));
  flex-shrink: 0;
}

/* === HERO CAROUSEL === */
.hero-carousel {
  margin: 1.5rem auto 1.5rem;
  max-width: 1300px;
  padding: 0 1.5rem;
}

.carousel-inner { 
  position: relative; 
  border-radius: 24px; 
  overflow: hidden; 
  box-shadow: 0 25px 50px rgba(0,0,0,0.5); 
}

.carousel-track { 
  display: flex; 
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1); 
}

.carousel-slide { 
  min-width: 100%; 
  position: relative; 
  height: 380px; 
}

.slide-bg { 
  position: absolute; 
  inset: 0; 
  opacity: 0.9; 
}

.slide-content { 
  position: relative; 
  z-index: 1; 
  display: flex; 
  align-items: center; 
  justify-content: space-between; 
  height: 100%; 
  padding: 3rem; 
}

.slide-info { 
  flex: 1; 
  max-width: 500px; 
}

.slide-badge { 
  display: inline-block; 
  padding: 0.4rem 1rem; 
  background: rgba(255,255,255,0.15); 
  backdrop-filter: blur(10px); 
  border-radius: 20px; 
  font-size: 0.8rem; 
  font-weight: 600; 
  margin-bottom: 1rem; 
  border: 1px solid rgba(255,255,255,0.2); 
}

.slide-title { 
  font-size: 2.75rem; 
  font-weight: 800; 
  margin: 0 0 0.75rem; 
  line-height: 1.1; 
  text-shadow: 0 2px 20px rgba(0,0,0,0.3); 
}

.slide-desc { 
  font-size: 1.1rem; 
  color: rgba(255,255,255,0.85); 
  margin: 0 0 1.5rem; 
  line-height: 1.5; 
}

.slide-cta { 
  padding: 0.85rem 1.75rem; 
  background: white; 
  color: #1e293b; 
  border: none; 
  border-radius: 12px; 
  font-weight: 600; 
  cursor: pointer; 
  transition: all 0.3s; 
}

.slide-cta:hover { 
  transform: translateY(-2px); 
  box-shadow: 0 10px 30px rgba(0,0,0,0.3); 
}

.slide-visual { 
  flex: 1; 
  display: flex; 
  justify-content: center; 
  align-items: center; 
}

.slide-visual img { 
  max-height: 300px; 
  object-fit: contain; 
  filter: drop-shadow(0 20px 40px rgba(0,0,0,0.4)); 
  animation: float 4s ease-in-out infinite; 
}

@keyframes float { 
  0%, 100% { transform: translateY(0); } 
  50% { transform: translateY(-15px); } 
}

.nav-btn { 
  position: absolute; 
  top: 50%; 
  transform: translateY(-50%); 
  width: 48px; 
  height: 48px; 
  border-radius: 50%; 
  background: rgba(255,255,255,0.1); 
  backdrop-filter: blur(10px); 
  border: 1px solid rgba(255,255,255,0.2); 
  color: white; 
  cursor: pointer; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  transition: all 0.3s; 
  z-index: 10; 
}

.nav-btn:hover { 
  background: rgba(255,255,255,0.2); 
  transform: translateY(-50%) scale(1.1); 
}

.nav-btn.prev { left: 1rem; }
.nav-btn.next { right: 1rem; }

.carousel-dots { 
  display: flex; 
  justify-content: center; 
  gap: 8px; 
  margin-top: 1rem; 
}

.dot { 
  width: 10px; 
  height: 10px; 
  border-radius: 5px; 
  background: rgba(255,255,255,0.3); 
  border: none; 
  cursor: pointer; 
  transition: all 0.3s; 
}

.dot:hover { 
  background: rgba(255,255,255,0.5); 
}

.dot.active { 
  width: 32px; 
  background: var(--primary); 
}

/* === FILTERS SECTION === */
.filters-section { 
  max-width: 1300px; 
  margin: 0 auto 1.5rem;
  padding: 0 1.5rem; 
}

.filters-bar {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  min-height: 0;
  padding: 0.5rem 0;
  justify-content: space-between;
}

/* Buscador */
.search-wrapper { 
  position: relative; 
  flex: 1; 
  min-width: 280px; 
  max-width: 450px; 
  margin-right: 0.5rem;
}

.search-icon { 
  position: absolute; 
  left: 1rem; 
  top: 50%; 
  transform: translateY(-50%); 
  color: var(--text-muted); 
  pointer-events: none; 
}

.search-input { 
  width: 75%; 
  padding: 0.75rem 2.5rem 0.75rem 3rem; 
  background: rgba(0,0,0,0.2); 
  border: 1px solid var(--border); 
  border-radius: 10px; 
  color: var(--text); 
  font-size: 0.95rem; 
  transition: all 0.3s; 
}

.search-input::placeholder { 
  color: var(--text-muted); 
}

.search-input:focus { 
  outline: none; 
  border-color: var(--primary); 
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15); 
}

.clear-search { 
  position: absolute; 
  right: 0.75rem; 
  top: 50%; 
  transform: translateY(-50%); 
  background: none; 
  border: none; 
  color: var(--text-muted); 
  font-size: 1.25rem; 
  cursor: pointer; 
  line-height: 1; 
}

.clear-search:hover { 
  color: var(--danger); 
}

/* Filtros */
.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 0 0 auto;
}

.filter-group label { 
  font-size: 0.75rem; 
  color: var(--text-muted); 
  font-weight: 500; 
  text-transform: uppercase; 
  letter-spacing: 0.5px; 
}

.filter-select { 
  padding: 0.75rem 2.5rem 0.75rem 1rem; 
  background: rgba(0,0,0,0.2); 
  border: 1px solid var(--border); 
  border-radius: 10px; 
  color: var(--text); 
  font-size: 0.95rem; 
  cursor: pointer; 
  appearance: none; 
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E"); 
  background-repeat: no-repeat; 
  background-position: right 0.75rem center; 
  min-width: 200px;
  transition: all 0.3s; 
}

.filter-select:focus { 
  outline: none; 
  border-color: var(--primary); 
}

.filter-select option { 
  background: var(--bg-card); 
  color: var(--text); 
}

/* Contador de resultados */
.results-count {
  height: 40px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.25rem;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 10px;
  font-size: 0.95rem;
  color: var(--text-muted);
  transition: opacity 0.2s ease;
  flex: 0 0 auto;
  margin-left: auto;
}

.results-count.hidden {
  visibility: hidden;
  opacity: 0;
}

.results-count .count {
  font-weight: 700;
  color: var(--primary);
}

/* Botón limpiar */
.clear-all-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 10px;
  color: var(--text-muted);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  flex: 0 0 auto;
  white-space: nowrap;
}

.clear-all-btn:hover {
  border-color: var(--danger);
  color: var(--danger);
  background: rgba(239, 68, 68, 0.1);
}

/* === MAIN CONTENT === */
.main-content { 
  position: relative; 
  z-index: 1; 
  padding-bottom: 2rem; 
}

/* === PRODUCT MODAL === */
.product-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 300;
}

.product-modal {
  background: var(--bg-dark);
  border-radius: 16px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  color: var(--text);
  position: relative;
}

.product-modal .close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-muted);
}

.product-modal img {
  max-width: 100%;
  margin: 1rem 0;
  border-radius: 12px;
}

.product-modal button {
  padding: 0.75rem 1.5rem;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  margin-top: 1rem;
}

/* === CART MODAL === */
.cart-overlay { 
  position: fixed; 
  inset: 0; 
  background: rgba(0,0,0,0.7); 
  backdrop-filter: blur(8px); 
  z-index: 200; 
  display: flex; 
  justify-content: flex-end; 
  animation: fadeIn 0.3s; 
}

@keyframes fadeIn { 
  from { opacity: 0; } 
  to { opacity: 1; } 
}

.cart-modal { 
  width: 100%; 
  max-width: 420px; 
  height: 100%; 
  background: var(--bg-dark); 
  border-left: 1px solid var(--border); 
  display: flex; 
  flex-direction: column; 
  animation: slideIn 0.3s ease; 
}

@keyframes slideIn { 
  from { transform: translateX(100%); } 
  to { transform: translateX(0); } 
}

.cart-header { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  padding: 1.5rem; 
  border-bottom: 1px solid var(--border); 
}

.cart-header h3 { 
  display: flex; 
  align-items: center; 
  gap: 0.75rem; 
  margin: 0; 
  font-size: 1.25rem; 
  font-weight: 600; 
  color: var(--text); 
}

.close-btn { 
  background: none; 
  border: none; 
  color: var(--text-muted); 
  cursor: pointer; 
  padding: 0.5rem; 
  border-radius: 8px; 
  transition: all 0.2s; 
}

.close-btn:hover { 
  background: rgba(255,255,255,0.1); 
  color: var(--text); 
}

.cart-body { 
  flex: 1; 
  overflow-y: auto; 
  padding: 1rem; 
}

.cart-items { 
  display: flex; 
  flex-direction: column; 
  gap: 0.75rem; 
}

.cart-item { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  padding: 1rem; 
  background: var(--bg-card); 
  border: 1px solid var(--border); 
  border-radius: 12px; 
  transition: all 0.2s; 
}

.cart-item:hover { 
  border-color: rgba(99, 102, 241, 0.3); 
  transform: translateX(-4px); 
}

.item-details { 
  display: flex; 
  flex-direction: column; 
  gap: 0.2rem; 
}

.item-name { 
  font-weight: 600; 
  color: var(--text); 
  font-size: 0.95rem; 
}

.item-cat { 
  font-size: 0.8rem; 
  color: var(--text-muted); 
}

.item-price-action { 
  display: flex; 
  align-items: center; 
  gap: 1rem; 
}

.item-price { 
  font-weight: 700; 
  color: var(--accent); 
  font-size: 1.05rem; 
}

.qty-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 0.2rem 0.4rem;
  font-weight: 600;
}

.qty-control button {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.qty-control button:hover {
  background: var(--primary-dark);
  transform: scale(1.1);
}

.qty-control span {
  min-width: 24px;
  text-align: center;
  font-size: 0.95rem;
  color: var(--text);
}

.remove-btn { 
  background: none; 
  border: none; 
  color: var(--text-muted); 
  cursor: pointer; 
  padding: 0.4rem; 
  border-radius: 6px; 
  transition: all 0.2s; 
}

.remove-btn:hover { 
  background: rgba(239, 68, 68, 0.1); 
  color: var(--danger); 
}

.empty-cart { 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  justify-content: center; 
  padding: 4rem 2rem; 
  text-align: center; 
}

.empty-cart p { 
  margin: 1rem 0 0.25rem; 
  font-weight: 600; 
  color: var(--text); 
}

.empty-cart span { 
  font-size: 0.9rem; 
  color: var(--text-muted); 
}

.cart-footer { 
  padding: 1.5rem; 
  border-top: 1px solid var(--border); 
  background: rgba(0,0,0,0.2); 
}

.cart-total { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  margin-bottom: 1rem; 
  font-size: 1.1rem; 
}

.cart-total span:first-child { 
  color: var(--text-muted); 
}

.total-price { 
  font-size: 1.5rem; 
  font-weight: 700; 
  color: var(--text); 
}

.checkout-btn { 
  width: 100%; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  gap: 0.5rem; 
  padding: 1rem; 
  background: linear-gradient(135deg, var(--primary), var(--accent)); 
  border: none; 
  border-radius: 12px; 
  color: white; 
  font-size: 1rem; 
  font-weight: 600; 
  cursor: pointer; 
  transition: all 0.3s; 
}

.checkout-btn:hover { 
  transform: translateY(-2px); 
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4); 
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

/* === RESPONSIVE === */
@media (max-width: 900px) {
  .filters-bar { 
    flex-direction: column; 
    align-items: stretch;
    gap: 1rem;
  }
  
  .search-wrapper { 
    max-width: 100%;
    margin-right: 0;
  }
  
  .filter-group { 
    width: 100%; 
  }
  
  .filter-select { 
    width: 100%;
    min-width: auto;
  }
  
  .results-count { 
    justify-content: center;
    margin-left: 0;
  }
  
  .clear-all-btn {
    width: 100%;
    justify-content: center;
    margin-left: 0;
  }
}

@media (max-width: 768px) {
  .navbar { 
    padding: 0.75rem 1rem; 
  }
  
  .app-subtitle { 
    display: none; 
  }
  
  .hero-carousel { 
    margin: 1rem auto; 
    padding: 0 1rem;
  }
  
  .carousel-slide { 
    height: 300px; 
  }
  
  .slide-content { 
    flex-direction: column; 
    padding: 1.5rem; 
    text-align: center; 
  }
  
  .slide-title { 
    font-size: 1.75rem; 
  }
  
  .slide-desc { 
    font-size: 0.95rem; 
  }
  
  .slide-visual img { 
    max-height: 150px; 
  }
  
  .nav-btn { 
    width: 36px; 
    height: 36px; 
  }
  
  .cart-modal { 
    max-width: 100%; 
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
  user: any = null;


  searchTerm: string = '';
  tipoSeleccionado: string = '';
  ordenSeleccionado: string = ''; 
  productosFiltrados: any[] = [];

  tiposDisponibles: string[] = [
    'Auriculares', 'Teclado', 'Ratón', 'Monitor', 'Tarjeta Gráfica', 'Placa Base',
    'RAM', 'SSD', 'Fuente', 'Refrigeración', 'Caja PC', 'Kit Periféricos',
    'Webcam', 'Micrófono', 'Altavoces', 'Silla', 'Tarjeta de Sonido', 'Disco Externo'
  ];

  // Carrusel
  currentSlide = 0;
  carouselInterval: any;

  carouselSlides = [
    { title: 'Gaming de Alta Gama', description: 'Las últimas tarjetas gráficas RTX y componentes premium', badge: '🎮 Ofertas Gaming', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&h=400&fit=crop', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { title: 'Periféricos Pro', description: 'Teclados mecánicos, ratones y auriculares premium', badge: '⚡ Nuevo Stock', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=400&fit=crop', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { title: 'Monitores 4K 144Hz', description: 'Pantallas de alto rendimiento con tecnología HDR', badge: '🖥️ Top Ventas', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&h=400&fit=crop', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { title: 'Setup Completo', description: 'Todo para tu estación de trabajo perfecta', badge: '💼 Profesional', image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=600&h=400&fit=crop', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }
  ];

  particles = Array.from({ length: 40 }, () => ({ x: Math.random() * 100, delay: `${Math.random() * 20}s`, duration: `${15 + Math.random() * 10}s` }));

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

  agregarAlCarrito(producto: any) {
    if (!producto) return;
    const itemExistente = this.carrito.find(item => item.id === producto.id);
    if (itemExistente) {
      itemExistente.cantidad = (itemExistente.cantidad || 1) + 1;
    } else {
      this.carrito.push({ ...producto, cantidad: 1 });
    }
    this.saveCarrito(); 
    this.cerrarProductoModal();
    this.showNotification(`${producto.nombre} añadido al carrito 🛒`); 
  }



  ngOnInit() {
  this.isLoggedIn = this.authService.isLoggedIn();
  this.isAdmin = this.roleService.isAdmin();
  this.isCliente = this.roleService.isCliente();
  this.isTrabajador = this.roleService.isTrabajador();

  this.user = JSON.parse(localStorage.getItem('user') || '{}');

  window.addEventListener('user-updated', (event: any) => {
    this.user = event.detail;
  });

  this.notificationService.notification$.subscribe((msg: string) => this.showNotification(msg));
  this.startCarousel();
}

productoModalOpen: boolean = false;
selectedProducto: any = null;

verProducto(producto: any) {
  this.selectedProducto = producto;
  this.productoModalOpen = true;
}

cerrarProductoModal() {
  this.productoModalOpen = false;
  this.selectedProducto = null;
}

  ngOnDestroy() { if (this.carouselInterval) clearInterval(this.carouselInterval); }

  startCarousel() { this.carouselInterval = setInterval(() => this.nextSlide(), 5000); }
  nextSlide() { this.currentSlide = (this.currentSlide + 1) % this.carouselSlides.length; }
  prevSlide() { this.currentSlide = this.currentSlide === 0 ? this.carouselSlides.length - 1 : this.currentSlide - 1; }
  goToSlide(i: number) { this.currentSlide = i; if (this.carouselInterval) { clearInterval(this.carouselInterval); this.startCarousel(); } }

  toggleMenu() { this.menuOpen = !this.menuOpen; }
  toggleCarrito() { this.carritoOpen = !this.carritoOpen; }

  showNotification(message: string) { this.snackBar.open(message, 'Cerrar', { duration: 3000, horizontalPosition: 'right', verticalPosition: 'top' }); }

  loadCarrito() { this.carrito = this.isLoggedIn ? JSON.parse(localStorage.getItem('carrito') || '[]') : []; }
  clearSearch() { this.searchTerm = ''; this.applyFilters(); }
  clearAllFilters() { this.searchTerm = ''; this.tipoSeleccionado = ''; this.ordenSeleccionado = ''; this.applyFilters(); }
  applyFilters() { }
  onProductosFiltered(productos: any[]) { this.productosFiltrados = productos; }

carritoTotal() {
  return this.carrito.reduce((sum, item) => sum + (item.precio * (item.cantidad || 1)), 0);
}

  eliminarDelCarrito(i: number) { this.carrito.splice(i, 1); this.updateCarrito(); }
  updateCarrito() { if (this.isLoggedIn) localStorage.setItem('carrito', JSON.stringify(this.carrito)); }

  comprar() {
    if (!this.carrito.length) { this.showNotification('El carrito está vacío 🛒'); return; }
    const token = localStorage.getItem('token');
    if (!token) { this.showNotification('Debes iniciar sesión 🔐'); return; }
    const clienteId = 5;
    const pedidoBody = { clienteId, lineasVenta: this.carrito.map(item => ({ productoId: item.id, cantidad: item.cantidad || 1 })) };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` });
    const snackRef = this.snackBar.open('⏳ Procesando...', undefined, { horizontalPosition: 'center', verticalPosition: 'top' });
    this.http.post('http://localhost:8080/api/pedidos', pedidoBody, { headers }).subscribe({
      next: (res: any) => { snackRef.dismiss(); this.carrito = []; localStorage.removeItem('carrito'); this.carritoOpen = false; this.showNotification('✅ Pedido realizado'); this.router.navigate(['/dashboard']); if (res.url) window.location.href = res.url; },
      error: () => { snackRef.dismiss(); this.showNotification('❌ Error al realizar el pedido'); }
    });
  }

saveCarrito() {
  localStorage.setItem('carrito', JSON.stringify(this.carrito));
  this.recalcularTotal();
}

total: number = 0;

recalcularTotal() {
  // Si quieres mantener un total en Dashboard
  this.total = this.carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
}

aumentarCantidad(index: number) {
  const item = this.carrito[index];
  if (!item) return;
  item.cantidad = (item.cantidad || 0) + 1;
  this.saveCarrito();
}

disminuirCantidad(index: number) {
  const item = this.carrito[index];
  if (!item) return;
  if (item.cantidad > 1) {
    item.cantidad -= 1;
    this.saveCarrito();
  } else {
    this.eliminarDelCarrito(index);
  }
}

  goToLogin() { this.menuOpen = false; this.router.navigate(['/login']); }
  goToRegister() { this.menuOpen = false; this.router.navigate(['/register']); }
  goToProfile() { this.menuOpen = false; this.router.navigate(['/perfil']); }
  goToMisPedidos() { this.menuOpen = false; this.router.navigate(['/mispedidos']); }
  goToGestion(path: string) { this.router.navigateByUrl(`/admin/${path}`); }
  logout() { this.menuOpen = false; this.authService.logout(); this.isLoggedIn = false; this.isAdmin = false; this.carrito = []; localStorage.removeItem('carrito'); this.router.navigate(['/']); }
}