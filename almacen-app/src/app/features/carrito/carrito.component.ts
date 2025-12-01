import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, FormsModule, HttpClientModule],
  template: `
    <div class="carrito-container">
      <h2>🛒 Mi Carrito</h2>

      <div *ngIf="carrito.length === 0">
        <p>Tu carrito está vacío.</p>
      </div>

      <div *ngFor="let item of carrito; let i = index" class="carrito-item">
        <div class="item-left">
          <div class="item-name">{{ item.nombre }} <span *ngIf="item.cantidad > 1">x{{ item.cantidad }}</span></div>
          <div class="item-sub">{{ item.tipo }}</div>
        </div>

        <div class="item-right">
          <div class="qty-control">
            <button (click)="disminuirCantidad(i)">-</button>
            <span>{{ item.cantidad }}</span>
            <button (click)="aumentarCantidad(i)">+</button>
          </div>

          <div class="item-price">{{ (item.precio * item.cantidad) | currency:'EUR':'symbol':'1.2-2' }}</div>
          <button (click)="eliminarItem(i)" title="Eliminar">🗑️</button>
        </div>
      </div>

      <div *ngIf="carrito.length > 0" class="carrito-footer">
        <p>Total: {{ total | currency:'EUR':'symbol':'1.2-2' }}</p>

        <button (click)="comprar()">Comprar</button>
        <button (click)="cerrar()">Seguir comprando</button>
      </div>
    </div>
  `,
  styles: [`
    .carrito-container { max-width: 600px; margin: 2rem auto; padding: 1rem; background: #0f1724; color: #e6eef8; border-radius: 12px; }
    .carrito-item { display: flex; justify-content: space-between; align-items: center; padding: 0.6rem; border-bottom: 1px solid rgba(255,255,255,0.03); }
    .item-left { flex: 1; }
    .item-right { display:flex; align-items:center; gap:0.75rem; }
    .qty-control { display:flex; align-items:center; gap:0.4rem; }
    .qty-control button { width:28px; height:28px; border-radius:6px; border:none; background:#1f2937; color:white; cursor:pointer; }
    .carrito-footer { margin-top: 1rem; text-align: right; }
    button { background: #6366f1; color: white; border: none; padding: 0.4rem 0.8rem; border-radius: 6px; cursor: pointer; }
  `]
})
export class CarritoComponent implements OnInit, OnDestroy {
  carrito: any[] = [];
  total: number = 0;
  private handler = (e: any) => this.onCarritoActualizado(e);

  constructor(private router: Router, private http: HttpClient, private cdr: ChangeDetectorRef, private ngZone: NgZone) {}

  ngOnInit() {
    console.log('[CARRITO] ngOnInit -> loadCarrito');
    this.loadCarrito();
    window.addEventListener('carritoActualizado', this.handler);
  }

  ngOnDestroy() {
    window.removeEventListener('carritoActualizado', this.handler);
  }

  private onCarritoActualizado(e: any) {
      console.group('%c[CARRITO EVENT] carritoActualizado recibido', 'color: cyan');
      console.log('evento detail:', e?.detail);
      console.trace('trace evento carritoActualizado');
      this.ngZone.run(() => {
        if (e?.detail?.carrito) {
          console.log('[CARRITO EVENT] usando detail.carrito');
          this.loadCarritoFromArray(e.detail.carrito);
        } else {
          console.log('[CARRITO EVENT] sin payload.carrito -> leyendo localStorage');
          this.loadCarrito();
        }
      });
      console.groupEnd();
    }

    loadCarrito() {
      const raw = localStorage.getItem('carrito');
      console.log('[CARRITO] loadCarrito -> raw localStorage:', raw);
      const parsed = raw ? JSON.parse(raw) : [];
      this.loadCarritoFromArray(parsed);
    }

    private loadCarritoFromArray(raw: any[]) {
    this.carrito = raw.map(it => ({
      id: String(it.id),
      nombre: it.nombre,
      tipo: it.tipo,
      precio: Number(it.precio) || 0,
      cantidad: Number(it.cantidad) || 1,
      stock: it.stock !== undefined ? Number(it.stock) : undefined
    }));

    localStorage.setItem('carrito', JSON.stringify(this.carrito));
    this.recalcularTotal();
    this.cdr.markForCheck();
  }

  recalcularTotal() {
    this.total = this.carrito.reduce((s, it) => s + (it.precio * it.cantidad), 0);
    console.log('[CARRITO] total recalculado:', this.total);
  }

  aumentarCantidad(index: number) {
    console.log('[CARRITO] aumentarCantidad index:', index, 'item:', this.carrito[index]);
    const item = this.carrito[index];
    if (!item) {
      console.error('[CARRITO] aumentarCantidad: item no existe en index', index);
      return;
    }
    const nueva = Number(item.cantidad || 0) + 1;
    if (item.stock !== undefined && !isNaN(Number(item.stock)) && nueva > Number(item.stock)) {
      console.warn('[CARRITO] intentar aumentar pero supera stock', { nueva, stock: item.stock });
      alert('No hay más stock disponible');
      return;
    }
    item.cantidad = nueva;
    this.saveCarrito();
  }

  disminuirCantidad(index: number) {
    console.log('[CARRITO] disminuirCantidad index:', index, 'item:', this.carrito[index]);
    const item = this.carrito[index];
    if (!item) return;
    if (item.cantidad > 1) {
      item.cantidad = Number(item.cantidad) - 1;
      this.saveCarrito();
    } else {
      this.eliminarItem(index);
    }
  }

  eliminarItem(index: number) {
    console.log('[CARRITO] eliminarItem index:', index, 'item:', this.carrito[index]);
    this.carrito.splice(index, 1);
    this.saveCarrito();
  }

  private saveCarrito() {
    console.group('%c[CARRITO SAVE] guardando carrito', 'color: orange');
    const normalized = this.carrito.map(it => ({
      id: String(it.id),
      nombre: it.nombre,
      tipo: it.tipo,
      precio: Number(it.precio) || 0,
      cantidad: Number(it.cantidad) || 1,
      stock: (it.stock !== undefined ? Number(it.stock) : undefined)
    }));
    console.log('[CARRITO SAVE] normalized:', normalized);
    localStorage.setItem('carrito', JSON.stringify(normalized));
    console.log('[CARRITO SAVE] localStorage ahora:', localStorage.getItem('carrito'));
    window.dispatchEvent(new CustomEvent('carritoActualizado', { detail: { carrito: normalized } }));
    this.recalcularTotal();
    this.cdr.markForCheck();
    console.groupEnd();
  }

  comprar() {
  console.log('🔥 🔥 NUEVO CÓDIGO ACTIVADO 🔥 🔥');
  
  const token = localStorage.getItem('token');
  if (!token) return alert('Sin token');

  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });

  const pedidoData = {
    clienteId: 1,  
    lineasVenta: [{
      productoId: 12,  
      cantidad: 1
    }]
  };

  console.log('🚀 🚀 ENVIANDO clienteId=1:', pedidoData);

  this.http.post('http://localhost:8080/api/pedidos', pedidoData, { headers })
    .subscribe({
      next: (res) => {
        console.log('✅ ✅ ÉXITO:', res);
        alert('¡Pedido creado con clienteId=1!');
      },
      error: (err) => {
        console.error('❌ ❌ ERROR:', err);
        alert('Error: ' + JSON.stringify(err.error));
      }
    });
}



  cerrar() {
    this.router.navigate(['/productos']);
  }
}