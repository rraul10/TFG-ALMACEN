import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { PedidoService, Pedido } from '@core/services/pedido.service';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-mis-pedidos',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterModule],
  template: `
    <div class="mis-pedidos-layout">
      <div class="background-pattern"></div>

      <!-- HEADER -->
      <header class="page-header">
        <div class="header-content">
          <div class="header-title">
            <div class="title-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
            </div>
            <div>
              <h1>Mis Pedidos</h1>
              <p class="subtitle">Consulta el estado de tus compras</p>
            </div>
          </div>
          
          <div class="header-actions">
            <button (click)="volverDashboard()" class="btn btn-secondary">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
              Dashboard
            </button>
            <div class="user-menu" (click)="toggleMenu()">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/847/847969.png" 
                alt="Usuario" 
                class="user-icon"
              />
              <div class="menu-dropdown" *ngIf="menuOpen">
                <div class="menu-item" (click)="goToProfile()">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                  Mi perfil
                </div>
                <div class="menu-item" (click)="goToMisPedidos()">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                  </svg>
                  Mis pedidos
                </div>
                <div class="menu-item logout" (click)="logout()">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                  </svg>
                  Cerrar sesión
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- CONTENT -->
      <main class="page-content">
        
        <!-- STATS -->
        <div class="stats-container">
          <div class="stat-card">
            <div class="stat-icon blue">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
            </div>
            <div class="stat-info">
              <div class="stat-label">Total Pedidos</div>
              <div class="stat-value">{{ pedidos.length }}</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon orange">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="stat-info">
              <div class="stat-label">Pendientes</div>
              <div class="stat-value">{{ contarPorEstado('PENDIENTE') }}</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon purple">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <div class="stat-info">
              <div class="stat-label">En Proceso</div>
              <div class="stat-value">{{ contarPorEstado('EN_PROCESO') }}</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon green">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <div class="stat-info">
              <div class="stat-label">Entregados</div>
              <div class="stat-value">{{ contarPorEstado('ENTREGADO') }}</div>
            </div>
          </div>
        </div>

        <!-- PEDIDOS LIST -->
        <div class="pedidos-grid" *ngIf="pedidos.length > 0">
          <div class="pedido-card" *ngFor="let pedido of pedidos">
            <div class="card-header-pedido">
              <div class="pedido-id">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <div class="pedido-fecha">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                {{ pedido.fecha | date:'dd/MM/yyyy HH:mm' }}
              </div>

              <div class="pedido-items">
                <div class="items-header">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <span>Total</span>
                <span class="total-amount">{{ totalPedido(pedido) | currency:'EUR' }}</span>
              </div>
            </div>

            <div class="card-footer">
              <button class="btn btn-view" (click)="verDetalle(pedido)">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div class="empty-state" *ngIf="pedidos.length === 0">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
          </svg>
          <h3>No tienes pedidos</h3>
          <p>Aún no has realizado ningún pedido. ¡Empieza a comprar!</p>
          <button class="btn btn-primary" (click)="volverDashboard()">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
            Ir a comprar
          </button>
        </div>

      </main>

      <!-- MODAL DETALLE -->
      <div class="modal-backdrop" *ngIf="pedidoSeleccionado" (click)="cerrarModal()">
        <div class="modal-container" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Pedido #{{ pedidoSeleccionado.id }}
            </h2>
            <button class="btn-close" (click)="cerrarModal()">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <div class="detalle-section">
              <h3>Información del Pedido</h3>
              <div class="detalle-grid">
                <div class="detalle-item">
                  <span class="detalle-label">Estado:</span>
                  <span class="estado-badge-modal" [attr.data-estado]="pedidoSeleccionado.estado">
                    {{ getEstadoLabel(pedidoSeleccionado.estado) }}
                  </span>
                </div>
                <div class="detalle-item">
                  <span class="detalle-label">Fecha:</span>
                  <span class="detalle-value">{{ pedidoSeleccionado.fecha | date:'dd/MM/yyyy HH:mm' }}</span>
                </div>
              </div>
            </div>

            <div class="detalle-section">
              <h3>Productos</h3>
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
            <button class="btn btn-secondary" (click)="cerrarModal()">Cerrar</button>
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

    .mis-pedidos-layout {
      min-height: 100vh;
      background: #f8fafc;
      font-family: 'Inter', 'Segoe UI', Roboto, sans-serif;
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
      align-items: center;
    }

    /* USER MENU */
    .user-menu {
      position: relative;
      cursor: pointer;
    }

    .user-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: white;
      padding: 4px;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .user-icon:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    .menu-dropdown {
      position: absolute;
      top: 60px;
      right: 0;
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      width: 200px;
      overflow: hidden;
      animation: fadeIn 0.2s ease;
      z-index: 100;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .menu-item {
      padding: 12px 16px;
      font-size: 0.95rem;
      color: #334155;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 500;
    }

    .menu-item svg {
      width: 18px;
      height: 18px;
      color: #667eea;
    }

    .menu-item:hover {
      background: #f1f5f9;
    }

    .menu-item.logout {
      color: #dc2626;
      border-top: 1px solid #e2e8f0;
    }

    .menu-item.logout svg {
      color: #dc2626;
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
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .btn-view {
      background: #3b82f6;
      color: white;
      width: 100%;
      justify-content: center;
    }

    .btn-view:hover {
      background: #2563eb;
      transform: translateY(-2px);
    }

    /* CONTENT */
    .page-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
      position: relative;
    }

    /* STATS */
    .stats-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
      position: relative;
      z-index: 1;
    }

    .stat-card {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
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

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-icon svg {
      width: 28px;
      height: 28px;
      color: white;
    }

    .stat-icon.blue {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    }

    .stat-icon.green {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    }

    .stat-icon.orange {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    }

    .stat-icon.purple {
      background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    }

    .stat-info {
      flex: 1;
    }

    .stat-label {
      font-size: 0.85rem;
      color: #64748b;
      font-weight: 500;
      margin-bottom: 4px;
    }

    .stat-value {
      font-size: 1.75rem;
      color: #1e293b;
      font-weight: 700;
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
      animation: fadeInUp 0.5s ease;
      display: flex;
      flex-direction: column;
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

    .pedido-fecha {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px;
      background: #f8fafc;
      border-radius: 8px;
      font-size: 0.9rem;
      color: #475569;
      font-weight: 500;
    }

    .pedido-fecha svg {
      width: 18px;
      height: 18px;
      color: #667eea;
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

    .card-footer {
      padding: 1rem 1.5rem;
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
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

    /* RESPONSIVE */
    @media (max-width: 1024px) {
      .header-content {
        flex-direction: column;
        align-items: flex-start;
      }

      .header-actions {
        width: 100%;
        justify-content: space-between;
      }

      .pedidos-grid {
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      }

      .stats-container {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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

      .page-content {
        padding: 1rem;
      }

      .pedidos-grid {
        grid-template-columns: 1fr;
      }

      .stats-container {
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

      .modal-footer .btn {
        width: 100%;
        justify-content: center;
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
      .header-title h1 {
        font-size: 1.25rem;
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
  pedidoSeleccionado: Pedido | null = null;
  menuOpen = false;

  constructor(
    private pedidoService: PedidoService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    const clienteId = 5;
    this.pedidoService.getByCliente(clienteId).subscribe({
      next: (data) => this.pedidos = data,
      error: (err) => {
        console.error('Error al obtener los pedidos del cliente', err);
        this.pedidos = [];
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
}