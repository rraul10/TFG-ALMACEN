import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { HttpClient, } from '@angular/common/http';
import { AuthService } from '@core/services/auth.service';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ProductoViewModalComponent } from './producto-view-modal.component'; 
import { Producto } from '@core/services/producto.service'; 


@Component({
  selector: 'app-productos-list',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, MatSnackBarModule],
  template: `
    <div class="productos-container">
      <div *ngIf="productosFiltrados.length === 0" class="no-resultados">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" opacity="0.3">
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <h3>No se encontraron productos</h3>
        <p>Intenta ajustar los filtros de búsqueda</p>
      </div>

      <div class="productos-grid">
        <div *ngFor="let producto of productosPaginados" class="producto-card">
          <div class="card-img-wrapper">
            <img [src]="producto.imagen || 'assets/img/default.jpg'" 
              [alt]="producto.nombre"
              (error)="onImageError($event)">
            <div class="card-overlay">
              <button *ngIf="!isAdmin && producto.stock > 0" 
                      (click)="agregarAlCarrito(producto)" 
                      class="quick-add-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                Añadir
              </button>
            </div>
            <span class="tipo-tag">{{ producto.tipo }}</span>
            <span *ngIf="producto.stock === 0" class="out-of-stock-tag">Agotado</span>
          </div>
          
          <div class="card-body">
            <h4 class="card-title">{{ producto.nombre }}</h4>
            <p class="card-desc">{{ producto.descripcion }}</p>
            
            <div class="card-footer">
              <span class="card-price">{{ producto.precio | currency:'EUR':'symbol':'1.2-2' }}</span>
              <span *ngIf="isAdmin || isTrabajador" class="stock-info" [class.low]="producto.stock === 0">
                {{ producto.stock > 0 ? producto.stock + ' uds' : 'Sin stock' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Paginación moderna -->
      <div class="pagination" *ngIf="totalPages() > 1">
        <button class="page-btn nav" (click)="goToPage(currentPage - 1)" [disabled]="currentPage === 1">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>

        <ng-container *ngFor="let page of getVisiblePages()">
          <span *ngIf="page === '...'" class="page-ellipsis">...</span>
          <button *ngIf="page !== '...'" 
                  class="page-btn" 
                  [class.active]="currentPage === page"
                  (click)="goToPage(+page)">
            {{ page }}
          </button>
        </ng-container>

        <button class="page-btn nav" (click)="goToPage(currentPage + 1)" [disabled]="currentPage === totalPages()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host { --primary: #6366f1; --accent: #06b6d4; --bg-card: #1e293b; --text: #f8fafc; --text-muted: #94a3b8; --border: rgba(255,255,255,0.1); --danger: #ef4444; --success: #10b981; }

    .productos-container { max-width: 1300px; margin: 0 auto; padding: 0 1.5rem 2rem; }
.card-overlay {
  pointer-events: none;
}

.quick-add-btn {
  pointer-events: auto;
  z-index: 10;
}

    .no-resultados { text-align: center; padding: 4rem 2rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: 20px; }
    .no-resultados h3 { color: var(--text); font-size: 1.3rem; margin: 1rem 0 0.5rem; }
    .no-resultados p { color: var(--text-muted); font-size: 0.95rem; margin: 0; }

    /* Grid compacto */
    .productos-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1.25rem; }

    /* Tarjeta compacta y moderna */
    .producto-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; transition: all 0.3s ease; display: flex; flex-direction: column; }
    .producto-card:hover { transform: translateY(-6px); border-color: rgba(99, 102, 241, 0.4); box-shadow: 0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(99, 102, 241, 0.2); }

    /* Imagen más pequeña */
    .card-img-wrapper { position: relative; height: 160px; overflow: hidden; background: linear-gradient(135deg, #1e293b 0%, #334155 100%); }
    .card-img-wrapper img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease, opacity 0.3s; }
    .producto-card:hover .card-img-wrapper img { transform: scale(1.08); opacity: 0.7; }

    /* Overlay con botón */
    .card-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s; }
    .producto-card:hover .card-overlay { opacity: 1; }

    .quick-add-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1.2rem; background: var(--primary); border: none; border-radius: 10px; color: white; font-size: 0.85rem; font-weight: 600; cursor: pointer; transform: translateY(10px); transition: all 0.3s; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.5); }
    .producto-card:hover .quick-add-btn { transform: translateY(0); }
    .quick-add-btn:hover { background: #4f46e5; transform: translateY(-2px) !important; }

    /* Tags */
    .tipo-tag { position: absolute; top: 10px; left: 10px; padding: 0.3rem 0.7rem; background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); border-radius: 6px; font-size: 0.7rem; font-weight: 600; color: var(--text); text-transform: uppercase; letter-spacing: 0.5px; }
    .out-of-stock-tag { position: absolute; top: 10px; right: 10px; padding: 0.3rem 0.7rem; background: var(--danger); border-radius: 6px; font-size: 0.7rem; font-weight: 700; color: white; }

    /* Body compacto */
    .card-body { padding: 1rem; display: flex; flex-direction: column; flex: 1; }
    .card-title { font-size: 0.95rem; font-weight: 600; color: var(--text); margin: 0 0 0.4rem; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 2.4em; }
    .card-desc { font-size: 0.8rem; color: var(--text-muted); margin: 0 0 0.75rem; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; flex: 1; }

    .card-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 0.75rem; border-top: 1px solid var(--border); margin-top: auto; }
    .card-price { font-size: 1.15rem; font-weight: 700; background: linear-gradient(135deg, var(--primary), var(--accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .stock-info { font-size: 0.75rem; color: var(--success); font-weight: 600; padding: 0.2rem 0.5rem; background: rgba(16, 185, 129, 0.15); border-radius: 4px; }
    .stock-info.low { color: var(--danger); background: rgba(239, 68, 68, 0.15); }

    /* Paginación moderna */
    .pagination { display: flex; justify-content: center; align-items: center; gap: 0.5rem; margin-top: 2rem; }
    .page-btn { min-width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: var(--bg-card); border: 1px solid var(--border); border-radius: 10px; color: var(--text-muted); font-size: 0.9rem; font-weight: 500; cursor: pointer; transition: all 0.2s; }
    .page-btn:hover:not(:disabled) { border-color: var(--primary); color: var(--primary); background: rgba(99, 102, 241, 0.1); }
    .page-btn.active { background: var(--primary); border-color: var(--primary); color: white; }
    .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .page-btn.nav { background: transparent; }
    .page-ellipsis { color: var(--text-muted); padding: 0 0.25rem; }

    @media (max-width: 640px) { 
      .productos-grid { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; } 
      .card-img-wrapper { height: 130px; }
      .card-body { padding: 0.75rem; }
      .card-title { font-size: 0.85rem; }
      .card-price { font-size: 1rem; }
    }
  `]
})
export class ProductosListComponent implements OnInit, OnChanges {
  @Input() searchTerm: string = '';
  @Input() tipoSeleccionado: string = '';
  @Input() ordenSeleccionado: string = ''; 
  @Output() productosFiltered = new EventEmitter<any[]>();

