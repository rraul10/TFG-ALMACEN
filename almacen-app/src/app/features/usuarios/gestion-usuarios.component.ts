import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { UserService, User } from '@core/services/user.service'; 
import { Router } from '@angular/router';

@Component({    
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  template: `
    <div class="panel-container">
      <div class="panel-header">
        <h1>👥 Gestión de Usuarios</h1>
        <div>
          <button class="btn btn-primary" (click)="nuevoUsuario()">➕ Nuevo Usuario</button>
          <button class="btn btn-secondary" (click)="volverAlDashboard()">🏠 Dashboard</button>
        </div>
      </div>

      <div class="usuarios-container">
        <div *ngFor="let u of usuarios" class="usuario-card">
          <div class="usuario-main">
            <img [src]="'http://localhost:8080/files/' + u.foto" alt="{{ u.nombre }}" class="usuario-foto" />
            <div class="usuario-info">
              <h3>{{ u.nombre }} {{ u.apellidos }}</h3>
              <p><strong>Correo:</strong> {{ u.correo }}</p>
              <p><strong>Teléfono:</strong> {{ u.telefono }}</p>
              <p><strong>Ciudad:</strong> {{ u.ciudad }}</p>
            </div>
          </div>
          <div class="usuario-actions">
            <button class="btn btn-edit" (click)="editarUsuario(u)">✏️ Editar</button>
            <button class="btn btn-delete" (click)="eliminarUsuario(u.id)">🗑️ Eliminar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal-backdrop" *ngIf="usuarioSeleccionado">
      <div class="form-container modal">
        <h2>{{ usuarioSeleccionado.id ? 'Editar Usuario' : 'Añadir Usuario' }}</h2>
        <div class="form-grid">
          <label>Nombre:<input [(ngModel)]="usuarioSeleccionado!.nombre" /></label>
          <label>Apellidos:<input [(ngModel)]="usuarioSeleccionado!.apellidos" /></label>
          <label>Correo:<input [(ngModel)]="usuarioSeleccionado!.correo" /></label>
          <label>Contraseña:<input [(ngModel)]="usuarioSeleccionado!.password" type="password" /></label>
          <label>Teléfono:<input [(ngModel)]="usuarioSeleccionado!.telefono" /></label>
          <label>Ciudad:<input [(ngModel)]="usuarioSeleccionado!.ciudad" /></label>
          <label>Foto:<input type="file" (change)="onFileSelected($event)" /></label>
        </div>

        <div class="form-actions">
          <button class="btn btn-primary" (click)="guardarUsuario()">💾 Guardar</button>
          <button class="btn btn-secondary" (click)="cancelarEdicion()">✖ Cancelar</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; background-color: #f3f4f6; min-height: 100vh; padding: 2rem; font-family: 'Segoe UI', Roboto, sans-serif; }

    .panel-container { max-width: 1100px; margin: 0 auto; background-color: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
    .panel-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e5e7eb; padding-bottom: 1rem; margin-bottom: 1.5rem; }
    .panel-header h1 { font-size: 1.6rem; color: #1f2937; margin: 0; }

    .btn { padding: 0.6rem 1.2rem; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.95rem; transition: all 0.2s; }
    .btn-primary { background-color: #2563eb; color: white; }
    .btn-primary:hover { background-color: #1d4ed8; }
    .btn-secondary { background-color: #9ca3af; color: white; }
    .btn-secondary:hover { background-color: #6b7280; }
    .btn-edit { background-color: #3b82f6; color: white; }
    .btn-edit:hover { background-color: #2563eb; }
    .btn-delete { background-color: #dc2626; color: white; }
    .btn-delete:hover { background-color: #b91c1c; }

    .usuarios-container { display: flex; flex-direction: column; gap: 1rem; }
    .usuario-card { background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between; transition: box-shadow 0.2s; }
    .usuario-card:hover { box-shadow: 0 2px 10px rgba(0,0,0,0.08); }
    .usuario-main { display: flex; align-items: center; gap: 1.2rem; }
    .usuario-foto { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 2px solid #e5e7eb; }
    .usuario-info { flex-grow: 1; }
    .usuario-info h3 { margin: 0 0 0.3rem 0; color: #111827; font-size: 1.2rem; }
    .usuario-info p { margin: 0.2rem 0; color: #4b5563; font-size: 0.95rem; }
    .usuario-actions { display: flex; gap: 0.8rem; margin-top: 1rem; justify-content: flex-end; }

    .form-container { background-color: #f9fafb; border-radius: 10px; padding: 1.5rem; border: 1px solid #e5e7eb; }
    .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; }
    label { display: flex; flex-direction: column; font-weight: 600; color: #374151; font-size: 0.9rem; }
    input { margin-top: 0.3rem; padding: 0.6rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 0.95rem; }
    input:focus { outline: none; border-color: #2563eb; box-shadow: 0 0 0 2px rgba(37,99,235,0.2); }
    .form-actions { display: flex; gap: 0.8rem; justify-content: flex-end; margin-top: 1rem; }

    /* Modal styles */
    .modal-backdrop {
      position: fixed;
      top:0; left:0; right:0; bottom:0;
      background-color: rgba(0,0,0,0.4);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .modal { width: 90%; max-width: 600px; }

    @media (max-width: 768px) {
      .usuario-main { flex-direction: column; align-items: flex-start; }
      .usuario-foto { width: 70px; height: 70px; }
      .usuario-actions { justify-content: center; }
    }
  `]
})
export class GestionUsuariosComponent implements OnInit {
  usuarios: User[] = [];
  usuarioSeleccionado: User | null = null;

