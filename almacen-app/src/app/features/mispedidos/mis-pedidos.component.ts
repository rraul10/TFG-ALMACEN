import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidoService, Pedido } from '@core/services/pedido.service';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-mis-pedidos',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="gestion-layout">
      <!-- NAVBAR -->
      <header class="navbar">
        <div class="nav-left">
          <div class="logo-container" (click)="volverDashboard()" style="cursor:pointer">
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
              <img [src]="fotoPerfil" class="user-icon" />
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
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  Mi perfil
                </div>
                <div class="menu-item" (click)="goToMisPedidos()">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  </svg>
                  Mis pedidos
                </div>
                <div class="menu-divider"></div>
                <div class="menu-item logout" (click)="logout()">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Cerrar sesión
                </div>
              </ng-container>

              <ng-template #notLogged>
                <div class="menu-item" (click)="goToLogin()">
                  Iniciar sesión
                </div>
                <div class="menu-item" (click)="goToRegister()">
                  Registrarse
                </div>
              </ng-template>
            </div>
          </div>
        </div>
      </header>


      <!-- CONTENT -->
      <main class="main-content">
        <!-- Page Header -->
        <div class="page-header">
          <div class="header-info">
            <h1>📦 Mis Pedidos</h1>
            <p>Consulta el estado de tus compras</p>
          </div>
        </div>

        <!-- Stats -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon blue">📋</div>
            <div class="stat-info">
              <span class="stat-value">{{ pedidos.length }}</span>
              <span class="stat-label">Total Pedidos</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon orange">⏳</div>
            <div class="stat-info">
              <span class="stat-value">{{ contarPorEstado('PENDIENTE') }}</span>
              <span class="stat-label">Pendientes</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon purple">⚡</div>
            <div class="stat-info">
              <span class="stat-value">{{ contarPorEstado('PREPARACION') }}</span>
              <span class="stat-label">Preparación</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon green">✅</div>
            <div class="stat-info">
              <span class="stat-value">{{ contarPorEstado('ENTREGADO') }}</span>
              <span class="stat-label">Entregados</span>
            </div>
          </div>
        </div>

        <!-- Buscador y Filtros -->
        <div class="search-filter-section">
          <div class="search-box">
            <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input 
              type="text" 
              [(ngModel)]="searchTerm"
              (input)="aplicarFiltros()"
              placeholder="Buscar pedidos por ID, fecha o productos..."
            />
            <button class="clear-btn" *ngIf="searchTerm" (click)="limpiarBusqueda()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6L18 18"/></svg>
            </button>
          </div>

          <div class="filter-section">
            <label for="estadoSelect" class="filter-label">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
              </svg>
              Filtrar por estado:
            </label>
            <select id="estadoSelect" [(ngModel)]="filtroEstado" (change)="aplicarFiltros()">
              <option value="">Todos</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="PREPARACION">Preparación</option>
              <option value="ENVIADO">Enviado</option>
              <option value="ENTREGADO">Entregado</option>
            </select>
          </div>

          <div class="results-info" *ngIf="filtroEstado || searchTerm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
            </svg>
            Mostrando {{ pedidosFiltrados.length }} de {{ pedidos.length }} pedidos
            <button class="btn-reset-filters" (click)="resetearFiltros()">
              Limpiar filtros
            </button>
          </div>
        </div>

        <!-- Grid de pedidos -->
        <div class="pedidos-grid" *ngIf="pedidosFiltrados.length > 0">
          <div class="pedido-card" *ngFor="let pedido of pedidosFiltrados">
            <div class="card-header-pedido">
              <div class="pedido-id">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                </svg>
                Pedido #{{ pedido.id }}
              </div>
              <span class="estado-badge" [attr.data-estado]="pedido.estado">
                {{ getEstadoLabel(pedido.estado) }}
              </span>
            </div>

            <div class="card-body-pedido">
              <div class="pedido-info-row">
                <div class="info-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <div>
                    <div class="info-label">Fecha</div>
                    <div class="info-value">{{ pedido.fecha | date:'short' }}</div>
                  </div>
                </div>

                <div class="info-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <div>
                    <div class="info-label">Estado</div>
                    <div class="info-value">{{ getEstadoLabel(pedido.estado) }}</div>
                  </div>
                </div>
              </div>

              <div class="pedido-items">
                <div class="items-header">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 7H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z"/><path d="M16 21V5c0-.5-.2-1-.6-1.4-.4-.4-.9-.6-1.4-.6h-4c-.5 0-1 .2-1.4.6-.4.4-.6.9-.6 1.4v16"/>
                  </svg>
                  {{ pedido.lineasVenta.length }} producto(s)
                </div>
                <div class="items-list">
                  <div class="item" *ngFor="let lv of pedido.lineasVenta">
                    <span class="item-cantidad">{{ lv.cantidad }}×</span>
                    <span class="item-nombre">{{ lv.productoNombre }}</span>
                    <span class="item-precio">{{ lv.precio * lv.cantidad | number:'1.2-2' }}€</span>
                  </div>
                </div>
              </div>

              <div class="pedido-total">
                <span>Total del Pedido</span>
                <span class="total-amount">{{ totalPedido(pedido) | number:'1.2-2' }}€</span>
              </div>
            </div>

            <div class="card-footer-pedido">
              <button class="btn-edit" (click)="verDetalle(pedido)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6m-6-6h6m6 0h-6"/></svg>
                Ver Detalles
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div class="empty-state" *ngIf="pedidosFiltrados.length === 0">
          <div class="empty-icon">📦</div>
          <h3>No hay pedidos</h3>
          <p>{{ filtroEstado || searchTerm ? 'No se encontraron pedidos con los filtros aplicados' : 'Aún no has realizado ningún pedido. ¡Empieza a comprar!' }}</p>
          <button *ngIf="filtroEstado || searchTerm" class="btn-primary" (click)="resetearFiltros()">
            Limpiar filtros
          </button>
          <button *ngIf="!filtroEstado && !searchTerm" class="btn-primary" (click)="volverDashboard()">
            Ir a Comprar
          </button>
        </div>
      </main>

      <!-- MODAL -->
      <div class="modal-overlay" *ngIf="pedidoSeleccionado" (click)="cerrarModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
              </svg>
              Pedido #{{ pedidoSeleccionado.id }}
            </h2>
            <button class="btn-close" (click)="cerrarModal()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          <div class="modal-body">
            <div class="detalle-section">
              <h3>Información del Pedido</h3>
              <div class="detalle-grid">
                <div class="detalle-item">
                  <span class="detalle-label">ID del Pedido:</span>
                  <span class="detalle-value">#{{ pedidoSeleccionado.id }}</span>
                </div>
                <div class="detalle-item">
                  <span class="detalle-label">Estado:</span>
                  <span class="estado-badge-modal" [attr.data-estado]="pedidoSeleccionado.estado">
                    {{ getEstadoLabel(pedidoSeleccionado.estado) }}
                  </span>
                </div>
                <div class="detalle-item full-width">
                  <span class="detalle-label">Fecha:</span>
                  <span class="detalle-value">{{ pedidoSeleccionado.fecha | date:'medium' }}</span>
                </div>
              </div>
            </div>

            <div class="detalle-section">
              <h3>Líneas de Venta</h3>
              <div class="lineas-venta-list">
                <div class="linea-item" *ngFor="let lv of pedidoSeleccionado.lineasVenta">
                  <div class="linea-producto">
                    <span class="linea-cantidad">{{ lv.cantidad }}×</span>
                    <span class="linea-nombre">{{ lv.productoNombre }}</span>
                  </div>
                  <div class="linea-precios">
                    <span class="linea-precio-unit">{{ lv.precio }}€/u</span>
                    <span class="linea-precio-total">{{ lv.precio * lv.cantidad | number:'1.2-2' }}€</span>
                  </div>
                </div>
              </div>
              
              <div class="modal-total">
                <span>Total del Pedido</span>
                <span class="modal-total-amount">{{ totalPedido(pedidoSeleccionado) | number:'1.2-2' }}€</span>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-secondary" (click)="cerrarModal()">Cerrar</button>
          </div>
        </div>
      </div>

      <!-- Particles -->
      <div class="particles-bg">
        <div class="particle" *ngFor="let p of particles" [style.left.%]="p.x" [style.animationDelay]="p.delay" [style.animationDuration]="p.duration"></div>
      </div>
    </div>
  `,
  styles: [`
