"""
Script para generar PDF del Manual Técnico de Software
Convierte MANUAL_TECNICO_SOFTWARE.md a PDF profesional
"""

import os
import sys
from pathlib import Path
from reportlab.lib.pagesizes import A4, letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle, Preformatted
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib import colors
from reportlab.pdfgen import canvas
import re
from datetime import datetime

# Rutas
BASE_DIR = Path(__file__).parent
MARKDOWN_FILE = BASE_DIR / 'MANUAL_TECNICO_SOFTWARE.md'
PDF_FILE = BASE_DIR / 'MANUAL_TECNICO_SOFTWARE.pdf'

class NumberedCanvas(canvas.Canvas):
    """Canvas personalizado con números de página y encabezado"""
    
    def __init__(self, *args, **kwargs):
        canvas.Canvas.__init__(self, *args, **kwargs)
        self.pages = []
        
    def showPage(self):
        self.pages.append(dict(self.__dict__))
        self._startPage()
        
    def save(self):
        page_count = len(self.pages)
        for page_num, page in enumerate(self.pages, start=1):
            self.__dict__.update(page)
            self.draw_page_number(page_num, page_count)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)
        
    def draw_page_number(self, page_num, page_count):
        """Dibuja número de página y encabezado"""
        self.saveState()
        
        # Encabezado (excepto primera página)
        if page_num > 1:
            self.setFont('Helvetica', 9)
            self.setFillColor(colors.HexColor('#666666'))
            self.drawString(30*mm, 280*mm, "Manual Técnico de Software - Sistema E-Commerce de Inventario")
            self.line(30*mm, 278*mm, 180*mm, 278*mm)
        
        # Pie de página
        self.setFont('Helvetica', 9)
        self.setFillColor(colors.HexColor('#666666'))
        self.drawCentredString(105*mm, 15*mm, f"Página {page_num} de {page_count}")
        self.drawString(30*mm, 15*mm, f"Versión 1.0.0 - {datetime.now().strftime('%d/%m/%Y')}")
        
        self.restoreState()

def crear_estilos():
    """Crea estilos personalizados para el PDF"""
    styles = getSampleStyleSheet()
    
    # Estilo para portada - Título principal
    styles.add(ParagraphStyle(
        name='PortadaTitulo',
        parent=styles['Heading1'],
        fontSize=32,
        textColor=colors.HexColor('#1a365d'),
        spaceAfter=20,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold',
        leading=38
    ))
    
    # Estilo para portada - Subtítulo
    styles.add(ParagraphStyle(
        name='PortadaSubtitulo',
        parent=styles['Heading2'],
        fontSize=18,
        textColor=colors.HexColor('#2d3748'),
        spaceAfter=30,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    ))
    
    # Estilo para info de portada
    styles.add(ParagraphStyle(
        name='PortadaInfo',
        parent=styles['Normal'],
        fontSize=12,
        textColor=colors.HexColor('#4a5568'),
        alignment=TA_CENTER,
        spaceAfter=8
    ))
    
    # Capítulo (H1 con #)
    styles.add(ParagraphStyle(
        name='Capitulo',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#1a365d'),
        spaceAfter=16,
        spaceBefore=20,
        fontName='Helvetica-Bold',
        leading=28,
        keepWithNext=True
    ))
    
    # Sección (H2 con ##)
    styles.add(ParagraphStyle(
        name='Seccion',
        parent=styles['Heading2'],
        fontSize=18,
        textColor=colors.HexColor('#2c5282'),
        spaceAfter=12,
        spaceBefore=16,
        fontName='Helvetica-Bold',
        leading=22,
        keepWithNext=True
    ))
    
    # Subsección (H3 con ###)
    styles.add(ParagraphStyle(
        name='Subseccion',
        parent=styles['Heading3'],
        fontSize=14,
        textColor=colors.HexColor('#2d3748'),
        spaceAfter=10,
        spaceBefore=12,
        fontName='Helvetica-Bold',
        leading=18,
        keepWithNext=True
    ))
    
    # H4 (usar nombre custom para evitar conflicto)
    styles.add(ParagraphStyle(
        name='Heading4Custom',
        parent=styles['Heading3'],
        fontSize=12,
        textColor=colors.HexColor('#4a5568'),
        spaceAfter=8,
        spaceBefore=10,
        fontName='Helvetica-Bold',
        keepWithNext=True
    ))
    
    # Texto normal
    styles.add(ParagraphStyle(
        name='BodyCustom',
        parent=styles['BodyText'],
        fontSize=10,
        textColor=colors.HexColor('#2d3748'),
        alignment=TA_JUSTIFY,
        spaceAfter=8,
        leading=14
    ))
    
    # Código inline
    styles.add(ParagraphStyle(
        name='CodigoInline',
        parent=styles['Code'],
        fontSize=9,
        textColor=colors.HexColor('#c53030'),
        fontName='Courier',
        backColor=colors.HexColor('#f7fafc')
    ))
    
    # Bloque de código
    styles.add(ParagraphStyle(
        name='CodigoBloque',
        parent=styles['Code'],
        fontSize=8,
        fontName='Courier',
        textColor=colors.HexColor('#2d3748'),
        backColor=colors.HexColor('#f7fafc'),
        leftIndent=20,
        rightIndent=20,
        spaceAfter=12,
        spaceBefore=8,
        leading=10
    ))
    
    # Lista
    styles.add(ParagraphStyle(
        name='ListaItem',
        parent=styles['BodyText'],
        fontSize=10,
        leftIndent=20,
        spaceAfter=4,
        bulletIndent=10,
        leading=14
    ))
    
    # Cita
    styles.add(ParagraphStyle(
        name='Blockquote',
        parent=styles['BodyText'],
        fontSize=10,
        textColor=colors.HexColor('#4a5568'),
        leftIndent=30,
        rightIndent=30,
        spaceAfter=12,
        spaceBefore=8,
        borderColor=colors.HexColor('#3182ce'),
        borderWidth=2,
        borderPadding=10,
        backColor=colors.HexColor('#ebf8ff')
    ))
    
    return styles

