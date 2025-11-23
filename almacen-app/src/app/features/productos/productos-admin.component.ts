import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Producto, ProductoService } from '@core/services/producto.service';
import { RoleService } from '@core/services/role.service';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-productos-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  template: `
    <div class="gestion-layout">
      <!-- NAVBAR -->
      <header class="navbar">
        <div class="nav-left">
          <div class="logo-container" (click)="volverAlDashboard()" style="cursor:pointer">
            <span class="logo-icon">⚡</span>
            <div class="logo-text">
              <h1 class="app-title">TechStore</h1>
              <span class="app-subtitle">Premium Electronics</span>
            </div>
          </div>
        </div>
        <div class="nav-right">
          <button class="btn-nav" (click)="volverAlDashboard()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Dashboard
          </button>
        </div>
      </header>

      <!-- CONTENT -->
      <main class="main-content">
        <!-- Page Header -->
        <div class="page-header">
          <div class="header-info">
            <h1>📦 Gestión de Productos</h1>
            <p>Administra el inventario del almacén</p>
          </div>
          <button class="btn-primary" (click)="nuevoProducto()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
            Nuevo Producto
          </button>
        </div>

        <!-- Stats -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon blue">📦</div>
            <div class="stat-info">
              <span class="stat-value">{{ productos.length }}</span>
              <span class="stat-label">Total Productos</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon green">✅</div>
            <div class="stat-info">
              <span class="stat-value">{{ getProductosEnStock() }}</span>
              <span class="stat-label">En Stock</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon orange">⚠️</div>
            <div class="stat-info">
              <span class="stat-value">{{ getProductosStockBajo() }}</span>
              <span class="stat-label">Stock Bajo</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon purple">💰</div>
            <div class="stat-info">
              <span class="stat-value">{{ getValorTotal() | currency:'EUR':'symbol':'1.0-0' }}</span>
              <span class="stat-label">Valor Total</span>
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
              placeholder="Buscar productos por nombre o descripción..."
            />
            <button class="clear-btn" *ngIf="searchTerm" (click)="limpiarBusqueda()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6L18 18"/></svg>
            </button>
          </div>

          <div class="filter-section" *ngIf="getTiposUnicos().length > 0">
            <div class="filter-label">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
              </svg>
              Filtrar por tipo:
            </div>
            <div class="filter-chips">
              <button 
                class="filter-chip" 
                [class.active]="filtroTipo === ''"
                (click)="cambiarFiltroTipo('')"
              >
                Todos ({{ productos.length }})
              </button>
              <button 
                *ngFor="let tipo of getTiposUnicos()" 
                class="filter-chip"
                [class.active]="filtroTipo === tipo"
                (click)="cambiarFiltroTipo(tipo)"
              >
                {{ tipo }} ({{ contarPorTipo(tipo) }})
              </button>
            </div>
          </div>

          <div class="results-info" *ngIf="searchTerm || filtroTipo">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
            </svg>
            Mostrando {{ productosFiltrados.length }} de {{ productos.length }} productos
            <button class="btn-reset-filters" (click)="limpiarFiltros()">
              Limpiar filtros
            </button>
          </div>
        </div>

        <!-- Grid de productos -->
        <div class="productos-grid" *ngIf="productosFiltrados.length > 0">
          <div class="producto-card" *ngFor="let p of productosFiltrados">
            <div class="card-header-product">
              <img [src]="'http://localhost:8080/files/' + p.imagen" [alt]="p.nombre" class="producto-imagen" />
              <span class="badge-stock" [class.low-stock]="p.stock < 10 && p.stock > 0" [class.out-stock]="p.stock === 0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 7H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z"/><path d="M16 21V5c0-.5-.2-1-.6-1.4-.4-.4-.9-.6-1.4-.6h-4c-.5 0-1 .2-1.4.6-.4.4-.6.9-.6 1.4v16"/>
                </svg>
                {{ p.stock }}
              </span>
            </div>
            <div class="card-body-product">
              <div class="product-type">{{ p.tipo }}</div>
              <h3>{{ p.nombre }}</h3>
              <p class="product-description">{{ p.descripcion || 'Sin descripción' }}</p>
              <div class="product-price">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2v20M17 5H9.5C8.6 5 7.7 5.4 7 6s-1 1.4-1 2.3c0 .9.4 1.8 1 2.4.6.7 1.5 1 2.5 1H14.5c.9 0 1.8.4 2.4 1 .7.7 1 1.5 1 2.5s-.3 1.8-1 2.5c-.6.6-1.5 1-2.4 1H6"/>
                </svg>
                <span>{{ p.precio | currency:'EUR' }}</span>
              </div>
            </div>
            <div class="card-footer-product">
              <button class="btn-edit" (click)="seleccionarProducto(p)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Editar
              </button>
              <button class="btn-delete" (click)="eliminarProducto(p.id!)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                Eliminar
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div class="empty-state" *ngIf="productosFiltrados.length === 0 && productos.length === 0">
          <div class="empty-icon">📦</div>
          <h3>No hay productos</h3>
          <p>Añade el primer producto al inventario</p>
          <button class="btn-primary" (click)="nuevoProducto()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
            Crear Producto
          </button>
        </div>

        <!-- Sin resultados -->
        <div class="empty-state" *ngIf="productosFiltrados.length === 0 && productos.length > 0">
          <div class="empty-icon">🔍</div>
          <h3>No se encontraron productos</h3>
          <p>No hay productos que coincidan con tu búsqueda o filtro</p>
          <button class="btn-primary" (click)="limpiarFiltros()">
            Limpiar filtros
          </button>
        </div>
      </main>

      <!-- MODAL -->
      <div class="modal-overlay" *ngIf="productoSeleccionado" (click)="cancelarEdicion()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{ productoSeleccionado.id ? '✏️ Editar Producto' : '➕ Nuevo Producto' }}</h2>
            <button class="btn-close" (click)="cancelarEdicion()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-grid">
              <div class="form-group full-width">
                <label>Nombre del Producto</label>
                <input type="text" [(ngModel)]="productoSeleccionado.nombre" placeholder="Ej: Laptop Dell XPS 15"/>
              </div>
              <div class="form-group">
                <label>Tipo/Categoría</label>
                <input type="text" [(ngModel)]="productoSeleccionado.tipo" placeholder="Ej: Electrónica"/>
              </div>
              <div class="form-group">
                <label>Precio (€)</label>
                <input type="number" [(ngModel)]="productoSeleccionado.precio" placeholder="0.00" step="0.01"/>
              </div>
              <div class="form-group full-width">
                <label>Stock Disponible</label>
                <input type="number" [(ngModel)]="productoSeleccionado.stock" placeholder="0"/>
              </div>
              <div class="form-group full-width">
                <label>Descripción</label>
                <textarea 
                  [(ngModel)]="productoSeleccionado.descripcion" 
                  placeholder="Describe el producto..."
                  rows="3"
                ></textarea>
              </div>
              <div class="form-group full-width">
                <label>Imagen del Producto</label>
                <div class="file-upload">
                  <input type="file" id="imagen-input" (change)="onFileSelected($event)" accept="image/*"/>
                  <label for="imagen-input" class="file-label">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    {{ selectedFile ? selectedFile.name : 'Seleccionar imagen' }}
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" (click)="cancelarEdicion()">Cancelar</button>
            <button class="btn-primary" (click)="guardarProducto()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              Guardar
            </button>
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
:host { --primary: #6366f1; --accent: #06b6d4; --bg-dark: #0f172a; --bg-card: #1e293b; --text: #f8fafc; --text-muted: #94a3b8; --border: rgba(255,255,255,0.1); --success: #10b981; --danger: #ef4444; --warning: #f59e0b; }

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
.search-box input { width: 100%; padding: 0.85rem 3rem 0.85rem 3rem; background: rgba(15, 23, 42, 0.6); border: 1px solid var(--border); border-radius: 10px; color: var(--text); font-size: 0.95rem; transition: all 0.3s; }
.search-box input::placeholder { color: rgba(148, 163, 184, 0.5); }
.search-box input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15); }
.clear-btn { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); width: 32px; height: 32px; border: none; background: rgba(100, 116, 139, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
.clear-btn:hover { background: rgba(100, 116, 139, 0.3); }
.clear-btn svg { color: var(--text-muted); }

.filter-section { display: flex; flex-direction: column; gap: 1rem; }
.filter-label { display: flex; align-items: center; gap: 8px; font-weight: 600; color: var(--text); font-size: 0.9rem; }
.filter-chips { display: flex; flex-wrap: wrap; gap: 0.75rem; }
.filter-chip { padding: 0.5rem 1rem; border: 1px solid var(--border); background: rgba(15, 23, 42, 0.4); color: var(--text-muted); border-radius: 20px; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.filter-chip:hover { border-color: var(--primary); background: rgba(99, 102, 241, 0.1); color: var(--primary); }
.filter-chip.active { background: linear-gradient(135deg, var(--primary), var(--accent)); color: white; border-color: transparent; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3); }

.results-info { display: flex; align-items: center; gap: 8px; padding: 0.75rem 1rem; background: rgba(100, 116, 139, 0.15); border-radius: 10px; color: var(--text-muted); font-size: 0.85rem; font-weight: 500; margin-top: 1rem; }
.results-info svg { color: var(--primary); flex-shrink: 0; }
.btn-reset-filters { margin-left: auto; padding: 0.4rem 0.85rem; background: rgba(99, 102, 241, 0.2); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 8px; font-size: 0.8rem; font-weight: 600; color: var(--primary); cursor: pointer; transition: all 0.2s; }
.btn-reset-filters:hover { background: var(--primary); color: white; border-color: var(--primary); }

/* Grid Productos */
.productos-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
.producto-card { background: rgba(30, 41, 59, 0.6); backdrop-filter: blur(10px); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; transition: all 0.3s; }
.producto-card:hover { transform: translateY(-4px); border-color: rgba(99, 102, 241, 0.3); box-shadow: 0 15px 40px rgba(0,0,0,0.3); }

.card-header-product { position: relative; width: 100%; height: 220px; overflow: hidden; background: linear-gradient(135deg, var(--primary), #764ba2); }
.producto-imagen { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
.producto-card:hover .producto-imagen { transform: scale(1.05); }
.badge-stock { position: absolute; top: 1rem; right: 1rem; background: rgba(16, 185, 129, 0.95); color: white; padding: 0.4rem 0.85rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; display: flex; align-items: center; gap: 6px; backdrop-filter: blur(10px); box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
.badge-stock svg { width: 16px; height: 16px; }
.badge-stock.low-stock { background: rgba(245, 158, 11, 0.95); }
.badge-stock.out-stock { background: rgba(239, 68, 68, 0.95); }

.card-body-product { padding: 1.25rem; }
.product-type { display: inline-block; background: rgba(99, 102, 241, 0.15); color: var(--primary); padding: 0.3rem 0.75rem; border-radius: 12px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.75rem; }
.card-body-product h3 { font-size: 1.1rem; font-weight: 700; margin: 0 0 0.5rem; color: var(--text); line-height: 1.3; }
.product-description { color: var(--text-muted); font-size: 0.85rem; line-height: 1.5; margin-bottom: 1rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.product-price { display: flex; align-items: center; gap: 0.5rem; font-size: 1.4rem; font-weight: 700; color: var(--primary); }
.product-price svg { width: 18px; height: 18px; }

.card-footer-product { padding: 1rem 1.25rem; border-top: 1px solid var(--border); display: flex; gap: 0.75rem; }
.btn-edit, .btn-delete { flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.4rem; padding: 0.65rem; border: none; border-radius: 8px; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.3s; }
.btn-edit { background: rgba(59, 130, 246, 0.2); color: #3b82f6; }
.btn-edit:hover { background: rgba(59, 130, 246, 0.3); }
.btn-delete { background: rgba(239, 68, 68, 0.2); color: var(--danger); }
.btn-delete:hover { background: rgba(239, 68, 68, 0.3); }

/* Empty State */
.empty-state { text-align: center; padding: 4rem 2rem; background: rgba(30, 41, 59, 0.6); border: 1px solid var(--border); border-radius: 20px; }
.empty-icon { font-size: 4rem; margin-bottom: 1rem; opacity: 0.5; }
.empty-state h3 { font-size: 1.5rem; margin: 0 0 0.5rem; }
.empty-state p { color: var(--text-muted); margin: 0 0 1.5rem; }

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); z-index: 200; display: flex; justify-content: center; align-items: center; padding: 1rem; }
.modal-content { background: var(--bg-dark); border: 1px solid var(--border); border-radius: 20px; width: 100%; max-width: 600px; max-height: 90vh; overflow: hidden; box-shadow: 0 25px 60px rgba(0,0,0,0.5); animation: slideUp 0.3s ease; display: flex; flex-direction: column; }
@keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

.modal-header { padding: 1.25rem 1.5rem; background: linear-gradient(135deg, var(--primary), var(--accent)); display: flex; justify-content: space-between; align-items: center; }
.modal-header h2 { margin: 0; font-size: 1.25rem; color: white; }
.btn-close { width: 36px; height: 36px; background: rgba(255,255,255,0.2); border: none; border-radius: 50%; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
.btn-close:hover { background: rgba(255,255,255,0.3); }

.modal-body { padding: 1.5rem; overflow-y: auto; flex: 1; }
.form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
.form-group { display: flex; flex-direction: column; gap: 0.4rem; }
.form-group.full-width { grid-column: 1 / -1; }
.form-group label { font-size: 0.8rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
.form-group input, .form-group textarea { padding: 0.75rem 1rem; background: rgba(15, 23, 42, 0.6); border: 1px solid var(--border); border-radius: 10px; color: var(--text); font-size: 0.95rem; transition: all 0.3s; font-family: inherit; }
.form-group input::placeholder, .form-group textarea::placeholder { color: rgba(148, 163, 184, 0.5); }
.form-group input:focus, .form-group textarea:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15); }
.form-group textarea { resize: vertical; min-height: 80px; }

.file-upload { position: relative; }
.file-upload input[type="file"] { position: absolute; opacity: 0; width: 0; height: 0; }
.file-label { display: flex; align-items: center; gap: 0.6rem; padding: 0.75rem 1rem; background: rgba(15, 23, 42, 0.6); border: 1px dashed var(--border); border-radius: 10px; color: var(--text-muted); font-size: 0.9rem; cursor: pointer; transition: all 0.3s; }
.file-label:hover { border-color: var(--primary); color: var(--primary); }

.modal-footer { padding: 1rem 1.5rem; border-top: 1px solid var(--border); display: flex; justify-content: flex-end; gap: 0.75rem; }

/* Particles */
.particles-bg { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
.particle { position: absolute; width: 3px; height: 3px; background: rgba(99, 102, 241, 0.4); border-radius: 50%; animation: rise 20s infinite ease-in-out; }
@keyframes rise { 0%, 100% { transform: translateY(100vh) scale(0); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translateY(-10vh) scale(1); opacity: 0; } }

/* Responsive */
@media (max-width: 768px) {
  .navbar { padding: 0.75rem 1rem; }
  .app-subtitle { display: none; }
  .main-content { padding: 1rem; }
  .page-header { flex-direction: column; align-items: flex-start; }
  .btn-primary { width: 100%; justify-content: center; }
  .stats-grid { grid-template-columns: 1fr 1fr; }
  .productos-grid { grid-template-columns: 1fr; }
  .form-grid { grid-template-columns: 1fr; }
  .modal-footer { flex-direction: column-reverse; }
  .modal-footer button { width: 100%; justify-content: center; }
  .search-box input { padding: 0.75rem 2.5rem 0.75rem 2.5rem; font-size: 0.9rem; }
  .filter-chips { gap: 0.5rem; }
  .filter-chip { padding: 0.4rem 0.85rem; font-size: 0.8rem; }
  .results-info { flex-direction: column; align-items: flex-start; gap: 10px; }
  .btn-reset-filters { width: 100%; margin-left: 0; }
}
  `]
})
export class ProductosAdminComponent implements OnInit {
  productos: Producto[] = [];
  productoSeleccionado: Producto | null = null;
  isAdmin = false;
  selectedFile: File | null = null;
  searchTerm: string = '';
  filtroTipo: string = '';
  productosFiltrados: Producto[] = [];