:host { --primary: #6366f1; --accent: #06b6d4; --bg-dark: #0f172a; --bg-card: #1e293b; --text: #f8fafc; --text-muted: #94a3b8; --border: rgba(255,255,255,0.1); --success: #10b981; --danger: #ef4444; --warning: #f59e0b; --purple: #8b5cf6; }

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
.stat-icon.orange { background: rgba(245, 158, 11, 0.2); }
.stat-icon.purple { background: rgba(139, 92, 246, 0.2); }
.stat-info { display: flex; flex-direction: column; }
.stat-value { font-size: 1.75rem; font-weight: 700; }
.stat-label { font-size: 0.8rem; color: var(--text-muted); }

/* Search and Filters */
.search-filter-section { background: rgba(30, 41, 59, 0.6); backdrop-filter: blur(10px); border: 1px solid var(--border); border-radius: 16px; padding: 1.5rem; margin-bottom: 2rem; }
.search-box { position: relative; margin-bottom: 1.5rem; }
.search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--text-muted); pointer-events: none; }
.search-box input { width: 92%; padding: 0.85rem 3rem 0.85rem 3rem; background: rgba(15, 23, 42, 0.6); border: 1px solid var(--border); border-radius: 10px; color: var(--text); font-size: 0.95rem; transition: all 0.3s; }
.search-box input::placeholder { color: rgba(148, 163, 184, 0.5); }
.search-box input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15); }
.clear-btn { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); width: 32px; height: 32px; border: none; background: rgba(100, 116, 139, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
.clear-btn:hover { background: rgba(100, 116, 139, 0.3); }
.clear-btn svg { color: var(--text-muted); }

.filter-section { display: flex; flex-direction: column; gap: 1rem; }
.filter-label { display: flex; align-items: center; gap: 8px; font-weight: 600; color: var(--text); font-size: 0.9rem; }
.filter-section select { margin-top: 0.5rem; padding: 0.6rem 1rem; border-radius: 10px; border: 1px solid var(--border); background: rgba(15, 23, 42, 0.6); color: var(--text); font-size: 0.95rem; }

.results-info { display: flex; align-items: center; gap: 8px; padding: 0.75rem 1rem; background: rgba(100, 116, 139, 0.15); border-radius: 10px; color: var(--text-muted); font-size: 0.85rem; font-weight: 500; margin-top: 1rem; }
.results-info svg { color: var(--primary); flex-shrink: 0; }
.btn-reset-filters { margin-left: auto; padding: 0.4rem 0.85rem; background: rgba(99, 102, 241, 0.2); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 8px; font-size: 0.8rem; font-weight: 600; color: var(--primary); cursor: pointer; transition: all 0.2s; }
.btn-reset-filters:hover { background: var(--primary); color: white; border-color: var(--primary); }

/* Grid Pedidos */
.pedidos-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem; }
.pedido-card { background: rgba(30, 41, 59, 0.6); backdrop-filter: blur(10px); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; transition: all 0.3s; display: flex; flex-direction: column; }
.pedido-card:hover { transform: translateY(-4px); border-color: rgba(99, 102, 241, 0.3); box-shadow: 0 15px 40px rgba(0,0,0,0.3); }

