import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { PedidoService, Pedido } from '@core/services/pedido.service';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-mis-pedidos',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterModule],
  template: `
    <div class="mis-pedidos-layout">
      <!-- BARRA SUPERIOR -->
      <header class="navbar">
        <div class="navbar-left"></div>

        <div class="user-menu" (click)="toggleMenu()">
          <img 
            src="https://cdn-icons-png.flaticon.com/512/847/847969.png" 
            alt="Usuario" 
            class="user-icon"
          />
          <div class="menu-dropdown" *ngIf="menuOpen">
            <div class="menu-item" (click)="goToProfile()">👤 Mi perfil</div>
            <div class="menu-item" (click)="goToMisPedidos()">📦 Mis pedidos</div>
            <div class="menu-item logout" (click)="logout()">🚪 Cerrar sesión</div>
          </div>
        </div>
      </header>

      <!-- CONTENIDO DE PEDIDOS -->
      <div class="pedidos-container">
        <div *ngIf="pedidos.length === 0" class="empty-state">
          <p>Aún no tienes pedidos. 🛒</p>
        </div>

        <div *ngFor="let pedido of pedidos" class="pedido-card">
          <div class="pedido-header">
            <span class="pedido-id">Pedido #{{ pedido.id }}</span>
            <span class="pedido-estado" [ngClass]="estadoClass(pedido.estado ?? '')">
              {{ pedido.estado }}
            </span>
          </div>
          <p class="pedido-fecha">📅 {{ pedido.fecha | date: 'dd/MM/yyyy HH:mm' }}</p>

          <h4>Productos:</h4>
          <ul class="lineas-venta">
            <li *ngFor="let lv of pedido.lineasVenta" class="linea-item">
              <span class="producto-nombre">{{ lv.productoNombre }}</span>
              <span class="producto-cantidad">x{{ lv.cantidad }}</span>
              <span class="producto-precio">{{ lv.precio | currency:'EUR' }}</span>
            </li>
          </ul>

          <div class="pedido-total">
            <strong>Total:</strong> {{ totalPedido(pedido) | currency:'EUR' }}
          </div>
        </div>
      </div>

      <!-- BOTÓN FLOTANTE VOLVER AL DASHBOARD -->
      <button class="fab-back" (click)="volverDashboard()">🏠 Dashboard</button>
    </div>
  `,
  styles: [`
    /* BARRA SUPERIOR */
    .navbar {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      background: #1e293b;
      color: white;
      padding: 0.8rem 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .user-menu {
      position: relative;
      cursor: pointer;
    }

    .user-icon {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background-color: white;
      padding: 4px;
      transition: transform 0.2s;
    }

    .user-icon:hover {
      transform: scale(1.1);
    }

    .menu-dropdown {
      position: absolute;
      top: 50px;
      right: 0;
      background-color: white;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      width: 180px;
      overflow: hidden;
      animation: fadeIn 0.2s ease-in-out;
      z-index: 10;
    }

    .menu-item {
      padding: 0.8rem 1rem;
      font-size: 0.95rem;
      color: #1f2937;
      transition: background 0.2s;
    }

    .menu-item:hover {
      background-color: #f3f4f6;
    }

    .menu-item.logout {
      color: #dc2626;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-5px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* PEDIDOS */
    .pedidos-container {
      max-width: 900px;
      margin: 2rem auto;
      padding: 0 1rem;
      font-family: 'Segoe UI', Roboto, sans-serif;
    }

    .empty-state {
      text-align: center;
      padding: 2rem;
      font-size: 1.1rem;
      color: #64748b;
      background: #f1f5f9;
      border-radius: 12px;
    }

    .pedido-card {
      border-radius: 12px;
      background: white;
      box-shadow: 0 4px 16px rgba(0,0,0,0.08);
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .pedido-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 20px rgba(0,0,0,0.12);
    }

    .pedido-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .pedido-id {
      font-weight: 600;
      font-size: 1.1rem;
      color: #0f172a;
    }

    .pedido-estado {
      font-weight: 600;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.85rem;
      text-transform: uppercase;
      color: white;
    }

    .pedido-estado.pendiente { background-color: #facc15; }
    .pedido-estado.en-proceso { background-color: #3b82f6; }
    .pedido-estado.entregado { background-color: #16a34a; }
    .pedido-estado.cancelado { background-color: #dc2626; }

    .pedido-fecha {
      font-size: 0.9rem;
      color: #475569;
      margin-bottom: 1rem;
    }

    .lineas-venta {
      list-style: none;
      padding: 0;
      margin: 0 0 1rem 0;
      border-top: 1px solid #e2e8f0;
      border-bottom: 1px solid #e2e8f0;
    }

    .linea-item {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      font-size: 0.95rem;
      color: #334155;
    }

    .pedido-total {
      text-align: right;
      font-size: 1.1rem;
      font-weight: 600;
      color: #1e293b;
    }

    /* BOTÓN FLOTANTE VOLVER */
    .fab-back {
      position: fixed;
      bottom: 20px;
      left: 20px;
      background-color: #1e293b;
      color: white;
      border: none;
      padding: 0.8rem 1.2rem;
      border-radius: 50px;
      font-size: 1rem;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      transition: background 0.2s, transform 0.2s;
      z-index: 50;
    }

    .fab-back:hover {
      background-color: #3b82f6;
      transform: translateY(-2px);
    }
  `]
})
export class MisPedidosComponent implements OnInit {
  pedidos: Pedido[] = [];
  menuOpen = false;

  constructor(private pedidoService: PedidoService, private router: Router) {}

  ngOnInit(): void {
    const clienteId = 5;
    this.pedidoService.getByCliente(clienteId).subscribe({
      next: (data) => this.pedidos = data,
      error: (err) => console.error('Error al obtener los pedidos del cliente', err)
    });
  }

  totalPedido(pedido: Pedido): number {
    return pedido.lineasVenta.reduce((sum, lv) => sum + lv.cantidad * lv.precio, 0);
  }

  estadoClass(estado?: string): string {
    switch (estado?.toLowerCase()) {
      case 'pendiente': return 'pendiente';
      case 'en proceso': return 'en-proceso';
      case 'entregado': return 'entregado';
      case 'cancelado': return 'cancelado';
      default: return '';
    }
  }

  toggleMenu() { this.menuOpen = !this.menuOpen; }
  goToProfile() { this.menuOpen = false; this.router.navigate(['/perfil']); }
  goToMisPedidos() { this.menuOpen = false; this.router.navigate(['/mispedidos']); }
  logout() { 
    this.menuOpen = false; 
    localStorage.removeItem('token'); 
    this.router.navigate(['/']); 
  }

  volverDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
