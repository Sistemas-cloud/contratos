/**
 * Generador de PDFs para contratos
 * Usa jsPDF para crear documentos PDF on-demand
 */

import jsPDF from "jspdf";
import {
  buildContratoDeterminadoTemplate,
  buildContratoHoraTemplate,
  buildContratoIndeterminadoTemplate,
  type ContractTemplate,
} from "./contrato-templates";

export interface ContratoData {
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
  
  // Horario
  dias: string;
  hora_entrada: string;
  hora_salida: string;
  
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
  
  // Específicos por tipo
  tipo: 'determinado' | 'indeterminado' | 'hora';
  fecha_contrato?: string;
  fecha_termino?: string;
  sueldo_mensual?: number;
  fecha_leido?: string;
  fecha_inicio?: string;
  salario?: number;
  fecha_inicio_esc?: string;
  fecha_termino_esc?: string;
  costo_hora?: number;
}

/**
 * Función helper para justificar texto manualmente en jsPDF
 * Similar a cómo FPDF hace la justificación usando word spacing
 */
const justifyText = (
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number
): void => {
  const trimmedText = text.trim();
  if (!trimmedText) return;

  const words = trimmedText.split(/\s+/);
  if (words.length === 0) return;

  // Si solo hay una palabra, dibujarla normalmente
  if (words.length === 1) {
    doc.text(words[0], x, y);
    return;
  }

  // Calcular el ancho de cada palabra y del espacio
  const wordWidths = words.map((word) => doc.getTextWidth(word));
  const spaceWidth = doc.getTextWidth(" ");
  const totalWordsWidth = wordWidths.reduce((sum, w) => sum + w, 0);
  const numberOfSpaces = words.length - 1;
  
  // Calcular el espacio total disponible para espacios
  const totalSpaceWidth = maxWidth - totalWordsWidth;
  
  // Calcular el espaciado entre palabras (distribuir el espacio disponible)
  const spaceBetweenWords = numberOfSpaces > 0 ? totalSpaceWidth / numberOfSpaces : 0;

  // Dibujar cada palabra con el espaciado calculado
  let currentX = x;
  words.forEach((word, index) => {
    doc.text(word, currentX, y);
    if (index < words.length - 1) {
      // Mover X al inicio de la siguiente palabra
      currentX += wordWidths[index] + spaceBetweenWords;
    }
  });
};

const renderTemplateToPdf = (template: ContractTemplate, filename: string) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let y = 20;

  doc.setFont("helvetica");
  doc.setFontSize(10);

  template.titleLines.forEach((title) => {
    doc.setFont("helvetica", "bold");
    doc.text(title, pageWidth / 2, y, { align: "center" });
    y += 6;
  });
  y += 4;

  doc.setFontSize(8);
  template.paragraphs.forEach((paragraph) => {
    const align = paragraph.align === "center" ? "center" : "left";
    doc.setFont("helvetica", paragraph.bold ? "bold" : "normal");
    const width = pageWidth - 2 * margin;
    
    // Detectar si es un elemento de lista (comienza con "-")
    const isListItem = paragraph.text.trim().startsWith("-");
    
    const lines = doc.splitTextToSize(paragraph.text, width);
    
    lines.forEach((line: string, index: number) => {
      if (y > pageHeight - 40) {
        doc.addPage();
        y = 20;
      }
      const isLastLine = index === lines.length - 1;
      // No justificar si es elemento de lista, está centrado, o es la última línea
      const shouldJustify = align !== "center" && !isListItem && !isLastLine && lines.length > 1;
      
      if (align === "center") {
        doc.text(line, pageWidth / 2, y, { align: "center" });
      } else if (shouldJustify) {
        // Justificar manualmente para líneas intermedias (excepto la última y elementos de lista)
        justifyText(doc, line.trim(), margin, y, width);
      } else {
        // Última línea, elementos de lista o alineación izquierda: dibujar normalmente
        doc.text(line.trim(), margin, y, { align: "left" });
      }
      y += 5;
    });
    y += 2;
  });

  if (y > pageHeight - 60) {
    doc.addPage();
    y = 20;
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("_______________________________________", margin, y);
  doc.text("_______________________________________", pageWidth - margin - 60, y);
  y += 6;
  doc.text(template.firmas.patronNombre, margin + 10, y);
  doc.text(template.firmas.trabajadorNombre, pageWidth - margin - 50, y);
  y += 6;
  doc.text(template.firmas.patronEntidad, margin + 10, y);
  doc.text(template.firmas.trabajadorCargo, pageWidth - margin - 50, y);
  y += 6;
  doc.text(template.firmas.patronCargo, margin + 10, y);

  y += 10;
  doc.text("_______________________________________", margin, y);
  doc.text("_______________________________________", pageWidth - margin - 60, y);
  y += 6;
  doc.text(template.testigos.testigo1, margin + 10, y);
  doc.text(template.testigos.testigo2, pageWidth - margin - 50, y);
  y += 6;
  doc.text("Testigo", margin + 20, y);
  doc.text("Testigo", pageWidth - margin - 40, y);

  doc.save(filename);
};

export function generarPDFContratoDeterminado(contrato: ContratoData): void {
  const template = buildContratoDeterminadoTemplate(contrato);
  renderTemplateToPdf(template, `contrato-${contrato.nombre.replace(/\s+/g, "-")}.pdf`);
}

export function generarPDFContratoIndeterminado(contrato: ContratoData): void {
  const template = buildContratoIndeterminadoTemplate(contrato);
  renderTemplateToPdf(template, `contrato-${contrato.nombre.replace(/\s+/g, "-")}.pdf`);
}

export function generarPDFContratoHora(contrato: ContratoData): void {
  const template = buildContratoHoraTemplate(contrato);
  renderTemplateToPdf(template, `contrato-${contrato.nombre.replace(/\s+/g, "-")}.pdf`);
}

export function generarPDF(contrato: ContratoData): void {
  if (contrato.tipo === 'determinado') {
    generarPDFContratoDeterminado(contrato);
  } else if (contrato.tipo === 'indeterminado') {
    generarPDFContratoIndeterminado(contrato);
  } else if (contrato.tipo === 'hora') {
    generarPDFContratoHora(contrato);
  }
}
