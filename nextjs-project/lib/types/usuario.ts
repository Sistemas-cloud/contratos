/**
 * Tipos TypeScript para usuarios
 */

export interface Usuario {
  id: string;
  usuario_username: string;
  usuario_password?: string; // No incluir en responses del cliente
  usuario_nombre: string;
  usuario_app: string; // Apellido Paterno
  usuario_apm: string; // Apellido Materno
  nivel: number; // 1 = normal, 2 = admin
  created_at: string;
  updated_at: string;
}

export interface UsuarioSinPassword extends Omit<Usuario, 'usuario_password'> {}

export type NivelUsuario = 1 | 2;

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface UsuarioResponse {
  data: UsuarioSinPassword | null;
  error: string | null;
}

export interface AuthSession {
  user: UsuarioSinPassword;
  token: string;
}

// Tipo para el contexto de autenticación
export interface AuthContextType {
  user: UsuarioSinPassword | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
}
