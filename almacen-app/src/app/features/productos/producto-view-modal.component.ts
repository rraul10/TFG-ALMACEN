import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Producto } from '@core/services/producto.service';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-producto-view-modal',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, MatDialogModule, MatSnackBarModule],
  template: `
    <div class="product-modal">
      <button class="close-button" (click)="cerrar()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      <div class="product-grid">
        <!-- Columna Izquierda: Imagen -->
        <div class="image-column">
          <div class="image-container">
            <img [src]="data.imagen || 'assets/img/default.jpg'" 
                 [alt]="data.nombre"
                 (error)="onImageError($event)">
            <div class="image-overlay" *ngIf="data.stock === 0">
              <span class="sold-out-badge">AGOTADO</span>
            </div>
          </div>
          <div class="image-info">
            <span class="tipo-pill">{{ data.tipo }}</span>
          </div>
        </div>

        <!-- Columna Derecha: Información -->
        <div class="info-column">
          <div class="product-header">
            <h1 class="product-name">{{ data.nombre }}</h1>
            <div class="price-section">
              <span class="price">{{ data.precio | currency:'EUR':'symbol':'1.2-2' }}</span>
            </div>
          </div>

          <div class="divider"></div>

          <div class="product-description">
            <h3 class="section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              Descripción
            </h3>
            <p class="description-text">{{ data.descripcion || 'Sin descripción disponible' }}</p>
          </div>

          <div class="product-specs">
            <div class="spec-item">
              <div class="spec-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                </svg>
              </div>
              <div class="spec-content">
                <span class="spec-label">Tipo de producto</span>
                <span class="spec-value">{{ data.tipo }}</span>
              </div>
            </div>

            <div class="spec-item" *ngIf="isAdmin || isTrabajador">
              <div class="spec-icon" [class.warning]="data.stock > 0 && data.stock <= 5" [class.danger]="data.stock === 0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                </svg>
              </div>
              <div class="spec-content">
                <span class="spec-label">Disponibilidad</span>
                <span class="spec-value" 
                      [class.text-success]="data.stock > 5"
                      [class.text-warning]="data.stock > 0 && data.stock <= 5"
                      [class.text-danger]="data.stock === 0">
                  {{ data.stock === 0 ? 'Sin stock' : data.stock > 5 ? data.stock + ' unidades' : '¡Solo ' + data.stock + ' unidades!' }}
                </span>
              </div>
            </div>
          </div>

          <div class="action-section">
            <button class="cancel-button" (click)="cerrar()">
              Cancelar
            </button>
            <button class="add-button" 
                    (click)="agregarAlCarrito()" 
                    [disabled]="data.stock === 0"
                    [class.disabled]="data.stock === 0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      --primary: #6366f1;
      --accent: #06b6d4;
      --bg-modal: #0f172a;
      --bg-surface: #1e293b;
      --bg-elevated: #334155;
      --text-primary: #f8fafc;
      --text-secondary: #cbd5e1;
      --text-muted: #94a3b8;
      --border: #334155;
      --success: #10b981;
      --warning: #f59e0b;
      --danger: #ef4444;
    }

    .product-modal {
      background: var(--bg-modal);
      width: 1300px;
      max-width: 98vw;
      height: auto;
      border-radius: 24px;
      position: relative;
    }

    .close-button {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      width: 44px;
      height: 44px;
      border: none;
      background: var(--bg-elevated);
      border-radius: 12px;
      color: var(--text-muted);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      z-index: 100;
    }

    .close-button svg {
      width: 22px;
      height: 22px;
    }

    .close-button:hover {
      background: var(--danger);
      color: white;
      transform: rotate(90deg);
    }

    .product-grid {
      display: grid;
      grid-template-columns: 650px 1fr;
      min-height: 700px;
    }

    /* COLUMNA IZQUIERDA - IMAGEN */
    .image-column {
      background: var(--bg-surface);
      display: flex;
      flex-direction: column;
      border-right: 1px solid var(--border);
    }

    .image-container {
      position: relative;
      height: 650px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4rem;
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    }

    .image-container img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: 20px;
    }

    .image-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,0.7);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 16px;
    }

    .sold-out-badge {
      padding: 1rem 2.5rem;
      background: var(--danger);
      color: white;
      font-size: 1.5rem;
      font-weight: 800;
      border-radius: 14px;
      letter-spacing: 3px;
      transform: rotate(-5deg);
      box-shadow: 0 10px 30px rgba(239, 68, 68, 0.5);
    }

    .image-info {
      padding: 2rem;
      border-top: 1px solid var(--border);
      display: flex;
      justify-content: center;
    }

    .tipo-pill {
      padding: 0.85rem 1.75rem;
      background: rgba(99, 102, 241, 0.15);
      border: 1px solid rgba(99, 102, 241, 0.3);
      color: var(--primary);
      border-radius: 24px;
      font-size: 1rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2px;
    }

    /* COLUMNA DERECHA - INFO */
    .info-column {
      display: flex;
      flex-direction: column;
      padding: 4rem;
      gap: 2.5rem;
      justify-content: center;
    }

    .product-header {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .product-name {
      font-size: 2.5rem;
      font-weight: 800;
      color: var(--text-primary);
      margin: 0;
      line-height: 1.2;
      letter-spacing: -0.5px;
    }

    .price-section {
      display: flex;
      align-items: baseline;
      gap: 1rem;
    }

    .price {
      font-size: 4rem;
      font-weight: 900;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: -2px;
      line-height: 1;
    }

    .divider {
      height: 1px;
      background: var(--border);
      margin: 1.5rem 0;
    }

    .product-description {
      margin-bottom: 1.5rem;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--text-primary);
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 0 0 0.75rem;
    }

    .section-title svg {
      color: var(--primary);
    }

    .description-text {
      font-size: 1rem;
      line-height: 1.7;
      color: var(--text-secondary);
      margin: 0;
    }

    .product-specs {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .spec-item {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 1.75rem;
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      transition: all 0.2s;
    }

    .spec-item:hover {
      background: var(--bg-elevated);
      border-color: rgba(99, 102, 241, 0.3);
    }

    .spec-icon {
      width: 56px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(99, 102, 241, 0.15);
      border-radius: 14px;
      flex-shrink: 0;
    }

    .spec-icon svg {
      color: var(--primary);
      width: 28px;
      height: 28px;
    }

    .spec-icon.warning {
      background: rgba(245, 158, 11, 0.15);
    }

    .spec-icon.warning svg {
      color: var(--warning);
    }

    .spec-icon.danger {
      background: rgba(239, 68, 68, 0.15);
    }

    .spec-icon.danger svg {
      color: var(--danger);
    }

    .spec-content {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      flex: 1;
    }

    .spec-label {
      font-size: 0.85rem;
      color: var(--text-muted);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .spec-value {
      font-size: 1.15rem;
      color: var(--text-primary);
      font-weight: 600;
    }

    .text-success {
      color: var(--success) !important;
    }

    .text-warning {
      color: var(--warning) !important;
    }

    .text-danger {
      color: var(--danger) !important;
    }

    .action-section {
      display: flex;
      gap: 1.5rem;
      padding-top: 1.5rem;
    }

    .cancel-button,
    .add-button {
      flex: 1;
      padding: 1.5rem 2rem;
      border: none;
      border-radius: 16px;
      font-size: 1.1rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
    }

    .cancel-button svg,
    .add-button svg {
      width: 24px;
      height: 24px;
    }

    .cancel-button {
      background: var(--bg-surface);
      border: 1px solid var(--border);
      color: var(--text-secondary);
    }

    .cancel-button:hover {
      background: var(--bg-elevated);
      color: var(--text-primary);
      transform: translateY(-2px);
    }

    .add-button {
      background: linear-gradient(135deg, var(--primary), #4f46e5);
      color: white;
      box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
      flex: 2;
    }

    .add-button:hover:not(.disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 30px rgba(99, 102, 241, 0.6);
    }

    .add-button.disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: var(--text-muted);
      box-shadow: none;
    }

    /* RESPONSIVE */
    @media (max-width: 768px) {
      .product-modal {
        width: 100vw;
        max-width: 100vw;
        height: 100vh;
        border-radius: 0;
      }

      .product-grid {
        grid-template-columns: 1fr;
      }

      .image-column {
        border-right: none;
        border-bottom: 1px solid var(--border);
      }

      .image-container {
        padding: 1.5rem;
        height: 300px;
      }

      .info-column {
        padding: 1.5rem;
        overflow-y: auto;
        max-height: calc(100vh - 300px);
      }

      .product-name {
        font-size: 1.5rem;
      }

      .price {
        font-size: 2rem;
      }

      .action-section {
        flex-direction: column;
      }

      .add-button {
        flex: 1;
      }
    }
  `]
})
export class ProductoViewModalComponent {
  isAdmin = false;
  isTrabajador = false;

