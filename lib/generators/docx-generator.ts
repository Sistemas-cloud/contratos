/**
 * Generador de documentos Word para contratos
 * Usa docx para crear documentos .docx on-demand
 */

import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from "docx";
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
  const paragraphs: Paragraph[] = [];

  template.titleLines.forEach((title) => {
    paragraphs.push(
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
    
    paragraphs.push(
      crearParrafo(
        paragraph.text,
        paragraph.bold,
        alignment
      )
    );
  });

  paragraphs.push(new Paragraph({ text: "", spacing: { after: 400 } }));
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({ text: "_______________________________________" }),
        new TextRun({ text: "\t\t\t\t" }),
        new TextRun({ text: "_______________________________________" }),
      ],
    })
  );
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({ text: template.firmas.patronNombre }),
        new TextRun({ text: "\t\t\t\t" }),
        new TextRun({ text: template.firmas.trabajadorNombre }),
      ],
    })
  );
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({ text: template.firmas.patronEntidad }),
        new TextRun({ text: "\t\t\t\t" }),
        new TextRun({ text: template.firmas.trabajadorCargo }),
      ],
    })
  );
  paragraphs.push(new Paragraph({ text: template.firmas.patronCargo }));

  paragraphs.push(new Paragraph({ text: "", spacing: { after: 400 } }));
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({ text: "_______________________________________" }),
        new TextRun({ text: "\t\t\t\t" }),
        new TextRun({ text: "_______________________________________" }),
      ],
    })
  );
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({ text: template.testigos.testigo1 }),
        new TextRun({ text: "\t\t\t\t" }),
        new TextRun({ text: template.testigos.testigo2 }),
      ],
    })
  );
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Testigo" }),
        new TextRun({ text: "\t\t\t\t" }),
        new TextRun({ text: "Testigo" }),
      ],
    })
  );

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs,
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
