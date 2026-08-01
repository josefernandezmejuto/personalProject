import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Persona } from '../models/persona.model';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  // Un registro inicial mockeado para no ver la pantalla vacía al arrancar
  private listaPersonas: Persona[] = [
    {
      id: 1,
      nombre: 'Manuel',
      apellidos: 'Fernández',
      cedula: 'V-6916613', // <-- AÑADE UN VALOR MOCKEADO AQUÍ
      email: 'manuel.fernandez@email.com',
      telefonoCelular: '+584129092717',
      telefonoFijo: '+582127309486',
      activo: true,
      fechaRegistro: new Date(),
      direccion: {
        codigoPostal: '28046',
        urbanizacion: 'Sabana Grande',
        ciudad: 'Caracas',
        provinciaEstado: 'Miranda',
        pais: 'Venezuela'
      }
    }
  ];

  // El BehaviorSubject nos permite transmitir la lista en tiempo real a cualquier componente
  private personasSubject = new BehaviorSubject<Persona[]>(this.listaPersonas);
  private idContador = 2; // Simulador de ID auto-incremental

  constructor() {}

  // 1. OBTENER TODAS
  getPersonas(): Observable<Persona[]> {
    return this.personasSubject.asObservable();
  }

  // 2. INCLUIR (CREAR)
  addPersona(nuevaPersona: Omit<Persona, 'id' | 'fechaRegistro'>): void {
    const personaCompleta: Persona = {
      ...nuevaPersona,
      id: this.idContador++,
      fechaRegistro: new Date()
    };
    this.listaPersonas = [...this.listaPersonas, personaCompleta];
    this.personasSubject.next(this.listaPersonas);
  }

  // 3. ACTUALIZAR (EDITAR)
  updatePersona(id: number, personaActualizada: Partial<Persona>): void {
    this.listaPersonas = this.listaPersonas.map(p => {
      if (p.id === id) {
        return {
          ...p,
          ...personaActualizada,
          direccion: personaActualizada.direccion
            ? { ...p.direccion, ...personaActualizada.direccion }
            : p.direccion
        };
      }
      return p;
    });
    this.personasSubject.next(this.listaPersonas);
  }

  // 4. ELIMINAR (BORRAR)
  deletePersona(id: number): void {
    this.listaPersonas = this.listaPersonas.filter(p => p.id !== id);
    this.personasSubject.next(this.listaPersonas);
  }
}
