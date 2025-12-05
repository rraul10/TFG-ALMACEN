import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Producto } from '@core/services/producto.service';
import { CurrencyPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-producto-view-modal',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  template: `
    <div class="modal-header">
      <h2>{{ data.nombre }}</h2>
      <button (click)="cerrar()">×</button>
    </div>
    <div class="modal-body">
      <img [src]="data.imagen || 'assets/img/default.jpg'" [alt]="data.nombre" />
      <p>{{ data.descripcion }}</p>
      <p>Tipo: {{ data.tipo }}</p>
      <p>Precio: {{ data.precio | currency:'EUR' }}</p>
      <p *ngIf="data.stock === 0" class="out-of-stock">Agotado</p>
    </div>
    <div class="modal-footer">
      <button (click)="agregarAlCarrito()">Añadir al carrito 🛒</button>
    </div>
  `,
  styles: [`
    .modal-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; }
    .modal-body img { width:100%; max-height:200px; object-fit:cover; margin-bottom:1rem; border-radius:10px; }
    .out-of-stock { color:red; font-weight:700; margin-top:0.5rem; }
    button { cursor:pointer; padding:0.5rem 1rem; border:none; border-radius:8px; background:#6366f1; color:white; font-weight:600; transition:0.2s; }
    button:hover { background:#4f46e5; }
    .modal-footer { margin-top:1rem; display:flex; justify-content:flex-end; }
  `]
})
export class ProductoViewModalComponent {
  constructor(
    public dialogRef: MatDialogRef<ProductoViewModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Producto
  ) {}

  cerrar() {
    this.dialogRef.close();
  }

  agregarAlCarrito() {
    const rawCarrito: any[] = JSON.parse(localStorage.getItem('carrito') || '[]');
    const item = rawCarrito.find(i => i.id === String(this.data.id));

    if (item) {
      if (item.cantidad + 1 > this.data.stock) {
        alert('No hay más stock disponible');
        return;
      }
      item.cantidad += 1;
    } else {
      rawCarrito.push({ ...this.data, cantidad: 1 });
    }

    localStorage.setItem('carrito', JSON.stringify(rawCarrito));
    window.dispatchEvent(new CustomEvent('carritoActualizado', { detail: { carrito: rawCarrito } }));
    this.dialogRef.close();
  }
}
