export interface Articulo {
  id?: number;
  codigo: string;
  descripcion: string;
  categoria: string;
  precioUnitario: number;
  precioUrgente: number;
  activo: boolean;
  fechaCreacion?: Date;
}
