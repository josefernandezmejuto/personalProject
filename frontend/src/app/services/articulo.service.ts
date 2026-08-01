import { Injectable } from '@angular/core';
import { Articulo } from '../models/articulo.model';

@Injectable({
  providedIn: 'root'
})
export class ArticuloService {

  private listaArticulos: Articulo[] = [
    {
      id: 1,
      codigo: 'ART-001',
      descripcion: 'Teclado Mecánico RGB',
      categoria: 'Periféricos',
      precioUnitario: 45.00,
      descuento: 5,
      stockActual: 20,
      stockMinimo: 5,
      activo: true,
      fechaCreacion: new Date()
    },
    {
      id: 2,
      codigo: 'ART-002',
      descripcion: 'Monitor 24 Pulgadas Full HD',
      categoria: 'Pantallas',
      precioUnitario: 130.00,
      descuento: 0,
      stockActual: 8,
      stockMinimo: 2,
      activo: true,
      fechaCreacion: new Date()
    }
  ];

  getArticulos(): Articulo[] {
    return [...this.listaArticulos];
  }

  addArticulo(articulo: Articulo): void {
    articulo.id = this.listaArticulos.length > 0
      ? Math.max(...this.listaArticulos.map(a => a.id || 0)) + 1
      : 1;
    articulo.fechaCreacion = new Date();
    this.listaArticulos.push(articulo);
  }

  updateArticulo(id: number, articuloActualizado: Articulo): void {
    const index = this.listaArticulos.findIndex(a => a.id === id);
    if (index !== -1) {
      this.listaArticulos[index] = { ...articuloActualizado, id };
    }
  }

  deleteArticulo(id: number): void {
    this.listaArticulos = this.listaArticulos.filter(a => a.id !== id);
  }
}
