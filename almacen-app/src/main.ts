import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { DashboardComponent } from './app/pages/dashboard/dashboard.component';
import { LoginComponent } from './app/pages/login/login.component';
import { RegisterComponent } from './app/pages/register/register.component';
import { PerfilComponent } from './app/pages/perfil/perfil.component';
import { MisPedidosComponent } from './app/features/mispedidos/mis-pedidos.component';
import { GestionUsuariosComponent } from './app/features/usuarios/gestion-usuarios.component';
import { ProductosAdminComponent } from './app/features/productos/productos-admin.component';
import { PedidosAdminComponent } from './app/features/pedidos/pedidos-admin.component';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      HttpClientModule,
      FormsModule,
      MatSnackBarModule
    ),
    provideRouter([
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'perfil', component: PerfilComponent },
      { path: 'mispedidos', component: MisPedidosComponent },

      // Rutas admin
      { path: 'admin/clientes', component: GestionUsuariosComponent },
      { path: 'admin/productos', component: ProductosAdminComponent },
      { path: 'admin/pedidos', component: PedidosAdminComponent },


      // fallback
      { path: '**', redirectTo: 'dashboard' }
    ])
  ]
});
