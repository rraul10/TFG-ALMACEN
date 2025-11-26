import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidoService, Pedido } from '@core/services/pedido.service';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-mis-pedidos',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterModule, FormsModule],
  template: `
    <div class="gestion-layout">
      <!-- Particles Background -->
      <div class="particles-bg">
        <div class="particle" *ngFor="let p of [1,2,3,4,5,6,7,8,9,10]" 
             [style.left.%]="p * 10" 
             [style.animation-delay.s]="p * 0.5"></div>
      </div>

      <!-- NAVBAR -->
      <nav class="navbar">
        <div class="nav-left">
          <div class="logo-container">
            <div class="logo-icon">🛒</div>
            <div class="logo-text">
              <h1 class="app-title">Mis Pedidos</h1>
              <p class="app-subtitle">Consulta tus compras</p>
            </div>
          </div>
        </div>
        
        <div class="nav-right">
          <button class="btn-nav" (click)="goToProfile()">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            Mi Perfil
          </button>
          <button class="btn-nav" (click)="logout()">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            Salir
          </button>
        </div>
      </nav>

      <!-- MAIN CONTENT -->
      <main class="main-content">
        
        <!-- Page Header -->
        <div class="page-header">
          <div class="header-info">
            <h1>📦 Mis Pedidos</h1>
            <p>Gestiona y consulta el estado de tus compras</p>
          </div>
          <button class="btn-primary" (click)="volverDashboard()">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
            Ir a Comprar
          </button>
        </div>

        <!-- STATS -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon blue">🛒</div>
            <div class="stat-info">
              <div class="stat-value">{{ pedidos.length }}</div>
              <div class="stat-label">Total Pedidos</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon orange">⏳</div>
            <div class="stat-info">
              <div class="stat-value">{{ contarPorEstado('PENDIENTE') }}</div>
              <div class="stat-label">Pendientes</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon purple">⚡</div>
            <div class="stat-info">
              <div class="stat-value">{{ contarPorEstado('EN_PROCESO') }}</div>
              <div class="stat-label">En Proceso</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon green">✓</div>
            <div class="stat-info">
              <div class="stat-value">{{ contarPorEstado('ENTREGADO') }}</div>
              <div class="stat-label">Entregados</div>
            </div>
          </div>
        </div>

        <!-- Search and Filters Section -->
        <div class="search-filter-section">
          <div class="search-box">
            <svg class="search-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input 
              type="text" 
              placeholder="Buscar pedidos por ID, fecha o productos..." 
              [(ngModel)]="searchTerm"
              (input)="aplicarFiltros()"
            />
            <button class="clear-btn" *ngIf="searchTerm" (click)="limpiarBusqueda()">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="filter-section">
            <div class="filter-label">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
              </svg>
              Filtrar por estado:
            </div>
            <div class="filter-chips">
              <div class="filter-chip" 
                   [class.active]="filtroEstado === ''"
                   (click)="filtrarPorEstado('')">
                Todos
              </div>
              <div class="filter-chip" 
                   [class.active]="filtroEstado === 'PENDIENTE'"
                   (click)="filtrarPorEstado('PENDIENTE')">
                Pendiente
              </div>
              <div class="filter-chip" 
                   [class.active]="filtroEstado === 'EN_PROCESO'"
                   (click)="filtrarPorEstado('EN_PROCESO')">
                En Proceso
              </div>
              <div class="filter-chip" 
                   [class.active]="filtroEstado === 'ENVIADO'"
                   (click)="filtrarPorEstado('ENVIADO')">
                Enviado
              </div>
              <div class="filter-chip" 
                   [class.active]="filtroEstado === 'ENTREGADO'"
                   (click)="filtrarPorEstado('ENTREGADO')">
                Entregado
              </div>
            </div>
          </div>

          <div class="results-info" *ngIf="pedidosFiltrados.length !== pedidos.length || searchTerm">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Mostrando {{ pedidosFiltrados.length }} de {{ pedidos.length }} pedidos
            <button class="btn-reset-filters" (click)="resetearFiltros()">
              Limpiar filtros
            </button>
          </div>
        </div>

        <!-- PEDIDOS GRID -->
        <div class="pedidos-grid" *ngIf="pedidosFiltrados.length > 0">
          <div class="pedido-card" *ngFor="let pedido of pedidosFiltrados">
            <div class="card-header-pedido">
              <div class="pedido-id">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
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
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <div>
                    <div class="info-label">Fecha</div>
                    <div class="info-value">{{ pedido.fecha | date:'dd/MM/yyyy' }}</div>
                  </div>
                </div>

                <div class="info-item">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <div>
                    <div class="info-label">Hora</div>
                    <div class="info-value">{{ pedido.fecha | date:'HH:mm' }}</div>
                  </div>
                </div>
              </div>

              <div class="pedido-items">
                <div class="items-header">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                  </svg>
                  {{ pedido.lineasVenta.length }} producto(s)
                </div>
                <div class="items-list">
                  <div class="item" *ngFor="let lv of pedido.lineasVenta">
                    <span class="item-cantidad">{{ lv.cantidad }}×</span>
                    <span class="item-nombre">{{ lv.productoNombre }}</span>
                    <span class="item-precio">{{ lv.precio * lv.cantidad | currency:'EUR' }}</span>
                  </div>
                </div>
              </div>

              <div class="pedido-total">
                <span>Total del Pedido</span>
                <span class="total-amount">{{ totalPedido(pedido) | currency:'EUR' }}</span>
              </div>
            </div>

            <div class="card-footer-pedido">
              <button class="btn-edit" (click)="verDetalle(pedido)">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                Ver Detalles
              </button>
            </div>
          </div>
        </div>

        <!-- EMPTY STATE -->
        <div class="empty-state" *ngIf="pedidosFiltrados.length === 0 && pedidos.length === 0">
          <div class="empty-icon">📦</div>
          <h3>No tienes pedidos</h3>
          <p>Aún no has realizado ningún pedido. ¡Empieza a comprar!</p>
          <button class="btn-primary" (click)="volverDashboard()">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
            Ir a Comprar
          </button>
        </div>

        <!-- NO RESULTS STATE -->
        <div class="empty-state" *ngIf="pedidosFiltrados.length === 0 && pedidos.length > 0">
          <div class="empty-icon">🔍</div>
          <h3>No se encontraron pedidos</h3>
          <p>No hay pedidos que coincidan con los filtros aplicados.</p>
          <button class="btn-secondary" (click)="resetearFiltros()">
            Limpiar Filtros
          </button>
        </div>

      </main>

      <!-- MODAL DETALLE -->
      <div class="modal-backdrop" *ngIf="pedidoSeleccionado" (click)="cerrarModal()">
        <div class="modal-container" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Pedido #{{ pedidoSeleccionado.id }}
            </h2>
            <button class="btn-close" (click)="cerrarModal()">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <div class="detalle-section">
              <h3>📋 Información del Pedido</h3>
              <div class="detalle-grid">
                <div class="detalle-item">
                  <span class="detalle-label">Estado</span>
                  <span class="estado-badge-modal" [attr.data-estado]="pedidoSeleccionado.estado">
                    {{ getEstadoLabel(pedidoSeleccionado.estado) }}
                  </span>
                </div>
                <div class="detalle-item">
                  <span class="detalle-label">Fecha y Hora</span>
                  <span class="detalle-value">{{ pedidoSeleccionado.fecha | date:'dd/MM/yyyy HH:mm' }}</span>
                </div>
                <div class="detalle-item">
                  <span class="detalle-label">ID del Pedido</span>
                  <span class="detalle-value">#{{ pedidoSeleccionado.id }}</span>
                </div>
                <div class="detalle-item">
                  <span class="detalle-label">Productos</span>
                  <span class="detalle-value">{{ pedidoSeleccionado.lineasVenta.length }} artículos</span>
                </div>
              </div>
            </div>

            <div class="detalle-section">
              <h3>📦 Productos del Pedido</h3>
              <div class="lineas-venta-list">
                <div class="linea-item" *ngFor="let lv of pedidoSeleccionado.lineasVenta">
                  <div class="linea-producto">
                    <span class="linea-cantidad">{{ lv.cantidad }}×</span>
                    <span class="linea-nombre">{{ lv.productoNombre }}</span>
                  </div>
                  <div class="linea-precios">
                    <span class="linea-precio-unit">{{ lv.precio | currency:'EUR' }}/u</span>
                    <span class="linea-precio-total">{{ lv.precio * lv.cantidad | currency:'EUR' }}</span>
                  </div>
                </div>
              </div>
              
              <div class="modal-total">
                <span>Total del Pedido</span>
                <span class="modal-total-amount">{{ totalPedido(pedidoSeleccionado) | currency:'EUR' }}</span>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-secondary" (click)="cerrarModal()">Cerrar</button>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    :host {
      --primary: #6366f1;
      --accent: #06b6d4;
      --bg-dark: #0f172a;
      --bg-card: #1e293b;
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --border: rgba(255,255,255,0.1);
      --success: #10b981;
      --danger: #ef4444;
      --warning: #f59e0b;
      --purple: #8b5cf6;
      display: block;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    .gestion-layout {
      min-height: 100vh;
      background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
      color: var(--text);
      font-family: 'Inter', -apple-system, sans-serif;
      position: relative;
      overflow-x: hidden;
    }

    /* PARTICLES */
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
      0%, 100% {
        transform: translateY(100vh) scale(0);
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      90% {
        opacity: 1;
      }
      100% {
        transform: translateY(-10vh) scale(1);
        opacity: 0;
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
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .logo-icon {
      font-size: 2rem;
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
      gap: 0.75rem;
    }

    .btn-nav {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.6rem 1rem;
      background: rgba(255,255,255,0.1);
      border: 1px solid var(--border);
      border-radius: 10px;
      color: var(--text);
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-nav:hover {
      background: rgba(255,255,255,0.15);
      transform: translateY(-1px);
    }

    /* MAIN */
    .main-content {
      position: relative;
      z-index: 1;
      max-width: 1300px;
      margin: 0 auto;
      padding: 2rem;
    }

    /* PAGE HEADER */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .header-info h1 {
      font-size: 1.75rem;
      font-weight: 700;
      margin: 0 0 0.25rem;
    }

    .header-info p {
      color: var(--text-muted);
      font-size: 0.9rem;
      margin: 0;
    }

    /* BUTTONS */
    .btn-primary {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      border: none;
      border-radius: 10px;
      color: white;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);
    }

    .btn-secondary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      background: rgba(100, 116, 139, 0.2);
      border: 1px solid var(--border);
      border-radius: 10px;
      color: var(--text-muted);
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-secondary:hover {
      background: rgba(100, 116, 139, 0.3);
      color: var(--text);
      transform: translateY(-1px);
    }

    .btn-edit {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.6rem 1rem;
      background: #eef2ff;
      border: 1px solid #c7d2fe;
      border-radius: 999px;
      color: #4f46e5;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-edit:hover {
      background: #e0e7ff;
      transform: translateY(-1px);
    }

    .btn-edit svg {
      width: 16px;
      height: 16px;
    }

    /* STATS */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: rgba(30, 41, 59, 0.6);
      backdrop-filter: blur(10px);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 1.25rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: all 0.3s;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      border-color: var(--primary);
    }

    .stat-icon {
      font-size: 2rem;
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-icon.blue {
      background: rgba(59, 130, 246, 0.2);
    }

    .stat-icon.green {
      background: rgba(16, 185, 129, 0.2);
    }

    .stat-icon.orange {
      background: rgba(245, 158, 11, 0.2);
    }

    .stat-icon.purple {
      background: rgba(139, 92, 246, 0.2);
    }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 1.75rem;
      font-weight: 700;
    }

    .stat-label {
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    /* SEARCH AND FILTERS */
    .search-filter-section {
      background: rgba(30, 41, 59, 0.6);
      backdrop-filter: blur(10px);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 1.5rem;
      margin-bottom: 2rem;
    }

    .search-box {
      position: relative;
      margin-bottom: 1.5rem;
    }

    .search-icon {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-muted);
      pointer-events: none;
    }

    .search-box input {
      width: 100%;
      padding: 0.85rem 3rem 0.85rem 3rem;
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid var(--border);
      border-radius: 10px;
      color: var(--text);
      font-size: 0.95rem;
      transition: all 0.3s;
    }

    .search-box input::placeholder {
      color: rgba(148, 163, 184, 0.5);
    }

    .search-box input:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
    }

    .clear-btn {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      width: 32px;
      height: 32px;
      border: none;
      background: rgba(100, 116, 139, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }

    .clear-btn:hover {
      background: rgba(100, 116, 139, 0.3);
    }

    .clear-btn svg {
      color: var(--text-muted);
    }

    .filter-section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .filter-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      color: var(--text-muted);
    }

    .filter-label svg {
      width: 18px;
      height: 18px;
    }

    .filter-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .filter-chip {
      padding: 0.4rem 0.9rem;
      border-radius: 999px;
      border: 1px solid var(--border);
      font-size: 0.8rem;
      cursor: pointer;
      color: var(--text-muted);
      background: rgba(15, 23, 42, 0.5);
      transition: all 0.2s ease;
    }

    .filter-chip.active {
      background: linear-gradient(135deg, #6366f1, #06b6d4);
      color: #f9fafb;
      border-color: transparent;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
    }

    .filter-chip:hover {
      border-color: #6366f1;
    }

    .results-info {
      margin-top: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      color: var(--text-muted);
      flex-wrap: wrap;
    }

    .results-info svg {
      width: 18px;
      height: 18px;
    }

    .btn-reset-filters {
      margin-left: auto;
      padding: 0.35rem 0.8rem;
      border-radius: 999px;
      border: none;
      background: rgba(148, 163, 184, 0.2);
      color: var(--text);
      font-size: 0.75rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-reset-filters:hover {
      background: rgba(148, 163, 184, 0.3);
    }

    /* PEDIDOS GRID */
    .pedidos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
      position: relative;
      z-index: 1;
    }

    .pedido-card {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
      animation: fadeInUp 0.5s ease;
    }

    .pedido-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }

    .card-header-pedido {
      padding: 1.5rem;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-bottom: 2px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .pedido-id {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1.1rem;
      font-weight: 700;
      color: #1e293b;
    }

    .pedido-id svg {
      width: 20px;
      height: 20px;
      color: #667eea;
    }

    .estado-badge {
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .estado-badge[data-estado="PENDIENTE"] {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: white;
      box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
    }

    .estado-badge[data-estado="EN_PROCESO"] {
      background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
      color: white;
      box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
    }

    .estado-badge[data-estado="ENVIADO"] {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
    }

    .estado-badge[data-estado="ENTREGADO"] {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
    }

    .card-body-pedido {
      padding: 1.5rem;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .pedido-info-row {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .info-item {
      flex: 1 1 160px;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      background: #f8fafc;
      border-radius: 8px;
    }

    .info-item svg {
      width: 18px;
      height: 18px;
      color: #6366f1;
    }

    .info-label {
      font-size: 0.75rem;
      color: #94a3b8;
    }

    .info-value {
      font-size: 0.95rem;
      color: #0f172a;
      font-weight: 600;
    }

    .pedido-items {
      background: #f8fafc;
      border-radius: 10px;
      padding: 1rem;
    }

    .items-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.85rem;
      font-weight: 600;
      color: #475569;
      margin-bottom: 0.75rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid #e2e8f0;
    }

    .items-header svg {
      width: 16px;
      height: 16px;
      color: #667eea;
    }

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
      background: #e2e8f0;
      border-radius: 4px;
    }

    .items-list::-webkit-scrollbar-thumb {
      background: #94a3b8;
      border-radius: 4px;
    }

    .item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.85rem;
      padding: 6px;
      background: white;
      border-radius: 6px;
    }

    .item-cantidad {
      color: #667eea;
      font-weight: 700;
      min-width: 30px;
    }

    .item-nombre {
      flex: 1;
      color: #334155;
      font-weight: 500;
    }

    .item-precio {
      color: #1e293b;
      font-weight: 700;
    }

    .pedido-total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: flex-end;
    }

    /* EMPTY STATE */
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      position: relative;
      z-index: 1;
    }

    .empty-icon {
      font-size: 3rem;
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

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
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

    .detalle-section {
      margin-bottom: 2rem;
    }

    .detalle-section:last-child {
      margin-bottom: 0;
    }

    .detalle-section h3 {
      font-size: 1.1rem;
      color: #1e293b;
      font-weight: 700;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #e2e8f0;
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
      background: #f8fafc;
      border-radius: 10px;
    }

    .detalle-label {
      font-size: 0.8rem;
      color: #64748b;
      font-weight: 500;
    }

    .detalle-value {
      font-size: 1rem;
      color: #1e293b;
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
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: white;
    }

    .estado-badge-modal[data-estado="EN_PROCESO"] {
      background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
      color: white;
    }

    .estado-badge-modal[data-estado="ENVIADO"] {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
    }

    .estado-badge-modal[data-estado="ENTREGADO"] {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
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
      background: #f8fafc;
      border-radius: 10px;
      border: 1px solid #e2e8f0;
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
      color: #667eea;
      min-width: 35px;
    }

    .linea-nombre {
      font-size: 0.95rem;
      font-weight: 600;
      color: #334155;
    }

    .linea-precios {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 2px;
    }

    .linea-precio-unit {
      font-size: 0.75rem;
      color: #64748b;
      font-weight: 500;
    }

    .linea-precio-total {
      font-size: 1.1rem;
      color: #1e293b;
      font-weight: 700;
    }

    .modal-total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }

    /* ANIMATIONS */
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
      .main-content {
        padding: 1.5rem 1rem;
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
    }

    @media (max-width: 480px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .header-info h1 {
        font-size: 1.4rem;
      }

      .pedido-card {
        border-radius: 12px;
      }

      .modal-container {
        border-radius: 16px;
      }

      .stat-value {
        font-size: 1.5rem;
      }

      .total-amount {
        font-size: 1.25rem;
      }
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

  constructor(
    private pedidoService: PedidoService, 
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      console.error('No hay usuario en localStorage');
      this.pedidos = [];
      this.pedidosFiltrados = [];
      return;
    }

    const user = JSON.parse(userStr);
    const userId = user.id;

    this.authService.getClienteData(userId).subscribe({
      next: (cliente) => {
        const clienteId = cliente?.id;

        if (!clienteId) {
          console.error('El usuario no tiene cliente asociado.');
          this.pedidos = [];
          this.pedidosFiltrados = [];
          return;
        }

        this.pedidoService.getMisPedidos(clienteId).subscribe({
          next: (data) => {
            console.log('Pedidos recibidos:', data);
            this.pedidos = data;
            this.pedidosFiltrados = [...this.pedidos];
          },
          error: (err) => {
            console.error('Error al obtener los pedidos del cliente', err);
            this.pedidos = [];
            this.pedidosFiltrados = [];
          }
        });
      },
      error: (err) => {
        console.error('Error al obtener datos de cliente:', err);
        this.pedidos = [];
        this.pedidosFiltrados = [];
      }
    });
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

  toggleMenu() { 
    this.menuOpen = !this.menuOpen; 
  }

  goToProfile() { 
    this.menuOpen = false; 
    this.router.navigate(['/perfil']); 
  }

  goToMisPedidos() { 
    this.menuOpen = false; 
    this.router.navigate(['/mispedidos']); 
  }

  logout() { 
    this.menuOpen = false; 
    localStorage.removeItem('token'); 
    this.router.navigate(['/']); 
  }

  volverDashboard() {
    this.router.navigate(['/dashboard']);
  }

  aplicarFiltros() {
  const term = this.searchTerm?.toLowerCase().trim();
  this.pedidosFiltrados = this.pedidos.filter(p => {
    const coincideEstado = this.filtroEstado ? p.estado === this.filtroEstado : true;

    const idMatch = term
      ? (p.id != null && p.id.toString().includes(term))
      : true;

    const fechaStr = p.fecha ? new Date(p.fecha).toLocaleDateString('es-ES') : '';
    const fechaMatch = term ? fechaStr.toLowerCase().includes(term) : true;

    const productosStr = (p.lineasVenta || [])
      .map(lv => lv.productoNombre || '')
      .join(' ')
      .toLowerCase();
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