  constructor(
    public dialogRef: MatDialogRef<ProductoViewModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Producto,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    this.isAdmin = this.authService.isAdmin();
    this.isTrabajador = (this.authService.isTrabajador && this.authService.isTrabajador()) || false;
  }

  cerrar() {
    this.dialogRef.close();
  }

  agregarAlCarrito() {
    if (this.data.stock === 0) {
      this.showNotification('⚠️ Producto sin stock', 'error');
      return;
    }

    const prodId = String(this.data.id);
    const rawCarrito: any[] = JSON.parse(localStorage.getItem('carrito') || '[]');

    const carrito = rawCarrito.map(it => ({
      id: String(it.id),
      nombre: it.nombre,
      tipo: it.tipo,
      precio: Number(it.precio),
      cantidad: Number(it.cantidad) || 0,
      stock: Number(it.stock) || 0
    }));

    const item = carrito.find(i => i.id === prodId);

    if (item) {
      const nuevaCantidad = item.cantidad + 1;
      if (nuevaCantidad > this.data.stock) {
        this.showNotification('⚠️ No hay más stock disponible', 'warning');
        return;
      }
      item.cantidad = nuevaCantidad;
      this.showNotification(`✅ Cantidad actualizada (${nuevaCantidad})`, 'success');
    } else {
      carrito.push({
        id: prodId,
        nombre: this.data.nombre,
        tipo: this.data.tipo,
        precio: Number(this.data.precio),
        cantidad: 1,
        stock: Number(this.data.stock)
      });
      this.showNotification('✅ Producto añadido al carrito', 'success');
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    window.dispatchEvent(new CustomEvent('carritoActualizado', { detail: { carrito } }));
    
    setTimeout(() => this.dialogRef.close(), 800);
  }

  onImageError(event: any) {
    event.target.src = 'assets/img/default.jpg';
  }

  showNotification(msg: string, type: 'success' | 'error' | 'warning' = 'success') {
    this.snackBar.open(msg, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [`snackbar-${type}`]
    });
  }
}