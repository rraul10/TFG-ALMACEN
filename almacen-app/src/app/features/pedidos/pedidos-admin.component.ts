import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pedido, PedidoService } from '@core/services/pedido.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RoleService } from '@core/services/role.service';

@Component({
  selector: 'app-pedidos-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  template: `
    <div class="gestion-layout" *ngIf="isAdmin">
      <div class="background-pattern"></div>

      <!-- HEADER -->
      <header class="page-header">
        <div class="header-content">
          <div class="header-title">
            <div class="title-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <div>
              <h1>Gestión de Pedidos</h1>
              <p class="subtitle">Administra y monitorea todos los pedidos</p>
            </div>
          </div>
          
          <div class="header-actions">
            <button (click)="volverAlDashboard()" class="btn btn-secondary">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
              Dashboard
            </button>
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
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
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

        <!-- SEARCH AND FILTERS -->
        <section class="search-filter-section">
          <div class="search-box">
            <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input type="number" 
                   placeholder="Buscar por ID de cliente..." 
                   [(ngModel)]="clienteIdBusqueda"
                   (keyup.enter)="buscarPorCliente()">
            <button *ngIf="clienteIdBusqueda" class="clear-btn" (click)="limpiarBusqueda()">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="filter-section">
            <div class="filter-label">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
              </svg>
              Filtrar por estado
            </div>
            <div class="filter-chips">
              <span class="filter-chip" 
                    [class.active]="filtroEstado === null"
                    (click)="filtrarPorEstado(null)">
                Todos
              </span>
              <span class="filter-chip" 
                    [class.active]="filtroEstado === 'PENDIENTE'"
                    (click)="filtrarPorEstado('PENDIENTE')">
                Pendiente
              </span>
              <span class="filter-chip" 
                    [class.active]="filtroEstado === 'EN_PROCESO'"
                    (click)="filtrarPorEstado('EN_PROCESO')">
                En Proceso
              </span>
              <span class="filter-chip" 
                    [class.active]="filtroEstado === 'ENVIADO'"
                    (click)="filtrarPorEstado('ENVIADO')">
                Enviado
              </span>
              <span class="filter-chip" 
                    [class.active]="filtroEstado === 'ENTREGADO'"
                    (click)="filtrarPorEstado('ENTREGADO')">
                Entregado
              </span>
            </div>
          </div>

          <div class="results-info" *ngIf="pedidosFiltrados.length > 0 || filtroEstado">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>Mostrando {{ pedidosFiltrados.length }} de {{ pedidos.length }} pedidos</span>
            <button *ngIf="filtroEstado || clienteIdBusqueda" 
                    class="btn-reset-filters" 
                    (click)="resetearFiltros()">
              Limpiar filtros
            </button>
          </div>
        </section>

        <!-- PEDIDOS GRID -->
        <div class="pedidos-grid" *ngIf="pedidosFiltrados.length > 0">
          <div class="pedido-card" *ngFor="let pedido of pedidosFiltrados">
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
              <div class="pedido-info-row">
                <div class="info-item">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                  <div>
                    <div class="info-label">Cliente</div>
                    <div class="info-value">ID: {{ pedido.clienteId }}</div>
                  </div>
                </div>

                <div class="info-item">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <div>
                    <div class="info-label">Fecha</div>
                    <div class="info-value">{{ pedido.fecha | date:'short' }}</div>
                  </div>
                </div>
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
                    <span class="item-precio">{{ lv.precio * lv.cantidad | number:'1.2-2' }}€</span>
                  </div>
                </div>
              </div>

              <div class="pedido-total">
                <span>Total</span>
                <span class="total-amount">{{ getTotal(pedido) | number:'1.2-2' }}€</span>
              </div>

              <div class="estado-selector">
                <label>Cambiar estado:</label>
                <select [(ngModel)]="pedido.estado" (change)="cambiarEstado(pedido)">
                  <option value="PENDIENTE">Pendiente</option>
                  <option value="EN_PROCESO">En proceso</option>
                  <option value="ENVIADO">Enviado</option>
                  <option value="ENTREGADO">Entregado</option>
                </select>
              </div>
            </div>

            <div class="card-footer">
              <button class="btn btn-edit" (click)="verDetalles(pedido)">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                Ver Detalles
              </button>
              <button class="btn btn-delete" (click)="eliminarPedido(pedido.id!)">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
                Eliminar
              </button>
            </div>
          </div>
        </div>

        <!-- EMPTY STATE -->
        <div class="empty-state" *ngIf="pedidosFiltrados.length === 0">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
          </svg>
          <h3>No hay pedidos</h3>
          <p>{{ filtroEstado || clienteIdBusqueda ? 'No se encontraron pedidos con los filtros aplicados' : 'Aún no hay pedidos en el sistema' }}</p>
          <button *ngIf="filtroEstado || clienteIdBusqueda" 
                  class="btn btn-primary" 
                  (click)="resetearFiltros()">
            Limpiar filtros
          </button>
        </div>

      </main>

      <!-- MODAL DETALLES -->
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
                  <span class="detalle-label">Cliente ID:</span>
                  <span class="detalle-value">{{ pedidoSeleccionado.clienteId }}</span>
                </div>
                <div class="detalle-item">
                  <span class="detalle-label">Estado:</span>
                  <span class="estado-badge-modal" [attr.data-estado]="pedidoSeleccionado.estado">
                    {{ getEstadoLabel(pedidoSeleccionado.estado) }}
                  </span>
                </div>
                <div class="detalle-item">
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
                <span class="modal-total-amount">{{ getTotal(pedidoSeleccionado) | number:'1.2-2' }}€</span>
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
    /* Importar estilos base del documento */
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

    /* SEARCH AND FILTERS */
    .search-filter-section {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      position: relative;
      z-index: 1;
      animation: fadeInUp 0.5s ease;
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
      width: 20px;
      height: 20px;
      color: #94a3b8;
      pointer-events: none;
    }

    .search-box input {
      width: 100%;
      padding: 14px 50px 14px 50px;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      font-size: 1rem;
      transition: all 0.3s ease;
      background: #f8fafc;
    }

    .search-box input:focus {
      outline: none;
      border-color: #667eea;
      background: white;
      box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    }

    .clear-btn {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      width: 32px;
      height: 32px;
      border: none;
      background: #f1f5f9;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }

    .clear-btn:hover {
      background: #e2e8f0;
    }

    .clear-btn svg {
      width: 16px;
      height: 16px;
      color: #64748b;
    }

    .filter-section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .filter-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      color: #334155;
      font-size: 0.95rem;
    }

    .filter-label svg {
      width: 18px;
      height: 18px;
      color: #667eea;
    }

    .filter-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .filter-chip {
      padding: 8px 16px;
      border: 2px solid #e2e8f0;
      background: #f8fafc;
      color: #64748b;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .filter-chip:hover {
      border-color: #667eea;
      background: #f1f5f9;
      color: #667eea;
    }

    .filter-chip.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-color: transparent;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .results-info {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background: #f1f5f9;
      border-radius: 10px;
      color: #475569;
      font-size: 0.9rem;
      font-weight: 500;
      margin-top: 1rem;
    }

    .results-info svg {
      width: 18px;
      height: 18px;
      color: #667eea;
      flex-shrink: 0;
    }

    .btn-reset-filters {
      margin-left: auto;
      padding: 6px 14px;
      background: white;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 600;
      color: #64748b;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-reset-filters:hover {
      background: #667eea;
      color: white;
      border-color: #667eea;
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

    .pedido-info-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .info-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 12px;
      background: #f8fafc;
      border-radius: 10px;
    }

    .info-item svg {
      width: 20px;
      height: 20px;
      color: #667eea;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .info-label {
      font-size: 0.75rem;
      color: #64748b;
      font-weight: 500;
      margin-bottom: 2px;
    }

    .info-value {
      font-size: 0.9rem;
      color: #1e293b;
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

    .estado-selector {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .estado-selector label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #334155;
    }

    .estado-selector select {
      padding: 10px 14px;
      border: 2px solid #e2e8f0;
      border-radius: 10px;
      font-size: 0.9rem;
      font-weight: 600;
      background: #f8fafc;
      color: #1e293b;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .estado-selector select:focus {
      outline: none;
      border-color: #667eea;
      background: white;
      box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
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
        justify-content: flex-start;
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

      .search-filter-section {
        padding: 1rem;
      }

      .search-box input {
        padding: 12px 45px 12px 45px;
        font-size: 0.9rem;
      }

      .pedidos-grid {
        grid-template-columns: 1fr;
      }

      .stats-container {
        grid-template-columns: 1fr;
      }

      .pedido-info-row {
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

      .results-info {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
      }

      .btn-reset-filters {
        width: 100%;
        margin-left: 0;
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
  `]
})
export class PedidosAdminComponent implements OnInit {
  pedidos: Pedido[] = [];
  pedidosFiltrados: Pedido[] = [];
  pedidoSeleccionado: Pedido | null = null;
  clienteIdBusqueda: number | null = null;
  filtroEstado: string | null = null;
  isAdmin = false;

  constructor(
    private pedidoService: PedidoService,
    private roleService: RoleService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.isAdmin = this.roleService.isAdmin();
    if (!this.isAdmin) return;

    this.cargarPedidos();
  }

  cargarPedidos() {
    this.pedidoService.getAll().subscribe({
      next: (data) => {
        this.pedidos = data;
        this.aplicarFiltros();
      },
      error: () => {
        this.pedidos = this.pedidoService.obtenerLocal();
        this.aplicarFiltros();
      }
    });
  }

  aplicarFiltros() {
    let resultado = [...this.pedidos];

    // Filtrar por cliente
    if (this.clienteIdBusqueda) {
      resultado = resultado.filter(p => p.clienteId === this.clienteIdBusqueda);
    }

    // Filtrar por estado
    if (this.filtroEstado) {
      resultado = resultado.filter(p => p.estado === this.filtroEstado);
    }

    this.pedidosFiltrados = resultado;
  }

  getTotal(pedido: Pedido): number {
    return pedido.lineasVenta.reduce((acc, lv) => acc + lv.cantidad * lv.precio, 0);
  }

  buscarPorCliente() {
    if (!this.clienteIdBusqueda) return;

    this.pedidoService.getByCliente(this.clienteIdBusqueda).subscribe({
      next: (data) => {
        const pedidosLocal = this.pedidoService.obtenerLocal()
          .filter(p => p.clienteId === this.clienteIdBusqueda);
        this.pedidos = [...data, ...pedidosLocal];
        this.aplicarFiltros();
      },
      error: (err) => {
        console.error(err);
        this.pedidos = this.pedidoService.obtenerLocal()
          .filter(p => p.clienteId === this.clienteIdBusqueda);
        this.aplicarFiltros();
      }
    });
  }

  limpiarBusqueda() {
    this.clienteIdBusqueda = null;
    this.cargarPedidos();
  }

  filtrarPorEstado(estado: string | null) {
    this.filtroEstado = estado;
    this.aplicarFiltros();
  }

  resetearFiltros() {
    this.clienteIdBusqueda = null;
    this.filtroEstado = null;
    this.cargarPedidos();
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

  cambiarEstado(pedido: Pedido) {
    if (!pedido.id || !pedido.estado) return;

    this.pedidoService.actualizarEstado(pedido.id, pedido.estado).subscribe({
      next: () => {
        this.snackBar.open('Estado actualizado correctamente', 'Cerrar', { duration: 3000 });
        this.aplicarFiltros();
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error al actualizar el estado', 'Cerrar', { duration: 3000 });
      }
    });
  }

  eliminarPedido(id: number) {
    if (!confirm('¿Estás seguro de que deseas eliminar este pedido?')) return;

    this.pedidoService.delete(id).subscribe({
      next: () => {
        this.pedidos = this.pedidos.filter(p => p.id !== id);
        this.aplicarFiltros();
        this.snackBar.open('Pedido eliminado correctamente', 'Cerrar', { duration: 3000 });
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error al eliminar el pedido', 'Cerrar', { duration: 3000 });
      }
    });
  }

  verDetalles(pedido: Pedido) {
    this.pedidoSeleccionado = pedido;
  }

  cerrarModal() {
    this.pedidoSeleccionado = null;
  }

  volverAlDashboard() {
    this.router.navigate(['/dashboard']);
  }
}