def procesar_markdown(contenido, styles):
    """Convierte Markdown a elementos de ReportLab"""
    elements = []
    lineas = contenido.split('\n')
    
    en_codigo = False
    bloque_codigo = []
    codigo_lenguaje = ''
    en_tabla = False
    filas_tabla = []
    
    i = 0
    while i < len(lineas):
        linea = lineas[i]
        
        # Bloque de código
        if linea.strip().startswith('```'):
            if not en_codigo:
                en_codigo = True
                codigo_lenguaje = linea.strip()[3:]
                bloque_codigo = []
            else:
                en_codigo = False
                if bloque_codigo:
                    codigo_texto = '\n'.join(bloque_codigo)
                    elements.append(Preformatted(codigo_texto, styles['CodigoBloque']))
                bloque_codigo = []
            i += 1
            continue
        
        if en_codigo:
            bloque_codigo.append(linea)
            i += 1
            continue
        
        # Saltar líneas vacías múltiples
        if not linea.strip():
            if elements and not isinstance(elements[-1], Spacer):
                elements.append(Spacer(1, 6))
            i += 1
            continue
        
        # Separador horizontal
        if linea.strip() == '---':
            elements.append(Spacer(1, 12))
            i += 1
            continue
        
        # Encabezados
        if linea.startswith('#'):
            nivel = len(linea) - len(linea.lstrip('#'))
            texto = linea.lstrip('#').strip()
            
            # Eliminar enlaces de ancla
            texto = re.sub(r'\{#[^}]+\}', '', texto)
            
            if nivel == 1:
                if 'CAPÍTULO' in texto.upper():
                    elements.append(PageBreak())
                elements.append(Paragraph(texto, styles['Capitulo']))
            elif nivel == 2:
                elements.append(Paragraph(texto, styles['Seccion']))
            elif nivel == 3:
                elements.append(Paragraph(texto, styles['Subseccion']))
            else:
                elements.append(Paragraph(texto, styles['Heading4Custom']))
            i += 1
            continue
        
        # Tabla Markdown
        if '|' in linea and not linea.strip().startswith('<!--'):
            if not en_tabla:
                en_tabla = True
                filas_tabla = []
            
            # Procesar fila de tabla
            celdas = [c.strip() for c in linea.split('|')]
            celdas = [c for c in celdas if c]  # Eliminar vacíos
            
            # Si es separador de encabezado (---)
            if all(set(c.replace('-', '').replace(':', '')) == set() for c in celdas):
                i += 1
                continue
                
            filas_tabla.append(celdas)
            i += 1
            continue
        elif en_tabla:
            # Fin de tabla
            en_tabla = False
            if filas_tabla:
                tabla = Table(filas_tabla)
                tabla.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#4299e1')),
                    ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                    ('FONTSIZE', (0, 0), (-1, 0), 10),
                    ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
                    ('TOPPADDING', (0, 0), (-1, 0), 8),
                    ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f7fafc')),
                    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e0')),
                    ('FONTSIZE', (0, 1), (-1, -1), 9),
                    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f7fafc')])
                ]))
                elements.append(tabla)
                elements.append(Spacer(1, 12))
                filas_tabla = []
        
        # Lista con viñetas
        if linea.strip().startswith('- ') or linea.strip().startswith('* '):
            texto = linea.strip()[2:]
            texto = procesar_inline_markdown(texto)
            elements.append(Paragraph(f"• {texto}", styles['ListaItem']))
            i += 1
            continue
        
        # Lista numerada
        if re.match(r'^\d+\.\s', linea.strip()):
            texto = re.sub(r'^\d+\.\s', '', linea.strip())
            numero = re.match(r'^(\d+)\.', linea.strip()).group(1)
            texto = procesar_inline_markdown(texto)
            elements.append(Paragraph(f"{numero}. {texto}", styles['ListaItem']))
            i += 1
            continue
        
        # Blockquote
        if linea.strip().startswith('>'):
            texto = linea.strip()[1:].strip()
            texto = procesar_inline_markdown(texto)
            elements.append(Paragraph(texto, styles['Blockquote']))
            i += 1
            continue
        
        # Texto normal
        texto = procesar_inline_markdown(linea.strip())
        if texto:
            elements.append(Paragraph(texto, styles['BodyCustom']))
        
        i += 1
    
    return elements