  particles = Array.from({ length: 30 }, () => ({ x: Math.random() * 100, delay: `${Math.random() * 20}s`, duration: `${15 + Math.random() * 10}s` }));

  constructor(
    private productoService: ProductoService,
    private roleService: RoleService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.roleService.isAdmin();
    const isTrabajador = this.roleService.isTrabajador();

    if (!this.isAdmin && !isTrabajador) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.cargarProductos(); 
  }

  cargarProductos() {
    this.productoService.getProductos().subscribe(
      (data) => {
        this.productos = data;
        this.aplicarFiltros();
      },
      error => console.error(error)
    );
  }

  aplicarFiltros() {
    const termino = this.searchTerm.trim().toLowerCase();

    this.productosFiltrados = this.productos.filter(p => {
      const coincideBusqueda =
        p.nombre.toLowerCase().includes(termino) ||
        (p.descripcion || '').toLowerCase().includes(termino);

      const coincideTipo =
        this.filtroTipo === '' || p.tipo.toLowerCase() === this.filtroTipo.toLowerCase();

      return coincideBusqueda && coincideTipo;
    });
  }

  cambiarFiltroTipo(tipo: string) {
    this.filtroTipo = tipo;
    this.aplicarFiltros();
  }

  limpiarBusqueda() {
    this.searchTerm = '';
    this.aplicarFiltros();
  }

