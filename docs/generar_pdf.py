#!/usr/bin/env python3
"""
Convertidor de ARCHITECTURE.md a PDF con buen formato
Soporta múltiples métodos: fpdf2, pandoc, weasyprint, o HTML para navegador
"""

import subprocess
import os
import sys
import re

def convert_with_pandoc():
    """Intenta convertir usando pandoc"""
    try:
        subprocess.run([
            'pandoc',
            'ARCHITECTURE.md',
            '-o', 'ARCHITECTURE.pdf',
            '--from=markdown',
            '--to=pdf',
            '--table-of-contents',
            '--toc-depth=2',
            '-V', 'mainfont=Calibri',
            '-V', 'fontsize=11pt',
            '-V', 'geometry:margin=1in',
            '-V', 'linestretch=1.5',
            '-V', 'colorlinks=true',
            '-V', 'urlcolor=blue'
        ], check=True, capture_output=True, text=True)
        
        print("✅ PDF generado exitosamente con Pandoc: ARCHITECTURE.pdf")
        return True
    except FileNotFoundError:
        return False
    except subprocess.CalledProcessError as e:
        print(f"❌ Error con Pandoc: {e.stderr}")
        return False

def convert_with_weasyprint():
    """Intenta convertir usando WeasyPrint"""
    try:
        import markdown2
        from weasyprint import HTML, CSS
        
        with open('ARCHITECTURE.md', 'r', encoding='utf-8') as f:
            md_content = f.read()
        
        # Convertir markdown a HTML
        html_content = markdown2.markdown(
            md_content,
            extras=['tables', 'fenced-code-blocks', 'codehilite']
        )
        
        # HTML con CSS para PDF
        html_template = f"""
<!DOCTYPE html>
<html dir="ltr" lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>StoreHub - Arquitectura del Proyecto</title>
    <style>
        @page {{
            size: A4;
            margin: 1.5cm;
            @bottom-center {{
                content: "Página " counter(page) " de " counter(pages);
                font-size: 10pt;
                color: #666;
            }}
        }}
        
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        body {{
            font-family: 'Calibri', 'Segoe UI', serif;
            font-size: 11pt;
            line-height: 1.6;
            color: #333;
            background: white;
            padding: 0;
        }}
        
        h1 {{
            font-size: 28pt;
            color: #003d99;
            margin: 30pt 0 15pt 0;
            padding-bottom: 12pt;
            border-bottom: 3pt solid #003d99;
            page-break-after: avoid;
        }}
        
        h2 {{
            font-size: 18pt;
            color: #0066cc;
            margin: 20pt 0 12pt 0;
            padding-top: 10pt;
            page-break-after: avoid;
        }}
        
        h3 {{
            font-size: 14pt;
            color: #333;
            margin: 15pt 0 10pt 0;
            page-break-after: avoid;
        }}
        
        h4 {{
            font-size: 12pt;
            color: #555;
            margin: 12pt 0 8pt 0;
            page-break-after: avoid;
        }}
        
        p {{
            margin-bottom: 12pt;
            text-align: justify;
            line-height: 1.8;
        }}
        
        code {{
            background-color: #f4f4f4;
            padding: 2pt 6pt;
            border-radius: 3pt;
            font-family: 'Courier New', monospace;
            font-size: 10pt;
            color: #d63384;
        }}
        
        pre {{
            background-color: #f8f9fa;
            border-left: 4pt solid #0066cc;
            padding: 12pt 15pt;
            margin: 12pt 0;
            border-radius: 4pt;
            overflow-x: auto;
            page-break-inside: avoid;
            font-size: 9pt;
            line-height: 1.5;
        }}
        
        pre code {{
            background: none;
            color: #333;
            padding: 0;
            font-size: 9pt;
        }}
        
        ul, ol {{
            margin: 12pt 0;
            padding-left: 30pt;
        }}
        
        li {{
            margin-bottom: 6pt;
            line-height: 1.6;
        }}
        
        table {{
            width: 100%;
            border-collapse: collapse;
            margin: 15pt 0;
            page-break-inside: avoid;
            font-size: 10pt;
        }}
        
        th {{
            background-color: #0066cc;
            color: white;
            padding: 10pt;
            text-align: left;
            font-weight: bold;
        }}
        
        td {{
            border: 1pt solid #ddd;
            padding: 9pt;
        }}
        
        tr:nth-child(even) {{
            background-color: #f9f9f9;
        }}
        
        blockquote {{
            border-left: 4pt solid #0066cc;
            margin: 15pt 0;
            padding: 12pt 15pt;
            background-color: #f0f7ff;
            color: #333;
            page-break-inside: avoid;
        }}
        
        a {{
            color: #0066cc;
            text-decoration: underline;
        }}
        
        hr {{
            border: none;
            border-top: 2pt solid #ddd;
            margin: 20pt 0;
            page-break-after: avoid;
        }}
        
        .page-break {{
            page-break-after: always;
        }}
        
        .date {{
            text-align: center;
            color: #666;
            font-size: 10pt;
            margin-top: 20pt;
        }}
    </style>
</head>
<body>
    {html_content}
    
    <div class="date">
        <p>Documento de Arquitectura | StoreHub E-Commerce | Marzo 2026</p>
    </div>
</body>
</html>
"""
        
        HTML(string=html_template).write_pdf('ARCHITECTURE.pdf')
        print("✅ PDF generado exitosamente con WeasyPrint: ARCHITECTURE.pdf")
        return True
        
    except ImportError:
        return False
    except Exception as e:
        print(f"❌ Error con WeasyPrint: {e}")
        return False

