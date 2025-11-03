import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

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
    return this.http.get<Pedido[]>(this.apiUrl);
  }

  getById(id: number): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.apiUrl}/${id}`);
  }

  create(pedido: PedidoRequest): Observable<Pedido> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  // Transformamos lineasVenta para incluir productoNombre vacío (o podrías pasar el real si lo tienes)
  const lineasConNombre: LineaVenta[] = pedido.lineasVenta.map(lv => ({
    productoId: lv.productoId,
    cantidad: lv.cantidad,
    precio: lv.precio,
    productoNombre: '' // <-- aquí podrías poner lv.productoNombre si lo tienes
  }));

  // Guardamos el pedido en localStorage antes de enviarlo
  this.guardarLocal({ 
    ...pedido, 
    estado: 'Pendiente', 
    id: Date.now(), 
    lineasVenta: lineasConNombre 
  });

  return this.http.post<Pedido>(this.apiUrl, pedido, { headers });
}


  update(id: number, pedido: PedidoRequest): Observable<Pedido> {
    return this.http.put<Pedido>(`${this.apiUrl}/${id}`, pedido);
  }

  delete(id: number): Observable<void> {
    // También eliminamos del localStorage
    this.eliminarLocal(id);
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getByCliente(clienteId: number): Observable<Pedido[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<Pedido[]>(`${this.apiUrl}/cliente/${clienteId}`, { headers });
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