def procesar_inline_markdown(texto):
    """Procesa marcado inline (negritas, cursivas, código, etc.)"""
    
    # Primero escapar & para evitar problemas
    texto = texto.replace('&', '&amp;')
    
    # 1. Enlaces (primero, para evitar conflicts con _ en URLs)
    texto = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'<u>\1</u>', texto)
    
    # 2. Código inline (proteger antes de escapar < >)
    def reemplazar_codigo(match):
        codigo = match.group(1)
        return f'<font name="Courier" color="#c53030">{codigo}</font>'
    
    texto = re.sub(r'`([^`]+)`', reemplazar_codigo, texto)
    
    # 3. Negritas (** o __)
    texto = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', texto)
    texto = re.sub(r'__(.+?)__', r'<b>\1</b>', texto)
    
    # 4. Cursivas (* o _) - más restrictivo para evitar falsos positivos
    # Solo si está rodeado de espacios o principio/fin de línea
    texto = re.sub(r'(?:^|(?<=\s))\*([^\*]+?)\*(?=\s|$)', r'<i>\1</i>', texto)
    texto = re.sub(r'(?:^|(?<=\s))_([^_]+?)_(?=\s|$)', r'<i>\1</i>', texto)
    
    # 5. Ahora proteger nuestras tags antes de escapar
    tags_protegidas = []
    
    def proteger_tag(match):
        tags_protegidas.append(match.group(0))
        return f"___TAG_{len(tags_protegidas)-1}___"
    
    texto = re.sub(r'<font[^>]*>|</font>|<b>|</b>|<i>|</i>|<u>|</u>', proteger_tag, texto)
    
    # 6. Escapar < > restantes
    texto = texto.replace('<', '&lt;').replace('>', '&gt;')
    
    # 7. Restaurar tags protegidas
    for i, tag in enumerate(tags_protegidas):
        texto = texto.replace(f"___TAG_{i}___", tag)
    
    # 8. Emojis comunes (convertir a texto)
    emoji_map = {
        '✅': '[OK]',
        '❌': '[X]',
        '⚠️': '[!]',
        '📘': '[DOC]',
        '🔒': '[LOCK]',
        '📊': '[CHART]',
        '🎯': '[TARGET]',
        '💡': '[IDEA]',
        '🔧': '[TOOL]',
        '📦': '[BOX]',
        '🛍️': '[SHOP]',
        '🛒': '[CART]',
        '👨‍💻': '[DEV]',
        '👩‍💻': '[DEV]',
        '🔐': '[SECURE]',
        '📈': '[UP]',
        '🆕': '[NEW]',
        '📞': '[PHONE]',
        '📧': '[EMAIL]',
        '💬': '[CHAT]',
        '🐛': '[BUG]',
        '🆘': '[SOS]',
        '📝': '[NOTE]',
        '📖': '[BOOK]',
        '🔍': '[SEARCH]',
        '🚀': '[ROCKET]',
        '⚡': '[FAST]',
        '🔄': '[SYNC]',
        '📋': '[LIST]',
        '🎨': '[ART]',
        '👥': '[USERS]',
        '👔': '[ADMIN]',
    }
    for emoji, reemplazo in emoji_map.items():
        texto = texto.replace(emoji, reemplazo)
    
    return texto

