/**
 * Esquemas de validación con Zod para formularios y API
 */

import { z } from 'zod';

// Validador para RFC (12 o 13 caracteres)
const rfcSchema = z.string()
  .min(12, 'El RFC debe tener al menos 12 caracteres')
  .max(13, 'El RFC no puede tener más de 13 caracteres')
  .regex(/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/, 'Formato de RFC inválido')
  .transform(val => val.toUpperCase().trim());

// Validador para CURP
const curpSchema = z.string()
  .length(18, 'El CURP debe tener 18 caracteres')
  .regex(/^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/, 'Formato de CURP inválido')
  .transform(val => val.toUpperCase());

// Validador para beneficiarios
const beneficiarioSchema = z.object({
  nombre: z.string().min(1, 'Nombre requerido'),
  parentesco: z.string().min(1, 'Parentesco requerido'),
  porcentaje: z.number().min(1).max(100)
});

// Validador para testigos
const testigosSchema = z.object({
  testigo1: z.string().min(1, 'Testigo 1 requerido'),
  testigo2: z.string().min(1, 'Testigo 2 requerido')
});

// Schema base compartido por todos los contratos
const contratoBaseSchema = z.object({
  // Datos del trabajador
  nombre: z.string().min(1, 'Nombre requerido'),
  puesto: z.string().min(1, 'Puesto requerido'),
  nacionalidad: z.string().min(1, 'Nacionalidad requerida').default('Mexicana'),
  edad: z.number().min(18, 'Debe ser mayor de 18 años').max(100),
  e_civil: z.string().min(1, 'Estado civil requerido'),
  rfc: rfcSchema,
  domicilio: z.string().min(1, 'Domicilio requerido'),
  curp: curpSchema,
  funciones: z.string().min(10, 'Descripción de funciones requerida'),
  
  // Horario y días
  dias: z.string().min(1, 'Seleccione al menos un día'),
  hora_entrada: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido'),
  hora_salida: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido'),
  
  // Beneficiarios
  bene1: z.string().min(1, 'Beneficiario 1 requerido'),
  paren1: z.string().min(1, 'Parentesco 1 requerido'),
  porc1: z.number().min(1).max(100),
  bene2: z.string().optional(),
  paren2: z.string().optional(),
  porc2: z.number().min(0).max(100).optional(),
  
  // Testigos
  testigo1: z.string().min(1, 'Testigo 1 requerido'),
  testigo2: z.string().min(1, 'Testigo 2 requerido'),
  
  // Metadata
  nivel: z.number().int().min(1).max(2).default(1),
  nombre_act: z.string().optional(),
});

// Validación personalizada para suma de porcentajes
const validarPorcentajes = (data: any) => {
  const porc1 = data.porc1 || 0;
  const porc2 = data.porc2 || 0;
  
  if (porc1 + porc2 !== 100) {
    return false;
  }
  return true;
};

// Schema para Contrato Determinado
export const contratoDeterminadoSchema = contratoBaseSchema.extend({
  tipo: z.literal('determinado'),
  fecha_contrato: z.string().min(1, 'Fecha de contrato requerida'),
  fecha_termino: z.string().min(1, 'Fecha de término requerida'),
  sueldo_mensual: z.number().positive('El sueldo debe ser mayor a 0'),
}).refine(validarPorcentajes, {
  message: 'La suma de porcentajes debe ser 100%',
  path: ['porc1']
}).refine((data) => {
  const inicio = new Date(data.fecha_contrato);
  const fin = new Date(data.fecha_termino);
  return fin > inicio;
}, {
  message: 'La fecha de término debe ser posterior a la fecha de contrato',
  path: ['fecha_termino']
});

// Schema para Contrato Indeterminado
export const contratoIndeterminadoSchema = contratoBaseSchema.extend({
  tipo: z.literal('indeterminado'),
  fecha_leido: z.string().min(1, 'Fecha de lectura requerida'),
  fecha_inicio: z.string().min(1, 'Fecha de inicio requerida'),
  fecha_contrato: z.string().min(1, 'Fecha de contrato requerida'),
  salario: z.number().positive('El salario debe ser mayor a 0'),
}).refine(validarPorcentajes, {
  message: 'La suma de porcentajes debe ser 100%',
  path: ['porc1']
});

// Schema para Contrato por Hora
export const contratoHoraSchema = contratoBaseSchema.extend({
  tipo: z.literal('hora'),
  fecha_inicio_esc: z.string().min(1, 'Fecha de inicio escolar requerida'),
  fecha_termino_esc: z.string().min(1, 'Fecha de término escolar requerida'),
  fecha_contrato: z.string().min(1, 'Fecha de contrato requerida'),
  costo_hora: z.number().positive('El costo por hora debe ser mayor a 0'),
}).refine(validarPorcentajes, {
  message: 'La suma de porcentajes debe ser 100%',
  path: ['porc1']
}).refine((data) => {
  const inicio = new Date(data.fecha_inicio_esc);
  const fin = new Date(data.fecha_termino_esc);
  return fin > inicio;
}, {
  message: 'La fecha de término escolar debe ser posterior a la fecha de inicio',
  path: ['fecha_termino_esc']
});

// Schema para Login
export const loginSchema = z.object({
  username: z.string().min(1, 'Usuario requerido'),
  password: z.string().min(1, 'Contraseña requerida'),
});

// Schema para Usuario
export const usuarioSchema = z.object({
  usuario_username: z.string().min(3, 'Usuario debe tener al menos 3 caracteres'),
  usuario_password: z.string().min(6, 'Contraseña debe tener al menos 6 caracteres'),
  usuario_nombre: z.string().min(1, 'Nombre requerido'),
  usuario_app: z.string().optional(),
  usuario_apm: z.string().optional(),
  nivel: z.number().int().min(1).max(2).default(1),
});

// Exportar tipos inferidos
export type ContratoDeterminadoInput = z.infer<typeof contratoDeterminadoSchema>;
export type ContratoIndeterminadoInput = z.infer<typeof contratoIndeterminadoSchema>;
export type ContratoHoraInput = z.infer<typeof contratoHoraSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UsuarioInput = z.infer<typeof usuarioSchema>;
