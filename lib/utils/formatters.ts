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
 * Convierte una fecha a formato de texto legal (español)
 * Ejemplo: "2024-12-25" -> "25 DE DICIEMBRE DEL 2024"
 */
export function fechaATexto(fecha: string | Date): string {
  const meses = [
    'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
    'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
  ];
  
  const date = typeof fecha === 'string' ? new Date(fecha) : fecha;
  
  const dia = date.getDate();
  const mes = meses[date.getMonth()];
  const anio = date.getFullYear();
  
  return `${dia} DE ${mes} DEL ${anio}`;
}

/**
 * Convierte una fecha a formato de texto en minúsculas
 * Ejemplo: "2024-12-25" -> "25 de diciembre del 2024"
 */
export function fechaATextoMinusculas(fecha: string | Date): string {
  const meses = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  
  const date = typeof fecha === 'string' ? new Date(fecha) : fecha;
  
  const dia = date.getDate();
  const mes = meses[date.getMonth()];
  const anio = date.getFullYear();
  
  return `${dia} de ${mes} del ${anio}`;
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

/**
 * Convierte una lista de días separados por comas en un string legible
 * Ejemplo: "Lunes,Martes,Miércoles" -> "Lunes, Martes y Miércoles"
 */
export function formatearDias(dias: string): string {
  const diasArray = dias.split(',').map(d => d.trim());
  
  if (diasArray.length === 0) return '';
  if (diasArray.length === 1) return diasArray[0];
  if (diasArray.length === 2) return diasArray.join(' y ');
  
  const ultimoDia = diasArray.pop();
  return diasArray.join(', ') + ' y ' + ultimoDia;
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