.card-header-pedido { padding: 1.25rem; background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(118, 75, 162, 0.15)); border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
.pedido-id { display: flex; align-items: center; gap: 8px; font-size: 1.05rem; font-weight: 700; color: var(--text); }
.pedido-id svg { color: var(--primary); }

.estado-badge { padding: 0.4rem 0.85rem; border-radius: 20px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
.estado-badge[data-estado="PENDIENTE"] { background: rgba(245, 158, 11, 0.95); color: white; box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3); }
.estado-badge[data-estado="PREPARACION"] { background: rgba(139, 92, 246, 0.95); color: white; box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3); }
.estado-badge[data-estado="ENVIADO"] { background: rgba(59, 130, 246, 0.95); color: white; box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3); }
.estado-badge[data-estado="ENTREGADO"] { background: rgba(16, 185, 129, 0.95); color: white; box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3); }

.card-body-pedido { padding: 1.25rem; flex: 1; display: flex; flex-direction: column; gap: 1rem; }

.pedido-info-row { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
.info-item { display: flex; align-items: flex-start; gap: 10px; padding: 0.85rem; background: rgba(15, 23, 42, 0.4); border-radius: 10px; border: 1px solid var(--border); }
.info-item svg { color: var(--primary); flex-shrink: 0; margin-top: 2px; }
.info-label { font-size: 0.7rem; color: var(--text-muted); font-weight: 500; margin-bottom: 2px; text-transform: uppercase; letter-spacing: 0.5px; }
.info-value { font-size: 0.85rem; color: var(--text); font-weight: 600; }

.pedido-items { background: rgba(15, 23, 42, 0.4); border: 1px solid var(--border); border-radius: 10px; padding: 1rem; }
.items-header { display: flex; align-items: center; gap: 8px; font-size: 0.8rem; font-weight: 600; color: var(--text-muted); margin-bottom: 0.75rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--border); }
.items-header svg { color: var(--primary); }

    .items-header svg { color: var(--primary); }

