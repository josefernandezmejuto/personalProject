export interface LoginRequest {
  username: string;
  password:  string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string; // El signo '?' significa opcional, por si el login falla
}