  isAdmin = false;
  isCliente = false;
  isTrabajador = false;

  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  productosPaginados: Producto[] = [];
  currentPage: number = 1;
  pageSize: number = 15;

  constructor(
  private http: HttpClient, 
  private authService: AuthService, 
  private snackBar: MatSnackBar,
  private dialog: MatDialog   
) {
  this.isAdmin = this.authService.isAdmin();
  this.isCliente = (this.authService.isCliente && this.authService.isCliente()) || false;
  this.isTrabajador = (this.authService.isTrabajador && this.authService.isTrabajador()) || false;
}

verProducto(producto: Producto) {
  this.dialog.open(ProductoViewModalComponent, {
    width: '400px',
    data: producto
  });
}

  ngOnInit() { this.loadProductos(); }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['searchTerm'] || changes['tipoSeleccionado'] || changes['ordenSeleccionado']) {
      this.filtrarProductos();
    }
  }

  loadProductos() {
    this.http.get<any[]>('http://localhost:8080/api/productos').subscribe({
      next: (data) => { this.productos = data || []; this.filtrarProductos(); },
      error: () => this.showNotification('❌ Error al cargar los productos')
    });
  }

  

  filtrarProductos() {
    let filtrados = [...this.productos];

    if (this.searchTerm?.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtrados = filtrados.filter(p => 
        p.nombre.toLowerCase().includes(term) || 
        p.descripcion?.toLowerCase().includes(term)
      );
    }

    if (this.tipoSeleccionado) {
      filtrados = filtrados.filter(p => p.tipo === this.tipoSeleccionado);
    }

    if (this.ordenSeleccionado) {
      switch (this.ordenSeleccionado) {
        case 'precio-asc':
          filtrados.sort((a, b) => a.precio - b.precio);
          break;
        case 'precio-desc':
          filtrados.sort((a, b) => b.precio - a.precio);
          break;
        case 'nombre-asc':
          filtrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
          break;
        case 'nombre-desc':
          filtrados.sort((a, b) => b.nombre.localeCompare(a.nombre));
          break;
      }
    }

    this.productosFiltrados = filtrados;
    this.currentPage = 1;
    this.actualizarPaginacion();
    this.productosFiltered.emit(this.productosFiltrados);
  }

  actualizarPaginacion() {
    const start = (this.currentPage - 1) * this.pageSize;
    this.productosPaginados = this.productosFiltrados.slice(start, start + this.pageSize);
  }

  totalPages(): number { return Math.ceil(this.productosFiltrados.length / this.pageSize); }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage = page;
    this.actualizarPaginacion();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getVisiblePages(): (number | string)[] {
    const total = this.totalPages();
    const current = this.currentPage;
    const pages: (number | string)[] = [];
    
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 3) pages.push('...');
      for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
      if (current < total - 2) pages.push('...');
      pages.push(total);
    }
    return pages;
  }
agregarAlCarrito(producto: any) {
  const prodId = String(producto.id);
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
    if (nuevaCantidad > item.stock) {
      alert('No hay más stock disponible');
      return;
    }
    item.cantidad = nuevaCantidad;
  } else {
    carrito.push({
      id: prodId,
      nombre: producto.nombre,
      tipo: producto.tipo,
      precio: Number(producto.precio),
      cantidad: 1,
      stock: Number(producto.stock)
    });
  }

  localStorage.setItem('carrito', JSON.stringify(carrito));

  // Se asegura de que CarritoComponent reciba un array con números correctos
  window.dispatchEvent(new CustomEvent('carritoActualizado', { detail: { carrito } }));
}

onImageError(event: any) {
  event.target.src = 'assets/img/default.jpg';
}

  showNotification(msg: string) {
    this.snackBar.open(msg, 'Cerrar', { duration: 3000, horizontalPosition: 'right', verticalPosition: 'top' });
  }
}