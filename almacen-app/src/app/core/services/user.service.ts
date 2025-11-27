import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  nombre: string;
  apellidos: string;
  correo: string;
  password: string;
  telefono: string;
  ciudad: string;
  foto: string;
  created: string;
  updated: string;
  deleted: boolean;
  rol: string;

      dni?: string | null;
    fotoDni?: string | null;
    direccionEnvio?: string | null;
    numeroSeguridadSocial?: string | null;
}


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  create(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user, { headers: this.getHeaders() });
  }

  update(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user, { headers: this.getHeaders() });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createWithFile(formData: FormData): Observable<string> {
    const headers = this.getHeaders();
    return this.http.post(this.apiUrl, formData, { headers, responseType: 'text' });
  }

  updateWithFile(id: number, formData: FormData): Observable<string> {
    const headers = this.getHeaders();
    return this.http.put(`${this.apiUrl}/${id}`, formData, { headers, responseType: 'text' });
  }
}
