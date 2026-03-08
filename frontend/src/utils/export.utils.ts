import jsPDF from 'jspdf';
import { jsPDF as jsPDFConstructor } from 'jspdf';
import 'jspdf-autotable';

interface ExportData {
  headers: string[];
  rows: (string | number | boolean | null | undefined)[][];
  title: string;
  filename: string;
}

/**
 * Exportar datos a CSV mejorado con formato y estructura
 */
export const exportToCSV = (data: ExportData) => {
  const { headers, rows, title, filename } = data;

  // Crear contenido CSV con título y estructura mejorada
  const csvContent = [
    [title], // Título
    [], // Línea vacía
    headers.join(','), // Encabezados
    ...rows.map(row => 
      row.map(cell => {
        // Escapar comillas y envolver en comillas si contiene comas
        const cellStr = String(cell ?? '');
        if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
          return `"${cellStr.replace(/"/g, '""')}"`;
        }
        return cellStr;
      }).join(',')
    )
  ].join('\n');

  // Crear blob y descargar
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Exportar datos a PDF con tabla formateada (sin autoTable)
 */
export const exportToPDF = (data: ExportData) => {
  const { headers, rows, title, filename } = data;
  
  console.log('📊 exportToPDF recibido:', { title, headersCount: headers.length, rowsCount: rows.length });
  
  const doc = new jsPDFConstructor('l'); // landscape
  
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 10 as number;
  let currentY = 18 as number;
  
  // Helper function to safely call doc.text
  const addText = (text: string, x: number, y: number, options?: any) => {
    doc.text(text as string, x as number, y as number, options);
  };
  
  // Agregar título
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(102, 126, 234);
  // @ts-expect-error - jsPDF type compatibility
  addText(title || '', margin, currentY);
  currentY += 10;
  
  // Agregar fecha
  doc.setFontSize(8);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(128, 128, 128);
  const fechaExportacion = new Date().toLocaleDateString('es-CO');
  // @ts-expect-error - jsPDF type compatibility
  addText(`Exportado: ${fechaExportacion}`, margin, currentY);
  currentY += 8;
  
  // Configurar tabla
  doc.setFontSize(8);
  const colCount = headers.length;
  const colWidth = (pageWidth - 2 * margin) / colCount;
  const rowHeight = 9; // Aumentado para mejor legibilidad
  const headerHeight = 9;
  
  // Función para ajustar texto a múltiples líneas
  const splitText = (text: string, maxWidth: number): string[] => {
    const words = String(text).split(' ');
    const lines: string[] = [];
    let currentLine = '';
    
    words.forEach(word => {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const testWidth = doc.getStringUnitWidth(testLine) * doc.getFontSize() / 1000;
      
      if (testWidth > maxWidth - 2) {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
    
    if (currentLine) lines.push(currentLine);
    return lines;
  };
  
  // Dibujar encabezados
  doc.setFillColor(102, 126, 234);
  doc.setTextColor(255, 255, 255);
  doc.setFont(undefined, 'bold');
  
  headers.forEach((header, colIndex) => {
    const x = margin + colIndex * colWidth;
    doc.rect(x, currentY, colWidth, headerHeight, 'F');
    doc.setDrawColor(255, 255, 255);
    doc.rect(x, currentY, colWidth, headerHeight);
    
    const headerLines = splitText(header, colWidth);
    headerLines.forEach((line, lineIndex) => {
      // @ts-expect-error - jsPDF type compatibility
      addText(line || '', x + 2, currentY + 4 + lineIndex * 3, { maxWidth: colWidth - 4, align: 'left' });
    });
  });
  
  currentY += headerHeight;
  
  // Dibujar filas
  doc.setTextColor(0, 0, 0);
  doc.setFont(undefined, 'normal');
  let rowColor = false;
  
  rows.forEach((row, rowIndex) => {
    // Calcular altura de la fila basada en el contenido
    let maxLines = 1;
    row.forEach(cell => {
      const lines = splitText(String(cell ?? '-'), colWidth);
      maxLines = Math.max(maxLines, lines.length);
    });
    const dynamicRowHeight = Math.max(rowHeight, maxLines * 3 + 3);
    
    // Verificar si necesita página nueva
    if (currentY + dynamicRowHeight > pageHeight - 12) {
      doc.addPage();
      currentY = 20;
    }
    
    // Color alternado
    if (rowColor) {
      doc.setFillColor(245, 247, 250);
      doc.rect(margin, currentY, pageWidth - 2 * margin, dynamicRowHeight, 'F');
    }
    
    // Dibujar borde
    doc.setDrawColor(200, 200, 200);
    doc.rect(margin, currentY, pageWidth - 2 * margin, dynamicRowHeight);
    
    // Dibujar divisiones de columnas
    for (let i = 1; i < colCount; i++) {
      const x = margin + i * colWidth;
      doc.line(x, currentY, x, currentY + dynamicRowHeight);
    }
    
    // Dibujar celdas
    row.forEach((cell, colIndex) => {
      const x = margin + colIndex * colWidth;
      const cellText = String(cell ?? '-');
      const cellLines = splitText(cellText, colWidth);
      
      cellLines.forEach((line, lineIndex) => {
        // @ts-expect-error - jsPDF type compatibility
        addText(line || '', x + 2, currentY + 5 + lineIndex * 3, { 
          maxWidth: colWidth - 4,
          align: 'left'
        });
      });
    });
    
    currentY += dynamicRowHeight;
    rowColor = !rowColor;
  });
  
  // Agregar pie de página
  doc.setFontSize(7);
  doc.setTextColor(128, 128, 128);
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    // @ts-expect-error - jsPDF type compatibility
    addText(
      `Página ${i} de ${pageCount}`,
      pageWidth / 2,
      pageHeight - 7,
      { align: 'center' }
    );
  }
  
  console.log('✅ PDF creado correctamente');
  doc.save(`${filename}-${new Date().toISOString().split('T')[0]}.pdf`);
};

/**
 * Exportar con ambos formatos
 */
export const exportData = {
  csv: exportToCSV,
  pdf: exportToPDF
};
