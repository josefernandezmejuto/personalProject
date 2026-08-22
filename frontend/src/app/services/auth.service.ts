import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest, JwtResponse } from '../models/login.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/auth';
  private tokenKey = 'jwt_token';

  /**
   * Envia las credenciales (username y password) al backend Spring Boot.
   * Si el login es exitoso, almacena el token devuelto en sessionStorage.
   */
  login(credentials: LoginRequest): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          this.guardarToken(response.token);
        }
      })
    );
  }

  /**
   * Almacena el token JWT recibido en el almacenamiento de sesión.
   */
  guardarToken(token: string): void {
    sessionStorage.setItem(this.tokenKey, token);
  }

  /**
   * Recupera el token JWT almacenado.
   */
  obtenerToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  /**
   * Valida si existe un token almacenado en la sesión.
   */
  estaAutenticado(): boolean {
    const token = this.obtenerToken();
    return !!token;
  }

  /**
   * Cierra la sesión eliminando el token de la memoria local.
   */
  logout(): void {
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem('jwt_token');
  }
}
