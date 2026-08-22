import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Persona } from '../models/persona.model';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  private apiUrl = 'http://localhost:8080/api/personas';

  private personasSubject = new BehaviorSubject<Persona[]>([]);
  public personas$ = this.personasSubject.asObservable();

  constructor(private http: HttpClient) {}

  // 1. GET ALL
  cargarPersonas(): Observable<Persona[]> {
    return this.http.get<Persona[]>(this.apiUrl).pipe(
      tap((personas) => this.personasSubject.next(personas))
    );
  }

  // 2. CREATE (POST)
  addPersona(nuevaPersona: Omit<Persona, 'id' | 'fechaRegistro'>): Observable<Persona> {
    console.log('2.- persona.service.ts - Datos a enviar para crear persona:', nuevaPersona);
    return this.http.post<Persona>(this.apiUrl, nuevaPersona).pipe(
      tap((personaCreada) => {
        // Agregamos la persona devuelta por DB al estado local
        const listaActual = this.personasSubject.getValue();
        this.personasSubject.next([...listaActual, personaCreada]);
      })
    );
  }

  // 3. UPDATE (PUT/PATCH)
  updatePersona(id: number, personaActualizada: Partial<Persona>): Observable<Persona> {
    return this.http.put<Persona>(`${this.apiUrl}/${id}`, personaActualizada).pipe(
      tap((personaServidor) => {
        const listaActual = this.personasSubject.getValue();
        const listaModificada = listaActual.map(p => p.id === id ? personaServidor : p);
        this.personasSubject.next(listaModificada);
      })
    );
  }

  // 4. DELETE
  deletePersona(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const listaActual = this.personasSubject.getValue();
        this.personasSubject.next(listaActual.filter(p => p.id !== id));
      })
    );
  }
}
