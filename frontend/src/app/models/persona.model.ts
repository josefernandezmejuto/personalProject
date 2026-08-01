export interface Direccion {
  codigoPostal?: string;
  urbanizacion: string;
  ciudad: string;
  provinciaEstado: string;
  pais: string;
}

export interface Persona {
  id: number;
  nombre: string;
  apellidos: string;
  cedula: string; // <-- AÑADE ESTA LÍNEA
  email: string;
  telefonoFijo?: string;
  telefonoCelular: string;
  direccion: Direccion;
  activo: boolean;
  fechaRegistro: Date;
}
