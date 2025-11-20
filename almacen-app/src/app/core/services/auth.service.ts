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

  registerCliente(data: { idUsuario: number; dni: string; direccion: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register/cliente`, data);
  }

  getClienteData(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/cliente/user/${userId}`);
  }

  updateClienteData(userId: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/cliente/user/${userId}`, data);
  }

  getTrabajadorData(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/trabajador/user/${userId}`);
  }

  updateTrabajadorData(userId: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/trabajador/user/${userId}`, data);
  }

  updateUserData(userId: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/user/${userId}`, data);
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