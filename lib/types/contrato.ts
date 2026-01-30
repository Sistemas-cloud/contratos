/**
 * Tipos TypeScript para el sistema de contratos
 */

export type TipoContrato = 'determinado' | 'indeterminado' | 'hora';

export interface Beneficiario {
  nombre: string;
  parentesco: string;
  porcentaje: number;
}

export interface Testigos {
  testigo1: string;
  testigo2: string;
}

// Base común para todos los contratos
export interface ContratoBase {
  id: string;
  // Datos del trabajador
  nombre: string;
  puesto: string;
  nacionalidad: string;
  edad: number;
  e_civil: string;
  rfc: string;
  domicilio: string;
  curp: string;
  funciones: string;
  
  // Horario y días
  dias: string; // Días separados por comas
  hora_entrada: string; // formato HH:mm
  hora_salida: string; // formato HH:mm
  
  // Beneficiarios
  bene1: string;
  paren1: string;
  porc1: number;
  bene2?: string;
  paren2?: string;
  porc2?: number;
  
  // Testigos
  testigo1: string;
  testigo2: string;
  
  // Metadata
  nivel: number;
  nombre_act?: string;
  fecha_registro: string;
  ultima_act?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

// Contrato Determinado (Tiempo de Prueba)
export interface ContratoDeterminado extends ContratoBase {
  tipo: 'determinado';
  fecha_contrato: string;
  fecha_termino: string;
  sueldo_mensual: number;
}

// Contrato Indeterminado
export interface ContratoIndeterminado extends ContratoBase {
  tipo: 'indeterminado';
  fecha_leido: string;
  fecha_inicio: string;
  fecha_contrato: string;
  salario: number;
}

// Contrato por Hora
export interface ContratoHora extends ContratoBase {
  tipo: 'hora';
  fecha_inicio_esc: string;
  fecha_termino_esc: string;
  fecha_contrato: string;
  costo_hora: number;
}

// Union type de todos los contratos
export type Contrato = ContratoDeterminado | ContratoIndeterminado | ContratoHora;

// Tipos para formularios (omitiendo campos auto-generados)
export type ContratoFormData = Omit<
  Contrato,
  'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by' | 'fecha_registro' | 'ultima_act'
>;

// Tipos para respuestas de API
export interface ContratoResponse {
  data: Contrato | null;
  error: string | null;
}

export interface ContratosListResponse {
  data: Contrato[];
  error: string | null;
  count?: number;
}

// Filtros para búsqueda
export interface ContratoFilters {
  tipo?: TipoContrato;
  nombre?: string;
  nivel?: number;
  fecha_desde?: string;
  fecha_hasta?: string;
}

// Tipo para estadísticas
export interface ContratoStats {
  total: number;
  determinados: number;
  indeterminados: number;
  horas: number;
  por_nivel: Record<number, number>;
}
