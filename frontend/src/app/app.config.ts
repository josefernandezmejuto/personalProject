import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Eliminamos 'provideZoneChangeDetection' para que Angular use Zone.js por defecto de forma global
    provideRouter(routes), 
    provideHttpClient()
  ]
};