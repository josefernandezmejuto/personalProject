import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { DashboardComponent } from './components/dashboard/dashboard'; // <-- Importamos el menú
import { PersonaComponent } from './components/persona/persona';
import { ArticuloComponent } from './components/articulo/articulo';
import { FacturaComponent } from './components/factura/factura';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  // RUTA PRINCIPAL DEL SISTEMA (Contiene el menú lateral)
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      // Al entrar a /dashboard, redirige por defecto a la sub-pantalla de personas
      { path: '', redirectTo: 'personas', pathMatch: 'full' },

      // Las pantallas hijas se renderizan dentro del <router-outlet> del dashboard
      { path: 'personas', component: PersonaComponent },

      // 💡 AÑADIMOS LA RUTA HIJA PARA INVENTARIO AQUÍ:
      { path: 'inventario', component: ArticuloComponent },

      { path: 'facturas', component: FacturaComponent }
    ]
  },

  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];
