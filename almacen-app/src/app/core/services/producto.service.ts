import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Producto {
  id: number;
  nombre: string;
  tipo: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen: string;
  cantidadSeleccionada?: number; 
  cantidad?: number;          
}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'http://localhost:8080/api/productos'; // Cambia la URL si es necesario

  constructor(private http: HttpClient) {}

  getAll(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  getById(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }
}
