import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  getRol(): string | null {
    return localStorage.getItem('rol');
  }

  isAdmin(): boolean {
    return this.getRol() === 'ADMIN';
  }

  isTrabajador(): boolean {
    return this.getRol() === 'TRABAJADOR';
  }

  isCliente(): boolean {
    return this.getRol() === 'CLIENTE';
  }
}
