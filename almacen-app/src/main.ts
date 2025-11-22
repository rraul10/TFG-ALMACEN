import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideRouter } from '@angular/router';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { AppComponent } from './app/app.component';
import { DashboardComponent } from './app/pages/dashboard/dashboard.component';
import { LoginComponent } from './app/pages/login/login.component';
import { RegisterComponent } from './app/pages/register/register.component';
import { PerfilComponent } from './app/pages/perfil/perfil.component';
import { MisPedidosComponent } from './app/features/mispedidos/mis-pedidos.component';
import { GestionUsuariosComponent } from './app/features/usuarios/gestion-usuarios.component';
import { ProductosAdminComponent } from './app/features/productos/productos-admin.component';
import { PedidosAdminComponent } from './app/features/pedidos/pedidos-admin.component';
import { adminTrabajadorGuard } from 'guards/admin-trabajador-guard';
import { ForgotPasswordComponent } from './app/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './app/auth/forgot-password/reset-password.component';

registerLocaleData(localeEs);

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      HttpClientModule,
      FormsModule,
      MatSnackBarModule
    ),
    { provide: LOCALE_ID, useValue: 'es-ES' }, 
   provideRouter([
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'perfil', component: PerfilComponent },
      { path: 'mispedidos', component: MisPedidosComponent },
      { path: 'reset-password', component: ResetPasswordComponent },

      { 
        path: 'admin/clientes', 
        component: GestionUsuariosComponent,
        canActivate: [adminTrabajadorGuard] 
      },
      { 
        path: 'admin/productos', 
        component: ProductosAdminComponent,
        canActivate: [adminTrabajadorGuard]
      },
      { 
        path: 'admin/pedidos', 
        component: PedidosAdminComponent,
        canActivate: [adminTrabajadorGuard]
      },

      { path: 'forgot-password', component: ForgotPasswordComponent },

      { path: '**', redirectTo: 'dashboard' }
    ])

  ]
});
