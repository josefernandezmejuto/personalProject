import { Persona } from './persona.model';
import { Articulo } from './articulo.model';

export interface DetalleFactura {
  articulo: Articulo;
  cantidad: number;
  precioUnitario: number;
  descuento: number; // Porcentaje aplicado
  subtotal: number;
}

export interface Factura {
  id?: number;
  numeroFactura: string;
  fechaEmision: Date;
  cliente: Persona;
  detalles: DetalleFactura[];
  subtotal: number;
  montoDescuentoTotal: number;
  aplicaProntoPago: boolean;       // 🆕 Indica si se aplicó pronto pago
  montoProntoPago: number;         // 🆕 Monto descontado por pronto pago
  montoIva: number;
  total: number;
  estado: 'Pendiente' | 'Pagada' | 'Anulada';
}