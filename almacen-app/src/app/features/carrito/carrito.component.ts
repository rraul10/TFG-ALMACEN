import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

interface Compra {
  productoNombre: string;
  cantidad: number;
}

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
        <span>
          {{ item.nombre }} 
          <span *ngIf="item.cantidad > 1"> (x{{ item.cantidad }})</span> - 
          {{ (item.precio * item.cantidad) | currency:'EUR' }}
        </span>
        <button (click)="eliminarItem(i)">Eliminar</button>
      </div>

      <div *ngIf="carrito.length > 0" class="carrito-footer">
        <p>Total: {{ total | currency:'EUR' }}</p>

        <button (click)="comprar()">Comprar</button>
        <button (click)="cerrar()">Seguir comprando</button>
      </div>
    </div>
  `,
  styles: [`
    .carrito-container { max-width: 600px; margin: 2rem auto; padding: 1rem; background: #f9fafb; border-radius: 12px; }
    .carrito-item { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
    .carrito-footer { margin-top: 1rem; text-align: right; }
    button { background: #2563eb; color: white; border: none; padding: 0.4rem 0.8rem; border-radius: 6px; cursor: pointer; margin-top: 1rem; margin-left: 0.5rem; }
    button:hover { background: #1d4ed8; }
  `]
})
export class CarritoComponent implements OnInit {
  carrito: any[] = [];
  total: number = 0;
  carritoOpen: boolean = true;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.cargarCarrito();

    window.addEventListener('carritoActualizado', () => {
      this.cargarCarrito();
    });
  }

  cargarCarrito() {
    const rawCarrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    this.carrito = rawCarrito.map((item: any) => ({
      ...item,
      cantidad: Number(item.cantidad) || 1,
      precio: Number(item.precio) || 0
    }));
    this.calcularTotal();
  }

  calcularTotal() {
    this.total = this.carrito.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
  }

  eliminarItem(index: number) {
    this.carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
    this.calcularTotal();
  }

  comprar() {
    if (!this.carrito.length) return alert('El carrito está vacío');

    const clienteId = localStorage.getItem('clienteId');
    const token = localStorage.getItem('token');

    if (!clienteId || !token) {
      return alert('Debes iniciar sesión para realizar la compra.');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    // Enviar cada producto como compra individual
    this.carrito.forEach(item => {
      const compra: Compra = {
        productoNombre: item.nombre,
        cantidad: item.cantidad
      };

      this.http.post(`http://localhost:8080/api/clientes/${clienteId}/comprar`, compra, { headers })
        .subscribe({
          next: (res) => {
            console.log('Pedido realizado ✅', compra);
          },
          error: (err) => {
            console.error('Error al realizar pedido', err);
            alert(`Error al procesar el producto ${item.nombre}. Revisa la consola.`);
          }
        });
    });

    alert('Pedido(s) enviado(s) correctamente ✅');
    this.carrito = [];
    localStorage.removeItem('carrito');
    this.carritoOpen = false;
  }


  cerrar() {
    this.router.navigate(['/productos']);
  }
}
