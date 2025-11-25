import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(credentials: { correo: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((res: any) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          const rol = this.decodeRoleFromToken(res.token);
          localStorage.setItem('rol', rol || 'CLIENTE');
        }
        if (res.user) {
          localStorage.setItem('user', JSON.stringify(res.user));
        }
      })
    );
  }

  register(data: {
    nombre: string;
    apellidos: string;
    correo: string;
    telefono: string;
    ciudad: string;
    password: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, data);
  }

  registerCliente(data: any) {
    return this.http.post('http://localhost:8080/auth/register/cliente', data);
  }

  getClienteData(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/clientes/user/${userId}`);
  }

  updateClienteData(userId: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/cliente/user/${userId}`, data);
  }

  getTrabajadorData(userId: number): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${this.apiUrl}/api/trabajadores/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  updateTrabajadorData(userId: number, data: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.put(`${this.apiUrl}/api/trabajadores/${userId}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  updateUserData(userId: number, data: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.put(`${this.apiUrl}/api/users/${userId}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }


  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  isAdmin(): boolean {
    const rol = localStorage.getItem('rol');
    return rol === 'ADMIN' || rol === 'ROLE_ADMIN';
  }

  getRol(): string | null {
    return localStorage.getItem('rol');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('user');
  }

  private decodeRoleFromToken(token: string): string | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const roles = payload?.extraClaims?.roles;
      if (Array.isArray(roles) && roles.length > 0) {
        return roles[0];
      }
      return null;
    } catch (e) {
      console.error('Error decodificando token:', e);
      return null;
    }
  }
}