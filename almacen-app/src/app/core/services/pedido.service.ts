import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { map, catchError, of } from 'rxjs';


export interface LineaVenta {
  productoId: number;
  productoNombre: string;
  cantidad: number;
  precio: number;
}

export interface Pedido {
  id?: number;
  fecha?: string;
  estado?: string;
  clienteId?: number;       
  clienteNombre?: string; 
  lineasVenta: LineaVenta[];
}



export interface PedidoRequest {
  clienteId: number;
  lineasVenta: { productoId: number; cantidad: number; precio: number }[];
}


@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private apiUrl = 'http://localhost:8080/api/pedidos';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Pedido[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Pedido[]>(this.apiUrl, { headers }).pipe(
      catchError(err => {
        console.warn('Backend no responde, usando solo localStorage', err);
        return of([]);
      }),
      map((backend: Pedido[]) => {
        const local = this.obtenerLocal();
        return [...backend, ...local];
      })
    );
  }


  getByCliente(clienteId: number): Observable<Pedido[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Pedido[]>(`${this.apiUrl}/cliente/${clienteId}`, { headers }).pipe(
      catchError(err => {
        console.warn('Backend no responde, filtrando pedidos en localStorage', err);
        const pedidos = this.obtenerLocal().filter(p => p.clienteId === clienteId);
        return of(pedidos);
      })
    );
  }

  create(pedido: PedidoRequest): Observable<Pedido> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

   const lineasConNombre: LineaVenta[] = pedido.lineasVenta.map(lv => ({
      productoId: lv.productoId,
      cantidad: lv.cantidad,
      precio: lv.precio,
      productoNombre: '' 
    }));

    const pedidoLocal: Pedido = {
      id: Date.now(),
      clienteId: pedido.clienteId,
      fecha: new Date().toISOString(),
      estado: 'PENDIENTE',
      lineasVenta: lineasConNombre
    };

    this.guardarLocal(pedidoLocal);

    // Mandamos al backend
    return this.http.post<Pedido>(this.apiUrl, pedido, { headers }).pipe(
      catchError(err => {
        console.warn('ERROR enviando pedido al servidor, usando local', err);
        return of(pedidoLocal);
      })
    );
  }

  update(id: number, pedido: PedidoRequest): Observable<Pedido> {
    return this.http.put<Pedido>(`${this.apiUrl}/${id}`, pedido);
  }

  delete(id: number): Observable<void> {
    // También eliminamos del localStorage
    this.eliminarLocal(id);
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  actualizarEstado(id: number, estado: string) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.put(`${this.apiUrl}/estado/${id}?estado=${estado}`, {}, { headers });
  }

  /** ------------------- MÉTODOS LOCALSTORAGE ------------------- */

  // Guardar un pedido en localStorage
  guardarLocal(pedido: Pedido) {
    const pedidos = this.obtenerLocal();
    pedidos.push(pedido);
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
  }

  // Obtener todos los pedidos del localStorage
  obtenerLocal(): Pedido[] {
    const data = localStorage.getItem('pedidos');
    return data ? JSON.parse(data) : [];
  }

  // Eliminar un pedido del localStorage por id
  eliminarLocal(id: number) {
    let pedidos = this.obtenerLocal();
    pedidos = pedidos.filter(p => p.id !== id);
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
  }

  // Limpiar todos los pedidos del localStorage
  limpiarLocal() {
    localStorage.removeItem('pedidos');
  }
}
