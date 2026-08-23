import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Factura } from '../models/factura.model';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/facturas';

  private facturasSubject = new BehaviorSubject<Factura[]>([]);
  public facturas$ = this.facturasSubject.asObservable();

  cargarFacturas(): Observable<Factura[]> {
    return this.http.get<Factura[]>(this.apiUrl).pipe(
      tap((facturas: Factura[]) => this.facturasSubject.next(facturas))
    );
  }

  getFacturas(): Factura[] {
    return this.facturasSubject.getValue();
  }

  addFactura(factura: Factura): Observable<Factura> {
    return this.http.post<Factura>(this.apiUrl, factura).pipe(
      tap((nuevaFactura: Factura) => {
        const listaActual = this.facturasSubject.getValue();
        this.facturasSubject.next([nuevaFactura, ...listaActual]);
      })
    );
  }

  anularFactura(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/anular`, {}).pipe(
      tap(() => {
        const listaActual = this.facturasSubject.getValue();
        const listaActualizada: Factura[] = listaActual.map(f => {
          if (f.id === id) {
            // 🟢 CASTEO ESTRICTO: 'Anulada' as const respeta el tipo de la interfaz Factura
            return { ...f, estado: 'Anulada' as const };
          }
          return f;
        });
        this.facturasSubject.next(listaActualizada);
      })
    );
  }

  obtenerSiguienteNumero(): Observable<{ numeroFactura: string }> {
    return this.http.get<{ numeroFactura: string }>(`${this.apiUrl}/siguiente-numero`);
  }

  generarNumeroFactura(): string {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return `FACT-${randomNum}`;
  }
}