def crear_portada(styles):
    """Crea la portada del documento"""
    elements = []
    
    elements.append(Spacer(1, 1.5*inch))
    
    # Título principal
    elements.append(Paragraph("📘 MANUAL TÉCNICO DE SOFTWARE", styles['PortadaTitulo']))
    elements.append(Spacer(1, 0.3*inch))
    
    # Subtítulo
    elements.append(Paragraph(
        "Sistema E-Commerce con Gestión Integral de Inventario",
        styles['PortadaSubtitulo']
    ))
    elements.append(Spacer(1, 1*inch))
    
    # Información
    elements.append(Paragraph("<b>Versión del Sistema:</b> 1.0.0", styles['PortadaInfo']))
    elements.append(Paragraph("<b>Versión del Manual:</b> 1.0.0", styles['PortadaInfo']))
    elements.append(Paragraph(f"<b>Fecha de Publicación:</b> {datetime.now().strftime('%d de %B de %Y')}", styles['PortadaInfo']))
    elements.append(Paragraph("<b>Estado:</b> Producción", styles['PortadaInfo']))
    elements.append(Spacer(1, 0.5*inch))
    
    # Tecnologías
    elements.append(Paragraph("<b>Tecnologías:</b>", styles['PortadaInfo']))
    elements.append(Paragraph("NestJS • PostgreSQL • React • Prisma ORM • Docker", styles['PortadaInfo']))
    elements.append(Spacer(1, 1*inch))
    
    # Footer
    elements.append(Paragraph("Inventory Team", styles['PortadaInfo']))
    elements.append(Paragraph("Todos los derechos reservados - MIT License", styles['PortadaInfo']))
    
    elements.append(PageBreak())
    
    return elements

def generar_pdf():
    """Función principal para generar el PDF"""
    
    print("🔄 Generando PDF del Manual Técnico...")
    print(f"📄 Archivo fuente: {MARKDOWN_FILE}")
    
    # Verificar que existe el archivo
    if not MARKDOWN_FILE.exists():
        print(f"❌ Error: No se encontró el archivo {MARKDOWN_FILE}")
        return False
    
    # Leer contenido
    with open(MARKDOWN_FILE, 'r', encoding='utf-8') as f:
        contenido = f.read()
    
    print(f"📖 Contenido leído: {len(contenido)} caracteres")
    
    # Crear documento
    doc = SimpleDocTemplate(
        str(PDF_FILE),
        pagesize=A4,
        topMargin=25*mm,
        bottomMargin=25*mm,
        leftMargin=25*mm,
        rightMargin=25*mm
    )
    
    # Crear estilos
    styles = crear_estilos()
    
    # Crear elementos
    elements = []
    
    # Portada
    elements.extend(crear_portada(styles))
    
    # Contenido del manual
    print("🔄 Procesando contenido Markdown...")
    contenido_elements = procesar_markdown(contenido, styles)
    elements.extend(contenido_elements)
    
    print(f"✅ Procesados {len(elements)} elementos")
    
    # Generar PDF
    print("🔄 Generando PDF...")
    doc.build(elements, canvasmaker=NumberedCanvas)
    
    print(f"✅ PDF generado exitosamente: {PDF_FILE}")
    print(f"📊 Tamaño: {PDF_FILE.stat().st_size / 1024:.2f} KB")
    
    return True

if __name__ == '__main__':
    try:
        exito = generar_pdf()
        if exito:
            print("\n✅ ¡Proceso completado con éxito!")
            sys.exit(0)
        else:
            print("\n❌ Error en la generación del PDF")
            sys.exit(1)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