def generate_html_for_browser():
    """Genera un HTML que se puede convertir a PDF desde el navegador"""
    try:
        with open('ARCHITECTURE.md', 'r', encoding='utf-8') as f:
            md_content = f.read()
        
        # Conversión simple de markdown a HTML
        html = """<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>StoreHub - Arquitectura del Proyecto</title>
    <style>
        @media print {
            body { margin: 0; padding: 0; }
            h1 { page-break-after: avoid; }
            h2 { page-break-after: avoid; }
            pre { page-break-inside: avoid; }
            table { page-break-inside: avoid; }
        }
        
        body {
            font-family: Calibri, 'Segoe UI', sans-serif;
            font-size: 11pt;
            line-height: 1.8;
            color: #333;
            max-width: 1000px;
            margin: 0 auto;
            padding: 40px;
            background: white;
        }
        
        h1 { 
            color: #003d99;
            font-size: 2.5em;
            margin: 40px 0 20px 0;
            border-bottom: 3px solid #003d99;
            padding-bottom: 15px;
        }
        
        h2 { 
            color: #0066cc;
            font-size: 2em;
            margin: 30px 0 15px 0;
        }
        
        h3 { 
            color: #333;
            font-size: 1.5em;
            margin: 20px 0 10px 0;
        }
        
        h4 { 
            color: #555;
            font-size: 1.2em;
            margin: 15px 0 8px 0;
        }
        
        p { margin-bottom: 15px; text-align: justify; }
        
        code {
            background: #f5f5f5;
            padding: 3px 7px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            color: #d63384;
            font-size: 0.95em;
        }
        
        pre {
            background: #f8f9fa;
            border-left: 4px solid #0066cc;
            padding: 15px;
            margin: 15px 0;
            border-radius: 5px;
            overflow-x: auto;
            font-size: 10pt;
            line-height: 1.5;
        }
        
        pre code {
            background: none;
            color: #333;
            padding: 0;
        }
        
        ul, ol { margin: 15px 0; padding-left: 30px; }
        li { margin-bottom: 8px; }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        
        th {
            background: #0066cc;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: bold;
        }
        
        td {
            border: 1px solid #ddd;
            padding: 10px;
        }
        
        tr:nth-child(even) { background: #f9f9f9; }
        
        blockquote {
            border-left: 4px solid #0066cc;
            margin: 20px 0;
            padding: 15px 20px;
            background: #f0f7ff;
        }
        
        a { color: #0066cc; text-decoration: underline; }
        
        .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 10pt;
            color: #666;
            text-align: center;
        }
    </style>
</head>
<body>"""
        
        # Procesar el markdown básicamente
        lines = md_content.split('\n')
        for line in lines:
            if line.startswith('# '):
                html += f'<h1>{line[2:]}</h1>'
            elif line.startswith('## '):
                html += f'<h2>{line[3:]}</h2>'
            elif line.startswith('### '):
                html += f'<h3>{line[4:]}</h3>'
            elif line.startswith('#### '):
                html += f'<h4>{line[5:]}</h4>'
            elif line.startswith('```'):
                # Detectar bloques código
                pass
            elif line.strip() == '':
                pass
            else:
                if not line.startswith(('- ', '* ', '+ ', '1. ')):
                    html += f'<p>{line}</p>'
        
        html += """
    <div class="footer">
        <p>Documento de Arquitectura | StoreHub E-Commerce | Marzo 2026</p>
        <p><strong>Para convertir a PDF:</strong> Presiona Ctrl+P (o Cmd+P en Mac), luego "Guardar como PDF"</p>
    </div>
</body>
</html>"""
        
        with open('ARCHITECTURE_PRINT.html', 'w', encoding='utf-8') as f:
            f.write(html)
        
        print("✅ HTML generado: ARCHITECTURE_PRINT.html")
        print("📋 Abre este archivo en tu navegador y presiona Ctrl+P para convertir a PDF")
        return True
        
    except Exception as e:
        print(f"❌ Error generando HTML: {e}")
        return False

