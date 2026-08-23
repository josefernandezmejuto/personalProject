export interface Articulo {
  id?: number;
  codigo: string;
  descripcion: string;
  precioUnitario: number;
  precioUrgente: number;
  activo: boolean;
  fechaCreacion?: Date;
}
