import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { AuthService } from '@core/services/auth.service';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-productos-list',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, HttpClientModule, MatSnackBarModule],
  template: `
    <div class="productos-container">
      <div *ngIf="productosFiltrados.length === 0" class="no-resultados">
        <div class="no-resultados-icon">🔍</div>
        <h3>No se encontraron productos</h3>
        <p>Intenta ajustar los filtros de búsqueda</p>
      </div>

      <div class="productos-grid">
        <div *ngFor="let producto of productosPaginados" class="producto-card">
          <div class="producto-imagen">
            <img [src]="'assets/img/productos/' + producto.imagen" 
                 [alt]="producto.nombre"
                 (error)="onImageError($event)">
            <span class="producto-tipo-badge">{{ producto.tipo }}</span>
          </div>
          
          <div class="producto-info">
            <h3 class="producto-nombre">{{ producto.nombre }}</h3>
            <p class="producto-descripcion">{{ producto.descripcion }}</p>
            
            <div class="producto-footer">
              <div class="precio-stock">
                <span class="producto-precio">{{ producto.precio|currency:'EUR':'symbol':'1.2-2' }}</span>
              </div>
              
              <button 
                *ngIf="!isAdmin && producto.stock > 0" 
                (click)="agregarAlCarrito(producto)"
                class="btn-agregar"
                [disabled]="producto.stock === 0"
              >
                🛒 Agregar
              </button>
              
              <!-- Mostrar stock solo a admin o trabajador -->
              <span *ngIf="isAdmin || isTrabajador" class="producto-stock" [class.sin-stock]="producto.stock === 0">
                {{ producto.stock > 0 ? producto.stock + ' en stock' : 'Sin stock' }}
              </span>

              <!-- Para clientes normales, solo mostrar “Agotado” si no hay stock -->
              <span *ngIf="!(isAdmin || isTrabajador) && producto.stock === 0" class="agotado-badge">
                ⚠️ Agotado
              </span>

            </div>
          </div>
        </div>
      </div>

      <div class="paginacion-container" *ngIf="totalPages() > 1">
        <button (click)="goToPage(currentPage - 1)" [disabled]="currentPage === 1">⬅</button>

        <button *ngFor="let page of [].constructor(totalPages()); let i = index"
                (click)="goToPage(i + 1)"
                [class.active]="currentPage === i + 1">
          {{ i + 1 }}
        </button>

        <button (click)="goToPage(currentPage + 1)" [disabled]="currentPage === totalPages()">➡</button>
      </div>

    </div>
  `,
  styles: [`
    .productos-container {
      padding: 2rem 0;
    }

    .no-resultados {
      text-align: center;
      padding: 4rem 2rem;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }

    .no-resultados-icon {
      font-size: 5rem;
      opacity: 0.3;
      margin-bottom: 1rem;
    }

    .no-resultados h3 {
      color: #4b5563;
      font-size: 1.5rem;
      margin: 0.5rem 0;
    }

    .no-resultados p {
      color: #9ca3af;
      font-size: 1rem;
    }

    .productos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .producto-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
    }

    .paginacion-container {
        margin-top: 1.5rem;
        display: flex;
        justify-content: center;
        gap: 0.5rem;
      }

      .paginacion-container button {
        padding: 0.5rem 0.8rem;
        border: 1px solid #667eea;
        border-radius: 8px;
        background: white;
        cursor: pointer;
        transition: all 0.2s;
      }

      .paginacion-container button.active {
        background: #667eea;
        color: white;
      }

      .paginacion-container button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }


    .producto-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 40px rgba(102, 126, 234, 0.2);
    }

    .producto-imagen {
      position: relative;
      width: 100%;
      height: 240px;
      overflow: hidden;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }

    .producto-imagen img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .producto-card:hover .producto-imagen img {
      transform: scale(1.1);
    }

    .producto-tipo-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      background: rgba(102, 126, 234, 0.9);
      backdrop-filter: blur(5px);
      color: white;
      padding: 0.4rem 0.8rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }

    .producto-info {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .producto-nombre {
      font-size: 1.2rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 0.75rem 0;
      line-height: 1.4;
      min-height: 2.8rem;
    }

    .producto-descripcion {
      font-size: 0.9rem;
      color: #6b7280;
      margin: 0 0 1rem 0;
      line-height: 1.5;
      flex: 1;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .producto-footer {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: auto;
    }

    .precio-stock {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .producto-precio {
      font-size: 1.5rem;
      font-weight: 700;
      color: #667eea;
    }

    .producto-stock {
      font-size: 0.85rem;
      color: #10b981;
      font-weight: 600;
      padding: 0.25rem 0.75rem;
      background: #d1fae5;
      border-radius: 12px;
    }

    .producto-stock.sin-stock {
      color: #ef4444;
      background: #fee2e2;
    }

    .btn-agregar {
      width: 100%;
      padding: 0.9rem;
      border: none;
      border-radius: 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }

    .btn-agregar:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }

    .btn-agregar:active:not(:disabled) {
      transform: translateY(0);
    }

    .btn-agregar:disabled {
      background: #d1d5db;
      cursor: not-allowed;
      box-shadow: none;
    }

    .agotado-badge {
      display: block;
      text-align: center;
      padding: 0.9rem;
      background: #fee2e2;
      color: #ef4444;
      border-radius: 12px;
      font-weight: 600;
      font-size: 1rem;
    }

    @media (max-width: 768px) {
      .productos-grid {
        grid-template-columns: 1fr;
      }

      .producto-card {
        max-width: 100%;
      }
    }

    @media (min-width: 769px) and (max-width: 1024px) {
      .productos-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class ProductosListComponent implements OnInit, OnChanges {
  @Input() searchTerm: string = '';
  @Input() tipoSeleccionado: string = '';
  @Output() productosFiltered = new EventEmitter<any[]>();
    isAdmin = false;
  isCliente = false;
  isTrabajador = false;

  productos: any[] = [];
  productosFiltrados: any[] = [];

  currentPage: number = 1;
  pageSize: number = 16;
  productosPaginados: any[] = [];


  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.isAdmin = this.authService.isAdmin();
  }

  ngOnInit() {
    this.loadProductos();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['searchTerm'] || changes['tipoSeleccionado']) {
      this.filtrarProductos();
    }
  }

  loadProductos() {
    this.http.get<any[]>('http://localhost:8080/api/productos').subscribe({
      next: (data) => {
        this.productos = data;
        this.filtrarProductos();
      },
      error: (err) => {
        console.error('Error al cargar productos', err);
        this.showNotification('❌ Error al cargar los productos');
      }
    });
  }

  filtrarProductos() {
    let filtrados = [...this.productos];

    if (this.searchTerm?.trim()) {
      const termino = this.searchTerm.toLowerCase().trim();
      filtrados = filtrados.filter(p => 
        p.nombre.toLowerCase().includes(termino) ||
        p.descripcion.toLowerCase().includes(termino)
      );
    }

    if (this.tipoSeleccionado) {
      filtrados = filtrados.filter(p => p.tipo === this.tipoSeleccionado);
    }

    this.productosFiltrados = filtrados;
    this.actualizarPaginacion();
    this.productosFiltered.emit(this.productosFiltrados);
  }

  actualizarPaginacion() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.productosPaginados = this.productosFiltrados.slice(start, end);
  }


  agregarAlCarrito(producto: any) {
    if (!this.authService.isLoggedIn()) {
      this.showNotification('⚠️ Debes iniciar sesión para agregar productos');
      return;
    }

    if (producto.stock === 0) {
      this.showNotification('⚠️ Producto sin stock disponible');
      return;
    }

    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      tipo: producto.tipo,
      precio: producto.precio,
      cantidad: 1
    });
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    // Emitir evento para actualizar el contador del carrito
    window.dispatchEvent(new Event('carritoActualizado'));
    
    this.showNotification(`✅ ${producto.nombre} agregado al carrito`);
  }

  onImageError(event: any) {
    event.target.src = 'https://via.placeholder.com/300x240/667eea/ffffff?text=Sin+Imagen';
  }

  totalPages(): number {
    return Math.ceil(this.productosFiltrados.length / this.pageSize);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage = page;
    this.actualizarPaginacion();
  }


  showNotification(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['snackbar-grande']
    });
  }
}