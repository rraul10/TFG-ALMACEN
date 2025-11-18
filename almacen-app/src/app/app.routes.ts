import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { MisPedidosComponent } from './features/mispedidos/mis-pedidos.component';
import { ProductosAdminComponent } from './features/productos/productos-admin.component';
import { PedidosAdminComponent } from './features/pedidos/pedidos-admin.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'mispedidos', component: MisPedidosComponent },
  
  { path: 'admin/productos', component: ProductosAdminComponent },
  { path: 'admin/pedidos', component: PedidosAdminComponent },

  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], 
  exports: [RouterModule]
})
export class AppRoutingModule {}
