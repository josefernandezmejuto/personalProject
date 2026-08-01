export interface Articulo {
  id?: number;
  codigo: string;
  descripcion: string;
  categoria: string;
  precioUnitario: number;
  descuento: number;        // Porcentaje de descuento (0 - 100)
  stockActual: number;
  stockMinimo: number;
  activo: boolean;
  fechaCreacion?: Date;
}
