import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { MisPedidosComponent } from './features/mispedidos/mis-pedidos.component';
import { ProductosAdminComponent } from './features/productos/productos-admin.component';
import { PedidosAdminComponent } from './features/pedidos/pedidos-admin.component';
import { adminTrabajadorGuard } from 'guards/admin-trabajador-guard';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/forgot-password/reset-password.component';


const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'mispedidos', component: MisPedidosComponent },
  { path: 'reset-password', component: ResetPasswordComponent },

  
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
];


@NgModule({
  imports: [RouterModule.forRoot(routes)], 
  exports: [RouterModule]
})
export class AppRoutingModule {}
