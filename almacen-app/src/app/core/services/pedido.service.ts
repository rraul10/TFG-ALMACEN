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

    return this.http.post<Pedido>(this.apiUrl, pedido, { headers });
  }


  update(id: number, pedido: PedidoRequest): Observable<Pedido> {
    return this.http.put<Pedido>(`${this.apiUrl}/${id}`, pedido);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getByCliente(clienteId: number): Observable<Pedido[]> {
  const token = localStorage.getItem('token');

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  return this.http.get<Pedido[]>(`${this.apiUrl}/cliente/${clienteId}`, { headers });
}


}
