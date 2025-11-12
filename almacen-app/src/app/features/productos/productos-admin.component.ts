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
    <div class="productos-admin-container" *ngIf="isAdmin">
      <div class="header-admin">
        <h2>Gestión de Productos</h2>
        <button class="btn-add-product" 
          (click)="productoSeleccionado = { nombre: '', tipo: '', precio: 0, stock: 0, imagen: '', descripcion: '' }">
          ➕ Añadir Producto
        </button>
        <button class="btn-add-product" (click)="volverAlDashboard()">🏠 Dashboard</button>
      </div>

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

      <!-- Modal -->
      <div class="modal-backdrop" *ngIf="productoSeleccionado">
        <div class="form-producto modal">
          <h3>{{ productoSeleccionado.id ? 'Editar Producto' : 'Añadir Producto' }}</h3>

          <label>Nombre:<input [(ngModel)]="productoSeleccionado.nombre" /></label>
          <label>Tipo:<input [(ngModel)]="productoSeleccionado.tipo" /></label>
          <label>Precio:<input type="number" [(ngModel)]="productoSeleccionado.precio" /></label>
          <label>Stock:<input type="number" [(ngModel)]="productoSeleccionado.stock" /></label>
          <label>Imagen:
            <input type="file" (change)="onFileSelected($event)" />
          </label>
          <label>Descripción:<textarea [(ngModel)]="productoSeleccionado.descripcion"></textarea></label>

          <div class="botones">
            <button (click)="guardarProducto()">💾 Guardar</button>
            <button (click)="cancelarEdicion()">✖ Cancelar</button>
          </div>
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

    /* Modal */
    .modal-backdrop {
      position: fixed;
      top:0; left:0; right:0; bottom:0;
      background-color: rgba(0,0,0,0.4);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal {
      width: 90%;
      max-width: 500px;
      background-color: #f9fafb;
      border-radius: 12px;
      padding: 1.2rem;
      border: 1px solid #94a3b8;
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
  selectedFile: File | null = null;

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
    this.productoService.getAll().subscribe({
      next: (data) => this.productos = data,
      error: (err) => console.error('Error cargando productos', err)
    });
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