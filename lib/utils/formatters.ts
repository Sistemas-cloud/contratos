/**
 * Funciones de formateo - Migradas desde PHP
 * Conversión de números a texto, fechas a texto, etc.
 */

/**
 * Convierte un número a su representación en texto (español)
 * Migrado de la función PHP numeroATexto()
 */
export function numeroATexto(numero: number): string {
  // Eliminar decimales y convertir a entero
  numero = Math.floor(numero);

  const unidad = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
  const decena = ['', 'diez', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
  const especiales: Record<number, string> = {
    10: 'diez',
    11: 'once',
    12: 'doce',
    13: 'trece',
    14: 'catorce',
    15: 'quince',
    16: 'dieciséis',
    17: 'diecisiete',
    18: 'dieciocho',
    19: 'diecinueve'
  };

  if (numero === 0) {
    return 'cero';
  } else if (numero < 10) {
    return unidad[numero];
  } else if (numero < 20) {
    return especiales[numero];
  } else if (numero < 100) {
    const dec = Math.floor(numero / 10);
    const unid = numero % 10;
    if (unid === 0) {
      return decena[dec];
    } else {
      return decena[dec] + ' y ' + unidad[unid];
    }
  } else if (numero < 1000) {
    const cent = Math.floor(numero / 100);
    const resto = numero % 100;
    let prefijo: string;
    
    if (cent === 1) {
      prefijo = resto === 0 ? 'cien' : 'ciento';
    } else if (cent === 5) {
      prefijo = 'quinientos';
    } else if (cent === 7) {
      prefijo = 'setecientos';
    } else if (cent === 9) {
      prefijo = 'novecientos';
    } else {
      prefijo = unidad[cent] + 'cientos';
    }
    
    return resto === 0 ? prefijo : prefijo + ' ' + numeroATexto(resto);
  } else if (numero < 1000000) {
    const mil = Math.floor(numero / 1000);
    const resto = numero % 1000;
    const prefijo = mil === 1 ? 'mil' : numeroATexto(mil) + ' mil';
    return resto === 0 ? prefijo : prefijo + ' ' + numeroATexto(resto);
  }
  
  return 'Número demasiado grande';
}

/**
 * Convierte un número a texto en formato de pesos mexicanos
 * Ejemplo: 1250.50 -> "mil doscientos cincuenta pesos 50/100 M.N."
 */
export function numeroATextoPesos(numero: number): string {
  const entero = Math.floor(numero);
  const decimales = Math.round((numero - entero) * 100);
  
  const textoEntero = numeroATexto(entero);
  const textoDecimales = decimales.toString().padStart(2, '0');
  
  return `${textoEntero} pesos ${textoDecimales}/100 M.N.`;
}

/**
 * Parsea una fecha string (YYYY-MM-DD o ISO) como fecha local para evitar desfase por UTC.
 * Devuelve Date a medianoche local; si el string no es válido, devuelve Invalid Date.
 */
function parseFechaLocal(fecha: string): Date {
  const part = String(fecha).split("T")[0];
  const parts = part.split("-").map(Number);
  if (parts.length !== 3 || parts.some((n) => isNaN(n))) return new Date(NaN);
  const [y, m, d] = parts;
  return new Date(y, m - 1, d);
}

/**
 * Convierte una fecha a formato de texto legal (español).
 * Usa la fecha como local para evitar que medianoche UTC se muestre como el día anterior.
 * Ejemplo: "2024-12-25" -> "25 DE DICIEMBRE DEL 2024"
 */
export function fechaATexto(fecha: string | Date): string {
  const meses = [
    'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
    'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
  ];
  const date = typeof fecha === 'string' ? parseFechaLocal(fecha) : fecha;
  if (isNaN(date.getTime())) return typeof fecha === 'string' ? fecha : '';
  const dia = date.getDate();
  const mes = meses[date.getMonth()];
  const anio = date.getFullYear();
  return `${dia} DE ${mes} DEL ${anio}`;
}

/**
 * Convierte una fecha a formato de texto en minúsculas.
 * Usa la fecha como local para evitar desfase por zona horaria.
 * Ejemplo: "2024-12-25" -> "25 de diciembre del 2024"
 */
export function fechaATextoMinusculas(fecha: string | Date): string {
  const meses = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  const date = typeof fecha === 'string' ? parseFechaLocal(fecha) : fecha;
  if (isNaN(date.getTime())) return typeof fecha === 'string' ? fecha : '';
  const dia = date.getDate();
  const mes = meses[date.getMonth()];
  const anio = date.getFullYear();
  return `${dia} de ${mes} del ${anio}`;
}

/**
 * Formatea una fecha guardada como YYYY-MM-DD (sin hora) para mostrar en es-MX.
 * Usa la fecha como local para evitar que medianoche UTC se muestre como el día anterior.
 * Ejemplo: "2026-01-15" -> "15/1/2026" (no 14/1/2026 por zona horaria)
 */
export function formatearFechaLocal(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  const part = String(dateStr).split("T")[0];
  const parts = part.split("-").map(Number);
  if (parts.length !== 3 || parts.some((n) => isNaN(n))) return String(dateStr);
  const [y, m, d] = parts;
  return new Date(y, m - 1, d).toLocaleDateString("es-MX");
}

/**
 * Formatea un número como moneda mexicana
 * Ejemplo: 1250.5 -> "$1,250.50"
 */
export function formatearPesos(numero: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(numero);
}

/**
 * Formatea una hora de 24hrs a 12hrs con AM/PM
 * Ejemplo: "14:30" -> "2:30 PM"
 */
export function formatearHora12(hora: string): string {
  const [horas, minutos] = hora.split(':').map(Number);
  const periodo = horas >= 12 ? 'PM' : 'AM';
  const horas12 = horas % 12 || 12;
  return `${horas12}:${minutos.toString().padStart(2, '0')} ${periodo}`;
}

/**
 * Crea un rango de horario formateado
 * Ejemplo: ("09:00", "17:00") -> "9:00 AM - 5:00 PM"
 */
export function crearRangoHorario(horaInicio: string, horaFin: string): string {
  return `${formatearHora12(horaInicio)} - ${formatearHora12(horaFin)}`;
}

/** Orden de días de la semana para ordenar correctamente (lunes a domingo) */
const ORDEN_DIAS_SEMANA = [
  'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'
] as const;

/**
 * Ordena un array de días según el orden de la semana (lunes a sábado/domingo)
 */
export function ordenarDiasSemana(dias: string[]): string[] {
  return [...dias].sort((a, b) => {
    const idxA = ORDEN_DIAS_SEMANA.findIndex(d => 
      d.toLowerCase() === (a || '').trim().toLowerCase()
    );
    const idxB = ORDEN_DIAS_SEMANA.findIndex(d => 
      d.toLowerCase() === (b || '').trim().toLowerCase()
    );
    const posA = idxA >= 0 ? idxA : 999;
    const posB = idxB >= 0 ? idxB : 999;
    return posA - posB;
  });
}

/** Días de lunes a sábado (sin domingo) */
const LUNES_A_SABADO = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'] as const;

/**
 * Convierte una lista de días separados por comas en un string legible,
 * ordenados de lunes a sábado (igual que los demás contratos)
 * Si están todos los días de lunes a sábado, muestra "lunes a sábado"
 * Ejemplo: "Jueves,Lunes,Martes,Miércoles,Viernes,Sábado" -> "lunes a sábado"
 */
export function formatearDias(dias: string): string {
  const diasArray = dias.split(',').map(d => d.trim()).filter(Boolean);
  const ordenados = ordenarDiasSemana(diasArray);

  // Si están todos los días de lunes a sábado, mostrar "lunes a sábado"
  const normalized = ordenados.map(d => d.toLowerCase());
  const todosLunesSabado = LUNES_A_SABADO.length === ordenados.length &&
    LUNES_A_SABADO.every(d => normalized.includes(d.toLowerCase()));
  if (todosLunesSabado) return 'lunes a sábado';

  if (ordenados.length === 0) return '';
  if (ordenados.length === 1) return ordenados[0];
  if (ordenados.length === 2) return ordenados.join(' y ');

  const ultimoDia = ordenados.pop();
  return ordenados.join(', ') + ' y ' + ultimoDia;
}

/**
 * Valida formato de RFC mexicano
 */
export function validarRFC(rfc: string): boolean {
  const rfcPattern = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/;
  return rfcPattern.test(rfc.toUpperCase());
}

/**
 * Valida formato de CURP mexicano
 */
export function validarCURP(curp: string): boolean {
  const curpPattern = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/;
  return curpPattern.test(curp.toUpperCase());
}

/**
 * Capitaliza la primera letra de cada palabra
 */
export function capitalizarPalabras(texto: string): string {
  return texto
    .toLowerCase()
    .split(' ')
    .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(' ');
}
