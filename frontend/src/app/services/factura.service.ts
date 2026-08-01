import { Injectable } from '@angular/core';
import { Factura } from '../models/factura.model';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  private listaFacturas: Factura[] = [];

  getFacturas(): Factura[] {
    return [...this.listaFacturas];
  }

  generarNumeroFactura(): string {
    const correlativo = (this.listaFacturas.length + 1).toString().padStart(6, '0');
    return `FACT-${correlativo}`;
  }

  addFactura(factura: Factura): void {
    factura.id = this.listaFacturas.length > 0
      ? Math.max(...this.listaFacturas.map(f => f.id || 0)) + 1
      : 1;
    factura.fechaEmision = new Date();
    this.listaFacturas.push(factura);
  }

  anularFactura(id: number): void {
    const factura = this.listaFacturas.find(f => f.id === id);
    if (factura) {
      factura.estado = 'Anulada';
    }
  }
}
