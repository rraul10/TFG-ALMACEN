import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Producto, ProductoService } from '@core/services/producto.service';
import { RoleService } from '@core/services/role.service';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-productos-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  template: `
    <div class="productos-admin-container" *ngIf="isAdmin">
      <div class="header-admin">
        <h2>Gestión de Productos</h2>
        <button class="btn-add-product" 
          (click)="productoSeleccionado = { nombre: '', tipo: '', precio: 0, stock: 0, imagen: '', descripcion: '' }">
          ➕ Añadir Producto
        </button>
      </div>

      <!-- Lista de productos -->
      <div class="productos-grid">
        <div class="producto-card" *ngFor="let p of productos">
          <img [src]="'http://localhost:8080/files/' + p.imagen" alt="{{ p.nombre }}" />
          <h3>{{ p.nombre }}</h3>
          <p>Precio: {{ p.precio | currency:'EUR' }}</p>
          <p>Stock: {{ p.stock }}</p>
          <div class="card-buttons">
            <button (click)="seleccionarProducto(p)">✏️ Editar</button>
            <button (click)="eliminarProducto(p.id!)">❌ Eliminar</button>
          </div>
        </div>
      </div>

      <!-- Formulario para crear/editar producto -->
    <div class="form-producto" *ngIf="productoSeleccionado">
    <h3>{{ productoSeleccionado.id ? 'Editar Producto' : 'Añadir Producto' }}</h3>

    <label>Nombre:
        <input type="text" [(ngModel)]="productoSeleccionado.nombre" />
    </label>

    <label>Tipo:
        <input type="text" [(ngModel)]="productoSeleccionado.tipo" />
    </label>

    <label>Imagen:
        <input type="text" [(ngModel)]="productoSeleccionado.imagen" />
    </label>

    <label>Descripción:
        <textarea [(ngModel)]="productoSeleccionado.descripcion"></textarea>
    </label>

    <label>Precio:
        <input type="number" [(ngModel)]="productoSeleccionado.precio" />
    </label>

    <label>Stock:
        <input type="number" [(ngModel)]="productoSeleccionado.stock" />
    </label>

    <div class="botones">
        <button (click)="guardarProducto()">💾 Guardar</button>
        <button (click)="limpiarSeleccion()">✖ Cancelar</button>
    </div>
    </div>

    </div>
  `,
  styles: [`
    .productos-admin-container {
      max-width: 1400px;
      margin: 2rem auto;
      font-family: 'Segoe UI', Roboto, sans-serif;
      color: #1f2937;
    }

    .header-admin {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .header-admin h2 {
      font-size: 2rem;
      font-weight: 700;
      color: #0f172a;
    }

    .btn-add-product {
      padding: 0.7rem 1.5rem;
      font-size: 1rem;
      border: none;
      border-radius: 10px;
      background-color: #16a34a;
      color: white;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.3s, transform 0.2s;
    }

    .btn-add-product:hover {
      background-color: #15803d;
      transform: translateY(-2px);
    }

    /* Grid de productos */
    .productos-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 1.8rem;
      justify-content: flex-start;
    }

    .producto-card {
      flex: 0 1 220px;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      background: #fff;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .producto-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 6px 12px rgba(0,0,0,0.1);
      border-color: #94a3b8;
    }

    .producto-card img {
      width: 100%;
      height: 150px;
      object-fit: cover;
      border-radius: 8px;
      margin-bottom: 0.5rem;
    }

    .producto-card h3 {
      font-size: 1.1rem;
      margin: 0.5rem 0;
    }

    .producto-card p {
      margin: 0.2rem 0;
    }

    .card-buttons {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }

    .card-buttons button {
      flex: 1;
      padding: 0.4rem 0.6rem;
      border-radius: 8px;
      border: none;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
    }

    .card-buttons button:first-of-type {
      background-color: #2563eb;
      color: white;
    }

    .card-buttons button:first-of-type:hover {
      background-color: #1d4ed8;
    }

    .card-buttons button:last-of-type {
      background-color: #dc2626;
      color: white;
    }

    .card-buttons button:last-of-type:hover {
      background-color: #b91c1c;
    }

    /* Formulario de producto */
    .form-producto {
        border: 1px solid #94a3b8;
        border-radius: 12px;
        padding: 1.2rem;
        max-width: 500px;
        margin: 2rem auto 0;
        background: #f9fafb;
        text-align: left;
    }


    .form-producto label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    .form-producto input,
    .form-producto textarea {
      width: 100%;
      padding: 0.5rem;
      margin-top: 0.2rem;
      margin-bottom: 0.8rem;
      border-radius: 6px;
      border: 1px solid #cbd5e1;
    }

    .form-producto .botones {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
    }

    .form-producto button {
      padding: 0.5rem 1rem;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      font-weight: 500;
      transition: background 0.2s;
    }

    .form-producto button:hover {
      background-color: #2563eb;
      color: white;
    }
  `]
})
export class ProductosAdminComponent implements OnInit {
  productos: Producto[] = [];
  productoSeleccionado: Producto | null = null;
  isAdmin = false;

  constructor(
    private productoService: ProductoService,
    private roleService: RoleService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    console.log('ProductosAdminComponent cargado');
    this.isAdmin = this.roleService.isAdmin();
    if (!this.isAdmin) return;

    this.productoSeleccionado = null; // Asegúrate de que se inicialice en null
    this.cargarProductos();
  }

  cargarProductos() {
    this.productoService.getAll().subscribe({
      next: (data) => this.productos = data,
      error: (err) => console.error('Error cargando productos', err)
    });
  }

  seleccionarProducto(p: Producto) {
    this.productoSeleccionado = { ...p };
  }

  limpiarSeleccion() {
    this.productoSeleccionado = null;
  }

  guardarProducto() {
    if (!this.productoSeleccionado) return;

    const productoData = {
      nombre: this.productoSeleccionado.nombre,
      tipo: this.productoSeleccionado.tipo,
      imagen: this.productoSeleccionado.imagen,
      descripcion: this.productoSeleccionado.descripcion,
      precio: this.productoSeleccionado.precio,
      stock: this.productoSeleccionado.stock
    };

    if (this.productoSeleccionado.id) {
      this.productoService.update(this.productoSeleccionado.id, productoData).subscribe({
        next: () => {
          this.snackBar.open('Producto actualizado ✅', 'Cerrar', { duration: 2000 });
          this.cargarProductos();
          this.limpiarSeleccion();
        },
        error: (err) => console.error('Error actualizando producto', err)
      });
    } else {
      this.productoService.create(productoData).subscribe({
        next: () => {
          this.snackBar.open('Producto añadido ✅', 'Cerrar', { duration: 2000 });
          this.cargarProductos();
          this.limpiarSeleccion();
        },
        error: (err) => console.error('Error creando producto', err)
      });
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
