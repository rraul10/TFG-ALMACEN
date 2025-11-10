import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideRouter } from '@angular/router';

// 🔹 Importamos los componentes standalone
import { DashboardComponent } from './app/pages/dashboard/dashboard.component';
import { GestionUsuariosComponent } from './app/features/usuarios/gestion-usuarios.component';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, HttpClientModule, FormsModule, MatSnackBarModule),
    provideRouter([
      { path: '', component: DashboardComponent },
      { path: 'admin/clientes', component: GestionUsuariosComponent },
      // si tienes otras rutas admin:
      // { path: 'admin/productos', component: GestionProductosComponent },
      // { path: 'admin/pedidos', component: GestionPedidosComponent },
    ])
  ]
});
