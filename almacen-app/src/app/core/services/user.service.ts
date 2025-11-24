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
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); 
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

  createWithFile(formData: FormData): Observable<User> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post<User>(this.apiUrl, formData, { headers });
  }

  updateWithFile(id: number, formData: FormData): Observable<User> {
    const token = localStorage.getItem('token') || '';
    console.log(atob(token!.split('.')[1])); 

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.put<User>(`${this.apiUrl}/${id}`, formData, { headers });
  }

}