.items-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 150px;
  overflow-y: auto;
}

.items-list::-webkit-scrollbar {
  width: 4px;
}

.items-list::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.4);
  border-radius: 4px;
}

.items-list::-webkit-scrollbar-thumb {
  background: var(--text-muted);
  border-radius: 4px;
}

.item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  padding: 6px;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 6px;
}

.item-cantidad {
  color: var(--primary);
  font-weight: 700;
  min-width: 30px;
}

.item-nombre {
  flex: 1;
  color: var(--text);
  font-weight: 500;
}

.item-precio {
  color: var(--text);
  font-weight: 700;
}

.pedido-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: linear-gradient(135deg, var(--primary), var(--purple));
  border-radius: 10px;
  color: white;
  font-weight: 600;
}

.total-amount {
  font-size: 1.5rem;
  font-weight: 700;
}

.card-footer-pedido {
  padding: 1rem 1.5rem;
  background: rgba(15, 23, 42, 0.3);
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: flex-end;
}

.btn-edit {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.6rem 1.2rem;
  background: rgba(99, 102, 241, 0.2);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 10px;
  color: var(--primary);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-edit:hover {
  background: var(--primary);
  color: white;
  transform: translateY(-2px);
}

/* EMPTY STATE */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid var(--border);
  border-radius: 16px;
  position: relative;
  z-index: 1;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: var(--text);
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: var(--text-muted);
  margin-bottom: 2rem;
}

/* MODAL */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
  animation: fadeIn 0.3s ease;
  backdrop-filter: blur(8px);
}

.modal-content {
  background: rgba(30, 41, 59, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border);
  border-radius: 20px;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
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

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-header {
  background: linear-gradient(135deg, var(--primary), var(--purple));
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
  margin: 0;
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

.detalle-section {
  margin-bottom: 2rem;
}

.detalle-section:last-child {
  margin-bottom: 0;
}

.detalle-section h3 {
  font-size: 1.1rem;
  color: var(--text);
  font-weight: 700;
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--border);
}

.detalle-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.detalle-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid var(--border);
  border-radius: 10px;
}

.detalle-item.full-width {
  grid-column: 1 / -1;
}

.detalle-label {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-weight: 500;
}

.detalle-value {
  font-size: 1rem;
  color: var(--text);
  font-weight: 600;
}

