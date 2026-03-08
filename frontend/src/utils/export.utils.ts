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
  const docAny = doc as any; // Cast to any to avoid jsPDF type incompatibilities
  
  const pageHeight = docAny.internal.pageSize.getHeight();
  const pageWidth = docAny.internal.pageSize.getWidth();
  const margin = 10;
  let currentY = 18;
  
  // Agregar título
  docAny.setFontSize(14);
  docAny.setFont(undefined, 'bold');
  docAny.setTextColor(102, 126, 234);
  docAny.text(title || '', margin, currentY);
  currentY += 10;
  
  // Agregar fecha
  docAny.setFontSize(8);
  docAny.setFont(undefined, 'normal');
  docAny.setTextColor(128, 128, 128);
  const fechaExportacion = new Date().toLocaleDateString('es-CO');
  docAny.text(`Exportado: ${fechaExportacion}`, margin, currentY);
  currentY += 8;
  
  // Configurar tabla
  docAny.setFontSize(8);
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
      const testWidth = docAny.getStringUnitWidth(testLine) * docAny.getFontSize() / 1000;
      
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
  docAny.setFillColor(102, 126, 234);
  docAny.setTextColor(255, 255, 255);
  docAny.setFont(undefined, 'bold');
  
  headers.forEach((header, colIndex) => {
    const x = margin + colIndex * colWidth;
    docAny.rect(x, currentY, colWidth, headerHeight, 'F');
    docAny.setDrawColor(255, 255, 255);
    docAny.rect(x, currentY, colWidth, headerHeight);
    
    const headerLines = splitText(header, colWidth);
    headerLines.forEach((line, lineIndex) => {
      docAny.text(line || '', x + 2, currentY + 4 + lineIndex * 3, { maxWidth: colWidth - 4, align: 'left' });
    });
  });
  
  currentY += headerHeight;
  
  // Dibujar filas
  docAny.setTextColor(0, 0, 0);
  docAny.setFont(undefined, 'normal');
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
      docAny.addPage();
      currentY = 20;
    }
    
    // Color alternado
    if (rowColor) {
      docAny.setFillColor(245, 247, 250);
      docAny.rect(margin, currentY, pageWidth - 2 * margin, dynamicRowHeight, 'F');
    }
    
    // Dibujar borde
    docAny.setDrawColor(200, 200, 200);
    docAny.rect(margin, currentY, pageWidth - 2 * margin, dynamicRowHeight);
    
    // Dibujar divisiones de columnas
    for (let i = 1; i < colCount; i++) {
      const x = margin + i * colWidth;
      docAny.line(x, currentY, x, currentY + dynamicRowHeight);
    }
    
    // Dibujar celdas
    row.forEach((cell, colIndex) => {
      const x = margin + colIndex * colWidth;
      const cellText = String(cell ?? '-');
      const cellLines = splitText(cellText, colWidth);
      
      cellLines.forEach((line, lineIndex) => {
        docAny.text(line || '', x + 2, currentY + 5 + lineIndex * 3, { 
          maxWidth: colWidth - 4,
          align: 'left'
        });
      });
    });
    
    currentY += dynamicRowHeight;
    rowColor = !rowColor;
  });
  
  // Agregar pie de página
  docAny.setFontSize(7);
  docAny.setTextColor(128, 128, 128);
  const pageCount = docAny.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    docAny.setPage(i);
    docAny.text(
      `Página ${i} de ${pageCount}`,
      pageWidth / 2,
      pageHeight - 7,
      { align: 'center' }
    );
  }
  
  console.log('✅ PDF creado correctamente');
  docAny.save(`${filename}-${new Date().toISOString().split('T')[0]}.pdf`);
};

/**
 * Exportar con ambos formatos
 */
export const exportData = {
  csv: exportToCSV,
  pdf: exportToPDF
};
