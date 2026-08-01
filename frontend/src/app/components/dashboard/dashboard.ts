import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent {
  // Controla si el menú lateral se muestra en móviles
  menuAbierto = false;

  constructor(private router: Router) {}

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarMenuMovil(): void {
    // Cierra el menú automáticamente al hacer clic en una opción (solo afecta a móviles)
    this.menuAbierto = false;
  }

  logout(): void {
    // Por ahora simulamos el logout borrando el rastro y volviendo al login
    this.router.navigate(['/login']);
  }
}