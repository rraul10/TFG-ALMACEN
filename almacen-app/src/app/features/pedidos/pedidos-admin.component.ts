import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pedido, PedidoService } from '@core/services/pedido.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RoleService } from '@core/services/role.service';

@Component({
  selector: 'app-pedidos-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  template: `
    <div class="pedidos-admin-container" *ngIf="isAdmin">
      <div class="header-admin">
        <h2>Gestión de Pedidos</h2>

        <button (click)="volverAlDashboard()" class="btn-dashboard">🏠 Dashboard</button>

        <div class="search-box">
          <input type="number" placeholder="Buscar por ID cliente..."
                 [(ngModel)]="clienteIdBusqueda">
          <button (click)="buscarPorCliente()">Buscar</button>
          <button (click)="cargarPedidos()">Reset</button>
        </div>
      </div>

      <table class="tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente ID</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Total (€)</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr *ngFor="let p of pedidos">
            <td>{{ p.id }}</td>
            <td>{{ p.clienteId }}</td>
            <td>{{ p.fecha | date:'short' }}</td>

            <td>
              <select [(ngModel)]="p.estado" (change)="cambiarEstado(p)">
                <option value="PENDIENTE">Pendiente</option>
                <option value="EN_PROCESO">En proceso</option>
                <option value="ENVIADO">Enviado</option>
                <option value="ENTREGADO">Entregado</option>
              </select>
            </td>

            <td>{{ getTotal(p) | number:'1.2-2' }}</td>

            <td>
              <button class="btn-ver" (click)="verDetalles(p)">👁</button>
              <button class="btn-delete" (click)="eliminarPedido(p.id!)">❌</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Modal Detalles -->
      <div class="modal-backdrop" *ngIf="pedidoSeleccionado">
        <div class="modal">
          <h3>Pedido #{{ pedidoSeleccionado.id }}</h3>

          <p><strong>Cliente ID:</strong> {{ pedidoSeleccionado.clienteId }}</p>
          <p><strong>Estado:</strong> {{ pedidoSeleccionado.estado }}</p>
          <p><strong>Fecha:</strong> {{ pedidoSeleccionado.fecha | date:'short' }}</p>

          <h4>Lineas de venta</h4>

          <ul>
            <li *ngFor="let lv of pedidoSeleccionado.lineasVenta">
              {{ lv.cantidad }} × {{ lv.productoNombre }} → {{ lv.precio }}€
            </li>
          </ul>

          <button class="btn-cerrar" (click)="cerrarModal()">Cerrar</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .pedidos-admin-container {
      padding: 20px;
    }

    .header-admin {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .search-box {
      display: flex;
      gap: 10px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }

    th, td {
      padding: 10px;
      border: 1px solid #ddd;
      text-align: center;
    }

    .btn-ver {
      background: #2196f3;
      color: white;
      padding: 5px 10px;
      border: none;
      cursor: pointer;
    }

    .btn-delete {
      background: #f44336;
      color: white;
      padding: 5px 10px;
      border: none;
      cursor: pointer;
    }

    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0,0,0,0.6);
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .modal {
      background: white;
      padding: 20px;
      border-radius: 10px;
      width: 400px;
    }

    .btn-cerrar {
      margin-top: 20px;
      width: 100%;
      padding: 10px;
      background: #444;
      color: white;
    }
  `]
})
export class PedidosAdminComponent implements OnInit {
  pedidos: Pedido[] = [];
  pedidoSeleccionado: Pedido | null = null;
  clienteIdBusqueda: number | null = null;
  isAdmin = false;

  constructor(
    private pedidoService: PedidoService,
    private roleService: RoleService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.isAdmin = this.roleService.isAdmin();
    if (!this.isAdmin) return;

    this.cargarPedidos();
  }

  cargarPedidos() {
    this.pedidoService.getAll().subscribe({
      next: (data) => this.pedidos = data,
      error: (err) => console.error(err)
    });
  }

  getTotal(pedido: Pedido): number {
    return pedido.lineasVenta.reduce((acc, lv) => acc + lv.cantidad * lv.precio, 0);
  }

  buscarPorCliente() {
    if (!this.clienteIdBusqueda) return;

    this.pedidoService.getByCliente(this.clienteIdBusqueda).subscribe({
      next: (data) => this.pedidos = data,
      error: (err) => console.error(err)
    });
  }

  cambiarEstado(pedido: Pedido) {
    if (!pedido.id || !pedido.estado) return;

    this.pedidoService.actualizarEstado(pedido.id, pedido.estado).subscribe({
      next: () => this.snackBar.open('Estado actualizado', 'Cerrar', { duration: 2000 }),
      error: (err) => console.error(err)
    });
  }

  eliminarPedido(id: number) {
    if (!confirm('¿Eliminar pedido?')) return;

    this.pedidoService.delete(id).subscribe({
      next: () => {
        this.pedidos = this.pedidos.filter(p => p.id !== id);
        this.snackBar.open('Pedido eliminado', 'Cerrar', { duration: 2000 });
      },
      error: (err) => console.error(err)
    });
  }

  verDetalles(pedido: Pedido) {
    this.pedidoSeleccionado = pedido;
  }

  cerrarModal() {
    this.pedidoSeleccionado = null;
  }

  volverAlDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
