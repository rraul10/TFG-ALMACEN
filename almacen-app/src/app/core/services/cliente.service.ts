import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Cliente {
  id: number;
  nombre: string;
  email?: string;
  telefono?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = 'http://localhost:8080/api/clientes';

  constructor(private http: HttpClient) {}

  getById(id: number): Observable<Cliente> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Cliente>(`${this.apiUrl}/${id}`, { headers }).pipe(
      catchError(err => {
        console.warn('No se pudo obtener el cliente del backend, usando localStorage', err);
        const clienteLocal = this.obtenerLocal().find(c => c.id === id);
        return of(clienteLocal ?? { id, nombre: 'Desconocido' });
      })
    );
  }

  getAll(): Observable<Cliente[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Cliente[]>(this.apiUrl, { headers }).pipe(
      catchError(err => {
        console.warn('No se pudo obtener clientes del backend, usando localStorage', err);
        return of(this.obtenerLocal());
      })
    );
  }

  private obtenerLocal(): Cliente[] {
    const data = localStorage.getItem('clientes');
    return data ? JSON.parse(data) : [];
  }

  guardarLocal(clientes: Cliente[]) {
    localStorage.setItem('clientes', JSON.stringify(clientes));
  }
}
