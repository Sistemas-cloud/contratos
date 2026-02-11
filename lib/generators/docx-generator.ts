/**
 * Generador de documentos Word para contratos
 * Usa docx para crear documentos .docx on-demand
 */

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
} from "docx";
import { saveAs } from "file-saver";
import type { ContratoData } from "./pdf-generator";
import {
  buildContratoDeterminadoTemplate,
  buildContratoHoraTemplate,
  buildContratoIndeterminadoTemplate,
  type ContractTemplate,
} from "./contrato-templates";

const crearParrafo = (texto: string, bold = false, align: typeof AlignmentType[keyof typeof AlignmentType] = AlignmentType.JUSTIFIED) => {
  const isListItem = texto.trim().startsWith("- "); // Detectar si es un elemento de lista
  const finalAlign = isListItem ? AlignmentType.LEFT : align; // Forzar LEFT para elementos de lista

  return new Paragraph({
    children: [
      new TextRun({
        text: texto,
        bold,
        font: "Arial",
        size: 18,
      }),
    ],
    alignment: finalAlign,
    spacing: { after: 120 },
  });
};

const renderTemplateToDocx = async (template: ContractTemplate, filename: string) => {
  const children: (Paragraph | Table)[] = [];

  template.titleLines.forEach((title) => {
    children.push(
      new Paragraph({
        text: title,
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    );
  });

  template.paragraphs.forEach((paragraph) => {
    // Detectar si es un elemento de lista (comienza con "-")
    const isListItem = paragraph.text.trim().startsWith("-");
    
    // Los elementos de lista y los centrados no se justifican
    let alignment: typeof AlignmentType[keyof typeof AlignmentType] = AlignmentType.JUSTIFIED;
    if (paragraph.align === "center") {
      alignment = AlignmentType.CENTER;
    } else if (isListItem) {
      alignment = AlignmentType.LEFT;
    }
    
    children.push(
      crearParrafo(
        paragraph.text,
        paragraph.bold,
        alignment
      )
    );
  });

  const lineStr = "_______________________________________";
  const celdaCentrada = (texto: string) =>
    new Paragraph({
      children: [new TextRun({ text: texto, font: "Arial", size: 18 })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
    });

  const sinBorde = {
    top: { style: BorderStyle.NONE, size: 0 },
    bottom: { style: BorderStyle.NONE, size: 0 },
    left: { style: BorderStyle.NONE, size: 0 },
    right: { style: BorderStyle.NONE, size: 0 },
  };

  children.push(new Paragraph({ text: "", spacing: { after: 400 } }));

  // Tabla de firmas: dos columnas centradas (Patrón | Trabajador y Testigos)
  const tablaFirmas = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: [50, 50],
    borders: {
      top: { style: BorderStyle.NONE, size: 0 },
      bottom: { style: BorderStyle.NONE, size: 0 },
      left: { style: BorderStyle.NONE, size: 0 },
      right: { style: BorderStyle.NONE, size: 0 },
      insideHorizontal: { style: BorderStyle.NONE, size: 0 },
      insideVertical: { style: BorderStyle.NONE, size: 0 },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [celdaCentrada(lineStr)],
            borders: sinBorde,
          }),
          new TableCell({
            children: [celdaCentrada(lineStr)],
            borders: sinBorde,
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [celdaCentrada(template.firmas.patronNombre)],
            borders: sinBorde,
          }),
          new TableCell({
            children: [celdaCentrada(template.firmas.trabajadorNombre)],
            borders: sinBorde,
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [celdaCentrada(template.firmas.patronEntidad)],
            borders: sinBorde,
          }),
          new TableCell({
            children: [celdaCentrada(template.firmas.trabajadorCargo)],
            borders: sinBorde,
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [celdaCentrada(template.firmas.patronCargo)],
            borders: sinBorde,
          }),
          new TableCell({ children: [new Paragraph({ text: "" })] }),
        ],
      }),
    ],
  });

  children.push(tablaFirmas);
  children.push(new Paragraph({ text: "", spacing: { after: 400 } }));

  const tablaTestigos = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: [50, 50],
    borders: {
      top: { style: BorderStyle.NONE, size: 0 },
      bottom: { style: BorderStyle.NONE, size: 0 },
      left: { style: BorderStyle.NONE, size: 0 },
      right: { style: BorderStyle.NONE, size: 0 },
      insideHorizontal: { style: BorderStyle.NONE, size: 0 },
      insideVertical: { style: BorderStyle.NONE, size: 0 },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [celdaCentrada(lineStr)],
            borders: sinBorde,
          }),
          new TableCell({
            children: [celdaCentrada(lineStr)],
            borders: sinBorde,
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [celdaCentrada(template.testigos.testigo1)],
            borders: sinBorde,
          }),
          new TableCell({
            children: [celdaCentrada(template.testigos.testigo2)],
            borders: sinBorde,
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [celdaCentrada("Testigo")],
            borders: sinBorde,
          }),
          new TableCell({
            children: [celdaCentrada("Testigo")],
            borders: sinBorde,
          }),
        ],
      }),
    ],
  });

  children.push(tablaTestigos);

  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
};

export async function generarDOCXContratoDeterminado(contrato: ContratoData): Promise<void> {
  const template = buildContratoDeterminadoTemplate(contrato);
  await renderTemplateToDocx(template, `contrato-${contrato.nombre.replace(/\s+/g, "-")}.docx`);
}

export async function generarDOCXContratoIndeterminado(contrato: ContratoData): Promise<void> {
  const template = buildContratoIndeterminadoTemplate(contrato);
  await renderTemplateToDocx(template, `contrato-${contrato.nombre.replace(/\s+/g, "-")}.docx`);
}

export async function generarDOCXContratoHora(contrato: ContratoData): Promise<void> {
  const template = buildContratoHoraTemplate(contrato);
  await renderTemplateToDocx(template, `contrato-${contrato.nombre.replace(/\s+/g, "-")}.docx`);
}

export async function generarDOCX(contrato: ContratoData): Promise<void> {
  if (contrato.tipo === "determinado") {
    await generarDOCXContratoDeterminado(contrato);
    return;
  }
  if (contrato.tipo === "indeterminado") {
    await generarDOCXContratoIndeterminado(contrato);
    return;
  }
  await generarDOCXContratoHora(contrato);
}