.estado-badge-modal {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.estado-badge-modal[data-estado="PENDIENTE"] {
  background: rgba(245, 158, 11, 0.95);
  color: white;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
}

.estado-badge-modal[data-estado="PREPARACION"] {
  background: rgba(139, 92, 246, 0.95);
  color: white;
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
}

.estado-badge-modal[data-estado="ENVIADO"] {
  background: rgba(59, 130, 246, 0.95);
  color: white;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.estado-badge-modal[data-estado="ENTREGADO"] {
  background: rgba(16, 185, 129, 0.95);
  color: white;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.lineas-venta-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.linea-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.4);
  border-radius: 10px;
  border: 1px solid var(--border);
}

.linea-producto {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.linea-cantidad {
  font-size: 1rem;
  font-weight: 700;
  color: var(--primary);
  min-width: 35px;
}

.linea-nombre {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text);
}

.linea-precios {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.linea-precio-unit {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 500;
}

.linea-precio-total {
  font-size: 1.1rem;
  color: var(--text);
  font-weight: 700;
}

.modal-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  background: linear-gradient(135deg, var(--primary), var(--purple));
  border-radius: 10px;
  color: white;
  font-weight: 600;
  margin-top: 1rem;
  font-size: 1.1rem;
}

.modal-total-amount {
  font-size: 1.75rem;
  font-weight: 700;
}

.modal-footer {
  padding: 1.5rem 2rem;
  background: rgba(15, 23, 42, 0.5);
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

/* Particles Background */
.particles-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(99, 102, 241, 0.6);
  border-radius: 50%;
  animation: float linear infinite;
  bottom: -10px;
}

@keyframes float {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) rotate(360deg);
    opacity: 0;
  }
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .pedidos-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }

  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