  selectedFile: File | null = null;

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.userService.getAll().subscribe({
      next: (data: User[]) => (this.usuarios = data),
      error: (err: any) => console.error('Error cargando usuarios', err)
    });
  }

  nuevoUsuario() {
    this.usuarioSeleccionado = {
      id: 0,
      nombre: '',
      apellidos: '',
      correo: '',
      password: '',
      telefono: '',
      ciudad: '',
      foto: '',
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      deleted: false
    };
  }

  editarUsuario(u: User) {
    this.usuarioSeleccionado = { ...u };
    this.selectedFile = null;
  }

  cancelarEdicion() {
    this.usuarioSeleccionado = null;
    this.selectedFile = null;
  }

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  guardarUsuario() {
    if (!this.usuarioSeleccionado) return;

    // Crear copia para enviar y quitar id si es nuevo
    const userToSend: Partial<User> = { ...this.usuarioSeleccionado }; // Partial hace todos opcionales
    if (userToSend.id === 0) delete userToSend.id;


    const formData = new FormData();
    formData.append('user', JSON.stringify(userToSend));
    if (this.selectedFile) {
      formData.append('foto', this.selectedFile);
    }

    const req = this.usuarioSeleccionado.id
      ? this.userService.updateWithFile(this.usuarioSeleccionado.id, formData)
      : this.userService.createWithFile(formData);

    req.subscribe({
      next: () => {
        this.snackBar.open(
          this.usuarioSeleccionado!.id ? 'Usuario actualizado ✅' : 'Usuario añadido ✅',
          'Cerrar',
          { duration: 2000 }
        );
        this.cargarUsuarios();
        this.cancelarEdicion();
      },
      error: (err) => console.error('Error guardando usuario', err)
    });
  }


  eliminarUsuario(id: number) {
    if (!confirm('¿Seguro que quieres eliminar este usuario?')) return;
    this.userService.delete(id).subscribe({
      next: () => {
        this.snackBar.open('Usuario eliminado ❌', 'Cerrar', { duration: 2000 });
        this.cargarUsuarios();
      },
      error: (err: any) => console.error('Error eliminando usuario', err)
    });
  }

  volverAlDashboard() {
    this.router.navigate(['/dashboard']);
  }
}