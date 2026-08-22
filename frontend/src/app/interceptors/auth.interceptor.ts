import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.obtenerToken();

  // 1. Inyectar Token si existe
  let authReq = req;
  if (token) {
    authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  // 2. Procesar la petición y capturar errores de sesión expirada
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si el servidor devuelve 401 (No autorizado) o 403 (Prohibido/Token expirado)
      if (error.status === 401 || error.status === 403) {
        console.warn('⚠️ Sesión expirada o token inválido. Redirigiendo al Login...');

        // Cierra la sesión (elimina el token de sessionStorage)
        authService.logout();

        // Redirige al login
        router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
};