@media (max-width: 768px) {
  .navbar {
    padding: 1rem;
  }

  .main-content {
    padding: 1.5rem 1rem;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .pedidos-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .detalle-grid {
    grid-template-columns: 1fr;
  }

  .modal-body {
    padding: 1.5rem;
  }

  .modal-footer {
    flex-direction: column-reverse;
  }

  .linea-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .linea-precios {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .search-box input {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .app-title {
    font-size: 1.25rem;
  }

  .app-subtitle {
    font-size: 0.6rem;
  }

  .nav-right {
    gap: 0.5rem;
  }

  .btn-nav {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
  }

  .page-header h1 {
    font-size: 1.4rem;
  }

  .pedido-card {
    border-radius: 12px;
  }

  .modal-content {
    border-radius: 16px;
  }

  .stat-value {
    font-size: 1.5rem;
  }

  .total-amount {
    font-size: 1.25rem;
  }
}

/* NAVBAR */
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

.nav-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.logo-icon {
  font-size: 2rem;
  filter: drop-shadow(0 0 10px rgba(99, 102, 241, 0.5));
}

.logo-text {
  display: flex;
  flex-direction: column;
}

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

.nav-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* User Menu */
.user-menu {
  position: relative;
}

.avatar-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.3s;
}

.avatar-btn:hover {
  background: rgba(255,255,255,0.05);
}

.user-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 2px solid var(--primary);
  object-fit: cover;
}

.chevron {
  color: var(--text-muted);
  transition: transform 0.3s;
}

.chevron.rotated {
  transform: rotate(180deg);
}

.menu-dropdown {
  position: absolute;
  top: calc(100% + 8px);
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
}

.menu-greeting {
  display: block;
  font-weight: 600;
  color: var(--text);
}

.menu-role {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.menu-divider {
  height: 1px;
  background: var(--border);
  margin: 0.25rem 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
}

.menu-item:hover {
  background: rgba(99, 102, 241, 0.1);
  color: var(--text);
  padding-left: 1.25rem;
}

.menu-item.active {
  background: rgba(99, 102, 241, 0.15);
  color: var(--primary);
  border-left: 3px solid var(--primary);
}

.menu-item.logout {
  color: var(--danger);
}

.menu-item.logout:hover {
  background: rgba(239, 68, 68, 0.1);
}

  `]
})
export class MisPedidosComponent implements OnInit {
  pedidos: Pedido[] = [];
  pedidosFiltrados: Pedido[] = [];
  pedidoSeleccionado: Pedido | null = null;
  menuOpen = false;

  searchTerm = '';
  filtroEstado: string = '';

  fotoPerfil: string = 'assets/default-avatar.png';
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  isCliente: boolean = false;
  isTrabajador: boolean = false;
  particles: Array<{ x: number; delay: string; duration: string }> = [
    { x: 10, delay: '0s', duration: '2s' },
    { x: 50, delay: '0.5s', duration: '3s' },
    { x: 80, delay: '1s', duration: '2.5s' },
  ];

  constructor(
    private pedidoService: PedidoService, 
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    let user: any = null; 

    const userStr = localStorage.getItem('user');
    if (userStr) {
      user = JSON.parse(userStr);
      this.isLoggedIn = true;
      this.isAdmin = user.role === 'ADMIN';
      this.isCliente = user.role === 'CLIENTE';
      this.isTrabajador = user.role === 'TRABAJADOR';
      this.fotoPerfil = user.foto || this.fotoPerfil;
    }

    if (user) { 
      const clienteId = user.clienteId ?? user.id;
      this.pedidoService.getByCliente(clienteId).subscribe(pedidos => {
        this.pedidos = pedidos;
        this.pedidosFiltrados = [...this.pedidos];
      });
    }
  }

  toggleMenu() { this.menuOpen = !this.menuOpen; }

  goToProfile() { 
    this.menuOpen = false; 
    this.router.navigate(['/perfil']); 
  }

  goToMisPedidos() { 
    this.menuOpen = false; 
    this.router.navigate(['/mis-pedidos']); 
  }

  goToLogin() {
    this.menuOpen = false;
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.menuOpen = false;
    this.router.navigate(['/register']);
  }

  logout() {
    this.menuOpen = false;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }

  volverDashboard() {
    this.router.navigate(['/dashboard']);
  }

  private getClienteIdAutenticado(): number {
    const clienteIdStr = localStorage.getItem('clienteId');
    return clienteIdStr ? Number(clienteIdStr) : 0;
  }


  totalPedido(pedido: Pedido): number {
    return pedido.lineasVenta.reduce((sum, lv) => sum + lv.cantidad * lv.precio, 0);
  }

  contarPorEstado(estado: string): number {
    return this.pedidos.filter(p => p.estado === estado).length;
  }

  getEstadoLabel(estado: string | undefined): string {
    if (!estado) return 'Sin estado';
    const labels: { [key: string]: string } = {
      'PENDIENTE': 'Pendiente',
      'EN_PROCESO': 'En Proceso',
      'ENVIADO': 'Enviado',
      'ENTREGADO': 'Entregado'
    };
    return labels[estado] || estado;
  }

  verDetalle(pedido: Pedido) {
    this.pedidoSeleccionado = pedido;
  }

  cerrarModal() {
    this.pedidoSeleccionado = null;
  }

  aplicarFiltros() {
    const term = this.searchTerm?.toLowerCase().trim();
    this.pedidosFiltrados = this.pedidos.filter(p => {
      const coincideEstado = this.filtroEstado ? p.estado === this.filtroEstado : true;
      const idMatch = term ? (p.id != null && p.id.toString().includes(term)) : true;
      const fechaStr = p.fecha ? new Date(p.fecha).toLocaleDateString('es-ES') : '';
      const fechaMatch = term ? fechaStr.toLowerCase().includes(term) : true;
      const productosStr = (p.lineasVenta || []).map(lv => lv.productoNombre || '').join(' ').toLowerCase();
      const productosMatch = term ? productosStr.includes(term) : true;
      const coincideBusqueda = term ? (idMatch || fechaMatch || productosMatch) : true;
      return coincideEstado && coincideBusqueda;
    });
  }

  limpiarBusqueda() {
    this.searchTerm = '';
    this.aplicarFiltros();
  }

  filtrarPorEstado(estado: string) {
    this.filtroEstado = estado;
    this.aplicarFiltros();
  }

  resetearFiltros() {
    this.filtroEstado = '';
    this.searchTerm = '';
    this.pedidosFiltrados = [...this.pedidos];
  }
}