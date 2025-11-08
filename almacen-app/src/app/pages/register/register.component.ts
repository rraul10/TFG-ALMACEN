import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="register-page">
      <div class="register-card">
        <h2>Crear cuenta</h2>

        <form (ngSubmit)="onSubmit()" #registerForm="ngForm" novalidate>

  <!-- Nombre -->
  <div class="form-group">
    <label for="nombre">Nombre completo</label>
    <input
      id="nombre"
      type="text"
      name="nombre"
      [(ngModel)]="nombre"
      placeholder="Tu nombre"
      required
      pattern="^[a-zA-ZÁÉÍÓÚáéíóúÑñ ]+$">
    <div class="error" *ngIf="registerForm.submitted && (!nombre || !registerForm.controls['nombre']?.valid)">
      El nombre solo puede contener letras
    </div>
  </div>

  <!-- Apellidos -->
  <div class="form-group">
    <label for="apellidos">Apellidos</label>
    <input
      id="apellidos"
      type="text"
      name="apellidos"
      [(ngModel)]="apellidos"
      placeholder="Tus apellidos"
      required
      pattern="^[a-zA-ZÁÉÍÓÚáéíóúÑñ ]+$">
    <div class="error" *ngIf="registerForm.submitted && (!apellidos || !registerForm.controls['apellidos']?.valid)">
      Los apellidos solo pueden contener letras
    </div>
  </div>

  <!-- Correo -->
  <div class="form-group">
    <label for="correo">Correo electrónico</label>
    <input
      id="correo"
      type="email"
      name="correo"
      [(ngModel)]="correo"
      placeholder="ejemplo@correo.com"
      required
      pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.com$">
    <div class="error" *ngIf="registerForm.submitted && (!correo || !registerForm.controls['correo']?.valid)">
      Ingresa un correo válido que termine en .com
    </div>
  </div>

  <!-- Teléfono -->
  <div class="form-group">
    <label for="telefono">Teléfono</label>
    <input
      id="telefono"
      type="tel"
      name="telefono"
      [(ngModel)]="telefono"
      placeholder="Tu teléfono"
      required
      pattern="^[0-9]{9}$">
    <div class="error" *ngIf="registerForm.submitted && (!telefono || !registerForm.controls['telefono']?.valid)">
      Ingresa un teléfono válido de 9 dígitos
    </div>
  </div>

  <!-- Ciudad -->
  <div class="form-group">
    <label for="ciudad">Ciudad</label>
    <input
      id="ciudad"
      type="text"
      name="ciudad"
      [(ngModel)]="ciudad"
      placeholder="Tu ciudad"
      required>
    <div class="error" *ngIf="registerForm.submitted && !ciudad">
      La ciudad es obligatoria
    </div>
  </div>

  <!-- Contraseña -->
  <div class="form-group">
    <label for="password">Contraseña</label>
    <input
      id="password"
      type="password"
      name="password"
      [(ngModel)]="password"
      placeholder="Tu contraseña"
      required
      minlength="6">
    <div class="error" *ngIf="registerForm.submitted && (!password || password.length < 6)">
      La contraseña debe tener al menos 6 caracteres
    </div>
  </div>

  <button type="submit" [disabled]="registerForm.invalid">Registrar</button>

</form>



        <p class="message">{{ message }}</p>
        <p class="login-link">
          ¿Ya tienes cuenta? <a routerLink="/login">Inicia sesión</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    /* General styles */
body {
  font-family: 'Arial', sans-serif;
  background-color: #f4f7fa;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.error {
  color: #ef4444;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #f4f7fa;
}

.register-card {
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  font-weight: 600;
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
  display: block;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
  margin-top: 5px;
}

input:focus {
  border-color: #4caf50;
  outline: none;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #4caf50;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:disabled {
  background-color: #cfd8dc;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #45a049;
}

.message {
  color: #ff0000;
  font-size: 14px;
  text-align: center;
}

.login-link {
  text-align: center;
  margin-top: 20px;
}

.login-link a {
  color: #4caf50;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}

  `]
})
export class RegisterComponent {
  nombre = '';
  apellidos = '';
  correo = '';
  telefono = '';
  ciudad = '';
  password = '';
  message = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.message = 'Intentando registro...';

    const data = {
      nombre: this.nombre,
      apellidos: this.apellidos,
      correo: this.correo,
      telefono: this.telefono,
      ciudad: this.ciudad,
      password: this.password
    };

    this.authService.register(data).subscribe({
      next: () => {
        // Login automático tras registrarse
        this.authService.login({ correo: this.correo, password: this.password }).subscribe({
          next: (res: any) => {
            localStorage.setItem('token', res.token);

            // Guardamos el usuario completo devuelto por el backend
            localStorage.setItem('user', JSON.stringify(res.user));

            // Si quieres guardar el rol también
            if (res.user.roles && res.user.roles.length > 0) {
              localStorage.setItem('rol', res.user.roles[0]);
            }

            this.message = 'Registro e inicio de sesión correcto, redirigiendo...';
            setTimeout(() => this.router.navigate(['/']), 1000);
          },
          error: (err: any) => {
            console.error('Error login automático:', err);
            this.message = 'Registro correcto, pero error en login automático';
            setTimeout(() => this.router.navigate(['/login']), 2000);
          }
        });

      },
      error: (err: any) => {
        console.error('Error en registro:', err);
        this.message = 'Error en registro';
      }
    });
  }
}
