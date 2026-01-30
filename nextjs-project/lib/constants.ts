/**
 * Constantes globales de la aplicación
 */

export const APP_NAME = 'Sistema de Contratos';

export const TIPOS_CONTRATO = {
  DETERMINADO: 'determinado',
  INDETERMINADO: 'indeterminado',
  HORA: 'hora',
} as const;

export const LABELS_TIPOS_CONTRATO = {
  determinado: 'Tiempo de Prueba',
  indeterminado: 'Tiempo Indeterminado',
  hora: 'Por Hora (Jornada Reducida)',
} as const;

export const NIVELES_USUARIO = {
  NORMAL: 1,
  ADMIN: 2,
} as const;

export const LABELS_NIVELES = {
  1: 'Usuario',
  2: 'Administrador',
} as const;

export const DIAS_SEMANA = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
] as const;

export const ESTADOS_CIVILES = [
  'Soltero(a)',
  'Casado(a)',
  'Divorciado(a)',
  'Viudo(a)',
  'Unión Libre',
] as const;

export const NACIONALIDADES = [
  'Mexicana',
  'Extranjera',
] as const;

// Información de la empresa (para contratos)
export const EMPRESA = {
  nombre: 'INSTITUTO WINSTON CHURCHILL, A.C.',
  representante: 'Ana Matilde Ávila Azuara',
  cargo_representante: 'Representante Legal',
  domicilio: 'Calle 3 número 309, colonia Jardín 20 de noviembre, ciudad Madero, Tamaulipas',
  instrumento_publico: 'nueve mil cuatrocientos veintidós',
  volumen: 'doscientos cuarenta',
  fecha_constitucion: 'veintitrés de julio de mil novecientos noventa y nueve',
  notario: 'LIC. FRANCISCO HACES ARGUELLES',
  notaria_numero: '38',
  distrito_judicial: 'Segundo Distrito Judicial del Estado, que comprende los municipios de Tampico, Ciudad Madero y Altamira',
  ciudad: 'Ciudad Madero',
  estado: 'Tamaulipas',
} as const;

// Configuración para generación de documentos
export const DOCUMENTO_CONFIG = {
  margen_superior: 15,
  margen_inferior: 15,
  margen_izquierdo: 25,
  margen_derecho: 25,
  tamano_fuente_titulo: 8,
  tamano_fuente_texto: 8,
} as const;

// Rutas de la aplicación
export const RUTAS = {
  LOGIN: '/login',
  DASHBOARD: '/',
  CONTRATOS: '/contratos',
  NUEVO_CONTRATO: '/contratos/nuevo',
  PERFIL: '/perfil',
} as const;

// Configuración de Supabase Storage
export const STORAGE = {
  BUCKET_CONTRATOS: 'contratos',
  CARPETA_PDFS: 'pdfs',
  CARPETA_DOCX: 'docx',
} as const;

// Mensajes de error comunes
export const MENSAJES_ERROR = {
  NO_AUTORIZADO: 'No tienes permisos para realizar esta acción',
  SESION_EXPIRADA: 'Tu sesión ha expirado',
  ERROR_GENERICO: 'Ha ocurrido un error. Por favor, intenta de nuevo',
  CAMPOS_INCOMPLETOS: 'Por favor, completa todos los campos requeridos',
  PORCENTAJES_INVALIDOS: 'La suma de porcentajes de beneficiarios debe ser 100%',
} as const;

// Mensajes de éxito
export const MENSAJES_EXITO = {
  CONTRATO_CREADO: 'Contrato creado exitosamente',
  CONTRATO_ACTUALIZADO: 'Contrato actualizado exitosamente',
  CONTRATO_ELIMINADO: 'Contrato eliminado exitosamente',
  PDF_GENERADO: 'PDF generado exitosamente',
  DOCX_GENERADO: 'Documento Word generado exitosamente',
} as const;