def clean_markdown(text):
    """Limpia sintaxis markdown del texto para PDF"""
    import re
    # Remover caracteres no ASCII (emojis, etc.)
    text = text.encode('ascii', 'ignore').decode('ascii')
    # Remover negritas y cursivas: **texto** -> texto
    text = re.sub(r'\*\*(.+?)\*\*', r'\1', text)
    text = re.sub(r'\*(.+?)\*', r'\1', text)
    text = re.sub(r'__(.+?)__', r'\1', text)
    text = re.sub(r'_(.+?)_', r'\1', text)
    # Remover código inline: `texto` -> texto
    text = re.sub(r'`(.+?)`', r'\1', text)
    # Remover links: [texto](url) -> texto
    text = re.sub(r'\[(.+?)\]\(.+?\)', r'\1', text)
    # Remover HR: --- o ===
    text = re.sub(r'^[-=]{3,}$', '', text)
    return text.strip()


def convert_with_fpdf2():
    """Intenta convertir usando FPDF2"""
    try:
        from fpdf import FPDF
        from fpdf.enums import XPos, YPos
        import re
        
        with open('ARCHITECTURE.md', 'r', encoding='utf-8') as f:
            md_content = f.read()
        
        pdf = FPDF()
        pdf.set_margins(20, 20, 20)
        pdf.set_auto_page_break(auto=True, margin=20)
        pdf.add_page()
        
        in_code_block = False
        blank_count = 0
        lines = md_content.split('\n')
        
        for line in lines:
            raw = line.rstrip()
            
            # Detectar bloques de código (``` ... ```)
            if raw.strip().startswith('```'):
                in_code_block = not in_code_block
                continue
            if in_code_block:
                # Mostrar código con fuente monoespaciada
                code_line = raw.encode('ascii', 'ignore').decode('ascii')[:90]
                if code_line.strip():
                    pdf.set_font("Courier", "", 8)
                    pdf.set_fill_color(240, 240, 240)
                    pdf.cell(0, 5, code_line, fill=True,
                             new_x=XPos.LMARGIN, new_y=YPos.NEXT)
                continue
            
            # Línea vacía
            stripped = raw.strip()
            if not stripped:
                blank_count += 1
                if blank_count == 1:
                    pdf.ln(4)
                continue
            blank_count = 0
            
            # Limpiar markdown del texto
            clean = clean_markdown(stripped)
            if not clean:
                continue
            
            # === Título H1 ===
            if stripped.startswith('# ') and not stripped.startswith('## '):
                text = clean_markdown(stripped[2:])
                pdf.set_font("Helvetica", "B", 16)
                pdf.set_text_color(10, 50, 130)
                pdf.multi_cell(0, 10, text, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
                # Línea decorativa bajo H1
                pdf.set_draw_color(10, 50, 130)
                pdf.set_line_width(0.5)
                x = pdf.get_x()
                y = pdf.get_y()
                pdf.line(20, y, 190, y)
                pdf.ln(4)
                pdf.set_text_color(0, 0, 0)
                continue
            
            # === Título H2 ===
            if stripped.startswith('## ') and not stripped.startswith('### '):
                text = clean_markdown(stripped[3:])
                pdf.ln(3)
                pdf.set_font("Helvetica", "B", 13)
                pdf.set_text_color(0, 80, 180)
                pdf.multi_cell(0, 8, text, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
                pdf.ln(2)
                pdf.set_text_color(0, 0, 0)
                continue
            
            # === Título H3 ===
            if stripped.startswith('### ') and not stripped.startswith('#### '):
                text = clean_markdown(stripped[4:])
                pdf.ln(2)
                pdf.set_font("Helvetica", "B", 11)
                pdf.set_text_color(40, 40, 40)
                pdf.multi_cell(0, 7, text, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
                pdf.ln(1)
                pdf.set_text_color(0, 0, 0)
                continue
            
            # === Título H4 ===
            if stripped.startswith('#### '):
                text = clean_markdown(stripped[5:])
                pdf.ln(1)
                pdf.set_font("Helvetica", "BI", 10)
                pdf.set_text_color(60, 60, 60)
                pdf.multi_cell(0, 6, text, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
                pdf.set_text_color(0, 0, 0)
                continue
            
            # === Listas con guion o asterisco ===
            list_match = re.match(r'^(\s*)([-*+])\s+(.+)', stripped)
            if list_match:
                indent_level = len(list_match.group(1)) // 2
                item_text = clean_markdown(list_match.group(3))
                x_offset = 5 + indent_level * 4
                pdf.set_font("Helvetica", "", 9)
                pdf.set_x(20 + x_offset)
                pdf.cell(4, 5, chr(149))  # bullet
                pdf.multi_cell(0, 5, item_text, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
                continue
            
            # === Listas numeradas ===
            num_match = re.match(r'^\d+\.\s+(.+)', stripped)
            if num_match:
                item_text = clean_markdown(num_match.group(1))
                num = re.match(r'^(\d+)\.', stripped).group(1)
                pdf.set_font("Helvetica", "", 9)
                pdf.set_x(20)
                pdf.cell(6, 5, f"{num}.")
                pdf.multi_cell(0, 5, item_text, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
                continue
            
            # === Texto normal ===
            pdf.set_font("Helvetica", "", 9)
            pdf.set_text_color(30, 30, 30)
            pdf.multi_cell(0, 5.5, clean, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        
        pdf.output("ARCHITECTURE.pdf")
        print("✅ PDF generado exitosamente: ARCHITECTURE.pdf")
        return True
        
    except Exception as e:
        print(f"⚠️  Error con FPDF2: {str(e)}")
        return False

def main():
    """Función principal"""
    print("\n🔄 Convirtiendo ARCHITECTURE.md a PDF...\n")
    
    # Intentar conversión con FPDF2 primero
    if convert_with_fpdf2():
        return
    
    print("⚠️  FPDF2 no disponible. Intentando Pandoc...\n")
    
    # Intentar conversión con pandoc
    if convert_with_pandoc():
        return
    
    print("⚠️  Pandoc no encontrado. Intentando WeasyPrint...\n")
    
    # Intentar con weasyprint
    if convert_with_weasyprint():
        return
    
    print("⚠️  WeasyPrint no disponible. Generando HTML para navegador...\n")
    
    # Generar HTML como última opción
    if generate_html_for_browser():
        print("\n📝 Instrucciones:")
        print("1. Abre ARCHITECTURE_PRINT.html en tu navegador")
        print("2. Presiona Ctrl+P (Windows/Linux) o Cmd+P (Mac)")
        print("3. Selecciona 'Guardar como PDF'")
        print("4. Elige la ubicación y listo!")
        return
    
    print("\n❌ No se pudo convertir el archivo.")
    print("Por favor, instala pandoc o weasyprint y vuelve a intentar.")
    sys.exit(1)

if __name__ == '__main__':
    main()
