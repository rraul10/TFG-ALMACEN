import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { PedidoService, Pedido } from '@core/services/pedido.service';

@Component({
  selector: 'app-mis-pedidos',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  template: `
    <div class="pedidos-container">
      <h2>📦 Mis Pedidos</h2>

      <div *ngIf="pedidos.length === 0">
        <p>No tienes pedidos aún.</p>
      </div>

      <div *ngFor="let pedido of pedidos" class="pedido-card">
        <p><strong>Pedido #{{ pedido.id }}</strong></p>
        <p><strong>Estado:</strong> {{ pedido.estado }}</p>
        <p><strong>Fecha:</strong> {{ pedido.fecha | date: 'dd/MM/yyyy HH:mm' }}</p>

        <h4>Productos:</h4>
        <ul>
          <li *ngFor="let lv of pedido.lineasVenta">
            {{ lv.productoNombre }} x {{ lv.cantidad }} - {{ lv.precio | currency:'EUR' }}
          </li>
        </ul>


        <p><strong>Total:</strong> {{ totalPedido(pedido) | currency:'EUR' }}</p>
      </div>
    </div>
  `,
  styles: [`
    .pedidos-container { max-width: 800px; margin: 2rem auto; padding: 1rem; }
    .pedido-card { border: 1px solid #e2e8f0; padding: 1rem; border-radius: 12px; margin-bottom: 1rem; background: white; }
  `]
})
export class MisPedidosComponent implements OnInit {
  pedidos: Pedido[] = [];

  constructor(private pedidoService: PedidoService) {}

  ngOnInit(): void {
  const clienteId = 5; // Aquí usa el ID real del cliente logueado
  this.pedidoService.getByCliente(clienteId).subscribe({
    next: (data) => {
      console.log('Pedidos del cliente:', data);
      this.pedidos = data;
    },
    error: (err) => {
      console.error('Error al obtener los pedidos del cliente', err);
    }
  });
}



  totalPedido(pedido: Pedido): number {
    return pedido.lineasVenta.reduce((sum, lv) => sum + lv.cantidad * lv.precio, 0);
  }

}
