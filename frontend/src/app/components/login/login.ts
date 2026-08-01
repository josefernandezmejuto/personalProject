import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; // <-- 1. ASEGÚRATE DE IMPORTAR RouterModule AQUÍ
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/login.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- 1. IMPORTA ESTA LÍNEA

@Component({
  selector: 'app-login',
  standalone: true, // Si es un componente standalone
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  credentials: LoginRequest = { username: '', password: '' };

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onSubmit(): void {
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        if (response.success && response.token) {
          console.log('¡Login exitoso! Forzando salto al dashboard...');

          this.router
            .navigate(['/dashboard'])
            .then((isNavigated) => {
              console.log('¿La navegación se completó con éxito?:', isNavigated);
            })
            .catch((error) => {
              console.error('❌ ERROR AL NAVEGAR:', error);
            });
        }
      },
      error: (err) => console.error('Error al iniciar sesión:', err),
    });
  }
}
