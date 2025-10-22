import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Producto, ProductoService } from '@core/services/producto.service';
import { RoleService } from '@core/services/role.service';

@Component({
  selector: 'app-productos-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="productos-container">
      <h2 class="titulo">🛒 Productos Disponibles</h2>

      <div class="productos-grid" *ngIf="productos.length > 0; else cargando">
        <div class="producto-card" *ngFor="let p of productosPaginados">
          <img [src]="getImageUrl(p.imagen)" alt="{{ p.nombre }}" />
          <h3>{{ p.nombre }}</h3>
          <p class="descripcion">{{ p.descripcion }}</p>
          <p class="precio">{{ p.precio | currency:'EUR' }}</p>

          <p class="stock" *ngIf="isAdminOrTrabajador()">📦 Stock: {{ p.stock }}</p>

          <!-- Mostrar la cantidad solo si el usuario está logueado -->
          <label *ngIf="isLoggedIn">
            Cantidad:
            <input type="number" min="1" [max]="p.stock" [(ngModel)]="p.cantidadSeleccionada" [name]="'cantidad_' + p.id" />
          </label>

          <!-- Mostrar el botón de "Añadir al carrito" solo si el usuario está logueado -->
          <button class="btn-add" *ngIf="isLoggedIn" (click)="agregarAlCarrito(p)">Añadir al carrito</button>

          <!-- Si no está logueado, solo mostrar el botón sin permitir añadir al carrito -->
          <div class="" *ngIf="!isLoggedIn" disabled></div>
          
        </div>
      </div>

      <ng-template #cargando>
        <p class="loading">Cargando productos...</p>
      </ng-template>

      <div class="paginacion" *ngIf="totalPaginas() > 1">
        <button (click)="prevPage()" [disabled]="paginaActual === 1">« Anterior</button>
        <span>Página {{ paginaActual }} de {{ totalPaginas() }}</span>
        <button (click)="nextPage()" [disabled]="paginaActual === totalPaginas()">Siguiente »</button>
      </div>
    </div>
  `,
  styles: [`
    /* Estilos de los productos */
    .productos-container {
      width: 100%;
      max-width: 1280px;
      margin: 2rem auto;
      text-align: center;
      color: #1e293b;
    }

    .titulo {
      font-size: 1.8rem;
      font-weight: 600;
      margin-bottom: 2rem;
      color: #0f172a;
    }

    /* Grid de productos */
    .productos-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
    }

    .producto-card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.05);
      padding: 1rem;
      text-align: center;
      width: 100%;
      max-width: 260px;
      transition: all 0.25s ease-in-out;
    }

    .producto-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 6px 12px rgba(0,0,0,0.1);
      border-color: #94a3b8;
    }

    .producto-card img {
      width: 100%;
      height: 180px;
      object-fit: cover;
      border-radius: 12px;
      margin-bottom: 1rem;
    }

    .producto-card h3 {
      font-size: 1.1rem;
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 0.5rem;
    }

    .descripcion {
      font-size: 0.9rem;
      color: #475569;
      min-height: 40px;
      margin-bottom: 0.5rem;
    }

    .precio {
      font-weight: bold;
      color: #16a34a;
      margin-bottom: 0.5rem;
    }

    .stock {
      font-size: 0.9rem;
      color: #2563eb;
      margin-bottom: 1rem;
    }

    .btn-add {
      background: #2563eb;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.2s ease-in-out;
    }

    .btn-add:hover {
      background: #1d4ed8;
    }

    .loading {
      font-style: italic;
      color: #64748b;
    }

    /* Paginación */
    .paginacion {
      margin-top: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
    }

    .paginacion button {
      background: #1e293b;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.2s ease-in-out;
    }

    .paginacion button:hover:not(:disabled) {
      background: #334155;
    }

    .paginacion button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class ProductosListComponent implements OnInit {
  productos: Producto[] = [];
  paginaActual = 1;
  productosPorPagina = 12;
  isLoggedIn: boolean = false;

  constructor(
    private productoService: ProductoService,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    // Verifica si el usuario está logueado
    this.isLoggedIn = !!localStorage.getItem('token');

    // Si está logueado, obtiene los productos
    this.productoService.getAll().subscribe({
      next: (data) => {
        this.productos = data.map(p => ({
          ...p,
          cantidadSeleccionada: this.isLoggedIn ? 1 : undefined // Si está logueado, inicializa cantidadSeleccionada en 1
        }));
      },
      error: (err) => console.error('Error cargando productos:', err)
    });
  }

  agregarAlCarrito(producto: Producto) {
    const cantidadDeseada = producto.cantidadSeleccionada || 1;

    // Obtener carrito desde localStorage
    const carrito: Producto[] = JSON.parse(localStorage.getItem('carrito') || '[]');

    // Comprobar si el producto ya está en el carrito
    const index = carrito.findIndex(p => p.id === producto.id);

    if (index > -1) {
      carrito[index].cantidad = (carrito[index].cantidad || 1) + cantidadDeseada;
    } else {
      carrito.push({
        id: producto.id,
        nombre: producto.nombre,
        tipo: producto.tipo,
        descripcion: producto.descripcion,
        precio: producto.precio,
        stock: producto.stock,
        imagen: producto.imagen,
        cantidad: cantidadDeseada
      });
    }

    // Guardar el carrito en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
    window.dispatchEvent(new Event('carritoActualizado'));
  }

  eliminarCarrito(): void {
    // Eliminar carrito de localStorage
    localStorage.removeItem('carrito');
    // Eliminar la sesión
    localStorage.removeItem('token');
    this.isLoggedIn = false;
    // Restablecer la cantidad de los productos a 1 cuando se cierra sesión
    this.productos.forEach(p => p.cantidadSeleccionada = undefined);
  }

  // Llamar esta función cuando el usuario cierre sesión
  onCerrarSesion(): void {
    this.eliminarCarrito();
  }

  get productosPaginados(): Producto[] {
    const inicio = (this.paginaActual - 1) * this.productosPorPagina;
    return this.productos.slice(inicio, inicio + this.productosPorPagina);
  }

  totalPaginas(): number {
    return Math.ceil(this.productos.length / this.productosPorPagina);
  }

  nextPage() {
    if (this.paginaActual < this.totalPaginas()) this.paginaActual++;
  }

  prevPage() {
    if (this.paginaActual > 1) this.paginaActual--;
  }

  getImageUrl(nombre: string): string {
    return `http://localhost:8080/files/${nombre}`;
  }

  isAdminOrTrabajador(): boolean {
    return this.roleService.isAdmin() || this.roleService.isTrabajador();
  }
}
