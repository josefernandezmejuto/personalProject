import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { DashboardComponent } from './components/dashboard/dashboard';
import { PersonaComponent } from './components/persona/persona';
import { ArticuloComponent } from './components/articulo/articulo';
import { FacturaComponent } from './components/factura/factura';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  // RUTA PRINCIPAL DEL SISTEMA (Protegida por AuthGuard)
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard], // <-- Bloquea el acceso a todo el Dashboard si no hay Token JWT
    children: [
      { path: '', redirectTo: 'personas', pathMatch: 'full' },
      { path: 'personas', component: PersonaComponent },
      { path: 'inventario', component: ArticuloComponent },
      { path: 'facturas', component: FacturaComponent }
    ]
  },

  // Cualquier ruta no encontrada redirige al login
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];
