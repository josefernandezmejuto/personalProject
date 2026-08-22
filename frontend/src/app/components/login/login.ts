import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LoginRequest, JwtResponse } from '../../models/login.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  credentials: LoginRequest = { username: '', password: '' };
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage = '';

    if (!this.credentials.username || !this.credentials.password) {
      this.errorMessage = 'Por favor, completa todos los campos.';
      return;
    }

    this.authService.login(this.credentials).subscribe({
      next: (response: JwtResponse) => {
        // Validamos únicamente la existencia del token devuelto por el Backend
        if (response && response.token) {
          console.log('¡Login exitoso! Redirigiendo al dashboard...');

          this.router
            .navigate(['/dashboard'])
            .then((isNavigated) => {
              console.log('¿Navegación completada con éxito?:', isNavigated);
            })
            .catch((error) => {
              console.error('❌ Error al navegar al dashboard:', error);
            });
        }
      },
      error: (err) => {
        console.error('❌ Error al iniciar sesión:', err);
        this.errorMessage = 'Usuario o contraseña incorrectos.';
      },
    });
  }
}
