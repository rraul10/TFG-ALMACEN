
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
    <div class="gestion-layout" *ngIf="isAdmin">
      <!-- HEADER -->
      <header class="page-header">
        <div class="header-content">
          <div class="header-title">
            <svg class="title-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div>
              <h1>Gestión de Productos</h1>
              <p class="subtitle">Administra el inventario del almacén</p>
            </div>
          </div>
          <div class="header-actions">
            <button class="btn btn-primary" (click)="nuevoProducto()">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Nuevo Producto
            </button>
            <button class="btn btn-secondary" (click)="volverAlDashboard()">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Dashboard
            </button>
          </div>
        </div>
      </header>

      <!-- CONTENIDO -->
      <div class="page-content">
        <div class="background-pattern"></div>

        <!-- Buscador y Filtros -->
        <div class="search-filter-section">
          <div class="search-box">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <input 
              type="text" 
              [(ngModel)]="searchTerm" 
              (input)="aplicarFiltros()"
              placeholder="Buscar productos por nombre o descripción..."
            />
            <button class="clear-btn" *ngIf="searchTerm" (click)="limpiarBusqueda()">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>

          <div class="filter-section">
            <div class="filter-label">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
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
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 16H12V12H11M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Mostrando {{ productosFiltrados.length }} de {{ productos.length }} productos
            <button class="btn-reset-filters" (click)="limpiarFiltros()">
              Limpiar filtros
            </button>
          </div>
        </div>

        <!-- Estadísticas rápidas -->
        <div class="stats-container">
          <div class="stat-card">
            <div class="stat-icon blue">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="stat-info">
              <p class="stat-label">Total Productos</p>
              <p class="stat-value">{{ productos.length }}</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon green">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="stat-info">
              <p class="stat-label">En Stock</p>
              <p class="stat-value">{{ getProductosEnStock() }}</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon orange">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 9V13M12 17H12.01M10.29 3.86L1.82 18C1.64537 18.3024 1.55296 18.6453 1.55199 18.9945C1.55101 19.3437 1.64151 19.6871 1.81445 19.9905C1.98738 20.2939 2.23674 20.5467 2.53771 20.7239C2.83868 20.9011 3.18058 20.9962 3.53 21H20.47C20.8194 20.9962 21.1613 20.9011 21.4623 20.7239C21.7633 20.5467 22.0126 20.2939 22.1856 19.9905C22.3585 19.6871 22.449 19.3437 22.448 18.9945C22.447 18.6453 22.3546 18.3024 22.18 18L13.71 3.86C13.5317 3.56611 13.2807 3.32312 12.9812 3.15448C12.6817 2.98585 12.3437 2.89725 12 2.89725C11.6563 2.89725 11.3183 2.98585 11.0188 3.15448C10.7193 3.32312 10.4683 3.56611 10.29 3.86Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="stat-info">
              <p class="stat-label">Stock Bajo</p>
              <p class="stat-value">{{ getProductosStockBajo() }}</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon purple">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2V22M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="stat-info">
              <p class="stat-label">Valor Total</p>
              <p class="stat-value">{{ getValorTotal() | currency:'EUR' }}</p>
            </div>
          </div>
        </div>
        
        <!-- Grid de productos -->
        <div class="productos-grid">
          <div *ngFor="let p of productosFiltrados" class="producto-card">
            <div class="card-image-wrapper">
              <img [src]="'http://localhost:8080/files/' + p.imagen" [alt]="p.nombre" />
              <div class="stock-badge" [class.low-stock]="p.stock < 10" [class.out-stock]="p.stock === 0">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                {{ p.stock }}
              </div>
            </div>

            <div class="card-body">
              <div class="product-type">{{ p.tipo }}</div>
              <h3 class="product-name">{{ p.nombre }}</h3>
              <p class="product-description">{{ p.descripcion || 'Sin descripción' }}</p>
              
              <div class="product-info">
                <div class="price-tag">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2V22M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>{{ p.precio | currency:'EUR' }}</span>
                </div>
              </div>
            </div>

            <div class="card-footer">
              <button class="btn btn-edit" (click)="seleccionarProducto(p)">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13M18.5 2.5C18.8978 2.1022 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.1022 21.5 2.5C21.8978 2.8978 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.1022 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Editar
              </button>
              <button class="btn btn-delete" (click)="eliminarProducto(p.id!)">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Eliminar
              </button>
            </div>
          </div>
        </div>

        <!-- Estado vacío -->
        <div *ngIf="productosFiltrados.length === 0 && productos.length === 0" class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <h3>No hay productos en el inventario</h3>
          <p>Comienza agregando tu primer producto</p>
          <button class="btn btn-primary" (click)="nuevoProducto()">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Crear Producto
          </button>
        </div>

        <!-- Sin resultados de búsqueda -->
        <div *ngIf="productosFiltrados.length === 0 && productos.length > 0" class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <h3>No se encontraron productos</h3>
          <p>No hay productos que coincidan con tu búsqueda o filtro</p>
          <button class="btn btn-primary" (click)="limpiarFiltros()">
            Limpiar filtros
          </button>
        </div>
      </div>

      <!-- MODAL -->
      <div class="modal-backdrop" *ngIf="productoSeleccionado" (click)="cancelarEdicion()">
        <div class="modal-container" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              {{ productoSeleccionado.id ? 'Editar Producto' : 'Nuevo Producto' }}
            </h2>
            <button class="btn-close" (click)="cancelarEdicion()">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <div class="form-grid">
              <div class="form-group full-width">
                <label>Nombre del Producto</label>
                <input type="text" [(ngModel)]="productoSeleccionado!.nombre" placeholder="Ej: Laptop Dell XPS 15" />
              </div>

              <div class="form-group">
                <label>Tipo/Categoría</label>
                <input type="text" [(ngModel)]="productoSeleccionado!.tipo" placeholder="Ej: Electrónica" />
              </div>

              <div class="form-group">
                <label>Precio (€)</label>
                <input type="number" [(ngModel)]="productoSeleccionado!.precio" placeholder="0.00" step="0.01" />
              </div>

              <div class="form-group full-width">
                <label>Stock Disponible</label>
                <input type="number" [(ngModel)]="productoSeleccionado!.stock" placeholder="0" />
              </div>

              <div class="form-group full-width">
                <label>Descripción</label>
                <textarea 
                  [(ngModel)]="productoSeleccionado!.descripcion" 
                  placeholder="Describe el producto..."
                  rows="3"
                ></textarea>
              </div>

              <div class="form-group full-width">
                <label>Imagen del Producto</label>
                <div class="file-input-wrapper">
                  <input type="file" id="imagen-input" (change)="onFileSelected($event)" accept="image/*" />
                  <label for="imagen-input" class="file-label">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M17 8L12 3M12 3L7 8M12 3V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    {{ selectedFile ? selectedFile.name : 'Seleccionar imagen' }}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="cancelarEdicion()">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Cancelar
            </button>
            <button class="btn btn-primary" (click)="guardarProducto()">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M17 21V13H7V21M7 3V8H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Guardar
            </button>
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

    .gestion-layout {
      min-height: 100vh;
      background: #f8fafc;
      font-family: 'Inter', 'Segoe UI', Roboto, sans-serif;
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

    .background-pattern {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%);
      pointer-events: none;
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

    /* PRODUCTOS GRID */
    .productos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
      position: relative;
      z-index: 1;
    }

    .producto-card {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
      animation: fadeInUp 0.5s ease;
      display: flex;
      flex-direction: column;
    }

    .producto-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }

    .card-image-wrapper {
      position: relative;
      width: 100%;
      height: 200px;
      overflow: hidden;
      background: #f1f5f9;
    }

    .card-image-wrapper img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .producto-card:hover .card-image-wrapper img {
      transform: scale(1.05);
    }

    .stock-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      background: rgba(16, 185, 129, 0.95);
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 6px;
      backdrop-filter: blur(10px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .stock-badge svg {
      width: 16px;
      height: 16px;
    }

    .stock-badge.low-stock {
      background: rgba(245, 158, 11, 0.95);
    }

    .stock-badge.out-stock {
      background: rgba(220, 38, 38, 0.95);
    }

    .card-body {
      padding: 1.5rem;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .product-type {
      display: inline-block;
      background: #f1f5f9;
      color: #64748b;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 0.75rem;
      width: fit-content;
    }

    .product-name {
      font-size: 1.15rem;
      color: #1e293b;
      font-weight: 700;
      margin-bottom: 0.5rem;
      line-height: 1.3;
    }

    .product-description {
      color: #64748b;
      font-size: 0.9rem;
      line-height: 1.5;
      margin-bottom: 1rem;
      flex: 1;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .product-info {
      margin-top: auto;
    }

    .price-tag {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1.5rem;
      font-weight: 700;
      color: #667eea;
    }

    .price-tag svg {
      width: 20px;
      height: 20px;
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

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-group.full-width {
      grid-column: 1 / -1;
    }

    .form-group label {
      font-size: 0.9rem;
      font-weight: 600;
      color: #334155;
    }

    .form-group input,
    .form-group textarea {
      padding: 12px 16px;
      border: 2px solid #e2e8f0;
      border-radius: 10px;
      font-size: 1rem;
      transition: all 0.3s ease;
      background: #f8fafc;
      font-family: inherit;
    }

    .form-group input:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #667eea;
      background: white;
      box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    }

    .form-group textarea {
      resize: vertical;
      min-height: 80px;
    }

    /* FILE INPUT */
    .file-input-wrapper {
      position: relative;
    }

    .file-input-wrapper input[type="file"] {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }

    .file-label {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      border: 2px dashed #cbd5e1;
      border-radius: 10px;
      background: #f8fafc;
      cursor: pointer;
      transition: all 0.3s ease;
      color: #64748b;
      font-weight: 500;
    }

    .file-label:hover {
      border-color: #667eea;
      background: white;
      color: #667eea;
    }

    .file-label svg {
      width: 20px;
      height: 20px;
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

      .productos-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
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

      .header-actions {
        flex-direction: column;
        gap: 8px;
      }

      .header-actions .btn {
        width: 100%;
        justify-content: center;
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

      .filter-section {
        gap: 0.75rem;
      }

      .filter-chips {
        gap: 0.5rem;
      }

      .filter-chip {
        padding: 6px 12px;
        font-size: 0.85rem;
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

      .stats-container {
        grid-template-columns: 1fr;
      }

      .productos-grid {
        grid-template-columns: 1fr;
      }

      .form-grid {
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
    }

    @media (max-width: 480px) {
      .header-title h1 {
        font-size: 1.25rem;
      }

      .producto-card {
        border-radius: 12px;
      }

      .modal-container {
        border-radius: 16px;
      }

      .stat-value {
        font-size: 1.5rem;
      }

      .price-tag {
        font-size: 1.25rem;
      }
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


  constructor(
    private productoService: ProductoService,
    private roleService: RoleService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.roleService.isAdmin();
    if (!this.isAdmin) return;
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
  // Clonamos el objeto para que ngModel funcione sin mutar la lista original
    this.productoSeleccionado = { ...p };
    this.selectedFile = null; // reseteamos la imagen seleccionada
  }

  cancelarEdicion() {
    this.productoSeleccionado = null;
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
          this.productoSeleccionado!.id ? 'Producto actualizado ✅' : 'Producto añadido ✅',
          'Cerrar',
          { duration: 2000 }
        );
        this.cargarProductos();
        this.cancelarEdicion();
      },
      error: (err) => console.error('Error guardando producto', err)
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
        this.snackBar.open('Producto eliminado ✅', 'Cerrar', { duration: 2000 });
        this.cargarProductos();
      },
      error: (err) => console.error('Error eliminando producto', err)
    });
  }
}