  limpiarFiltros() {
    this.searchTerm = '';
    this.filtroTipo = '';
    this.aplicarFiltros();
  }

  getTiposUnicos(): string[] {
    return [...new Set(this.productos.map(p => p.tipo))];
  }

  contarPorTipo(tipo: string): number {
    return this.productos.filter(p => p.tipo === tipo).length;
  }

  seleccionarProducto(p: Producto) {
    this.productoSeleccionado = { ...p };
    this.selectedFile = null;
  }

  cancelarEdicion() {
    this.productoSeleccionado = null;
    this.selectedFile = null;
  }

  guardarProducto() {
    if (!this.productoSeleccionado) return;

    const productoData = {
      nombre: this.productoSeleccionado.nombre,
      tipo: this.productoSeleccionado.tipo,
      descripcion: this.productoSeleccionado.descripcion,
      precio: this.productoSeleccionado.precio,
      stock: this.productoSeleccionado.stock,
      imagen: this.productoSeleccionado.imagen
    };

    const formData = new FormData();
    formData.append('producto', new Blob([JSON.stringify(productoData)], { type: 'application/json' }));

    if (this.selectedFile) {
      formData.append('imagen', this.selectedFile);
    }

    const request$ = this.productoSeleccionado.id
      ? this.productoService.updateWithFile(this.productoSeleccionado.id, formData)
      : this.productoService.createWithFile(formData);

    request$.subscribe({
      next: () => {
        this.snackBar.open(
          this.productoSeleccionado!.id ? '✅ Producto actualizado' : '✅ Producto añadido',
          'Cerrar',
          { duration: 3000 }
        );
        this.cargarProductos();
        this.cancelarEdicion();
      },
      error: (err) => {
        console.error('Error guardando producto', err);
        this.snackBar.open('❌ Error al guardar', 'Cerrar', { duration: 3000 });
      }
    });
  }

  getProductosEnStock(): number {
    return this.productos.filter(p => p.stock > 0).length;
  }

  getProductosStockBajo(): number {
    return this.productos.filter(p => p.stock > 0 && p.stock < 10).length;
  }

  getValorTotal(): number {
    return this.productos.reduce((total, p) => total + (p.precio * p.stock), 0);
  }

  nuevoProducto() {
    this.productoSeleccionado = { nombre: '', tipo: '', precio: 0, stock: 0, imagen: '', descripcion: '' };
    this.selectedFile = null; 
  }

  volverAlDashboard() {
    this.router.navigate(['/dashboard']);
  }

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  eliminarProducto(id: number) {
    if (!confirm('¿Seguro que quieres eliminar este producto?')) return;
    this.productoService.delete(id).subscribe({
      next: () => {
        this.snackBar.open('✅ Producto eliminado', 'Cerrar', { duration: 3000 });
        this.cargarProductos();
      },
      error: (err) => {
        console.error('Error eliminando producto', err);
        this.snackBar.open('❌ Error al eliminar', 'Cerrar', { duration: 3000 });
      }
    });
  }
}