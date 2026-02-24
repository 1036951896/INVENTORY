import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle, Image
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib import colors
from html.parser import HTMLParser
import re

# Rutas
ruta_html = r'c:\Users\Equipo\Desktop\inventory app\MANUAL_IDENTIDAD_MARCA.html'
ruta_pdf = r'c:\Users\Equipo\Desktop\inventory app\MANUAL_IDENTIDAD_MARCA.pdf'

# Crear PDF
doc = SimpleDocTemplate(ruta_pdf, pagesize=A4)
doc.topMargin = 0.5 * inch
doc.bottomMargin = 0.5 * inch
doc.leftMargin = 0.75 * inch
doc.rightMargin = 0.75 * inch

styles = getSampleStyleSheet()

# Estilos personalizados
titulo_style = ParagraphStyle(
    'TituloCustom',
    parent=styles['Heading1'],
    fontSize=36,
    textColor=colors.HexColor('#386273'),
    spaceAfter=30,
    alignment=TA_CENTER,
    fontName='Helvetica-Bold'
)

subtitulo_style = ParagraphStyle(
    'SubtituloCustom',
    parent=styles['Heading2'],
    fontSize=24,
    textColor=colors.HexColor('#386273'),
    spaceAfter=12,
    spaceBefore=12,
    fontName='Helvetica-Bold'
)

heading3_style = ParagraphStyle(
    'Heading3Custom',
    parent=styles['Heading3'],
    fontSize=14,
    textColor=colors.HexColor('#2a4a5a'),
    spaceAfter=10,
    spaceBefore=10,
    fontName='Helvetica-Bold'
)

body_style = ParagraphStyle(
    'BodyCustom',
    parent=styles['BodyText'],
    fontSize=11,
    textColor=colors.HexColor('#333333'),
    alignment=TA_JUSTIFY,
    spaceAfter=10
)

# Contenido del PDF
elements = []

# Portada
elements.append(Spacer(1, 2 * inch))
elements.append(Paragraph("STOREHUB", titulo_style))
elements.append(Paragraph("Manual de Identidad de Marca", subtitulo_style))
elements.append(Spacer(1, 1.5 * inch))
elements.append(Paragraph("Guía Completa de Uso Corporativo", body_style))
elements.append(Spacer(1, 0.3 * inch))
elements.append(Paragraph("Febrero 2026", ParagraphStyle('Center', parent=body_style, alignment=TA_CENTER)))
elements.append(PageBreak())

# Índice
elements.append(Paragraph("Índice", subtitulo_style))
indice_items = [
    "1. Introducción",
    "2. Identidad Corporativa",
    "3. Logo y Variantes",
    "4. Paleta de Colores",
    "5. Tipografía",
    "6. Elementos Visuales",
    "7. Tono de Voz",
    "8. Aplicaciones",
    "9. Restricciones de Uso",
    "10. Contacto"
]
for item in indice_items:
    elements.append(Paragraph(item, body_style))
elements.append(PageBreak())

# Sección 1: Introducción
elements.append(Paragraph("1. Introducción", subtitulo_style))
elements.append(Paragraph("Propósito del Manual", heading3_style))
elements.append(Paragraph(
    "Este Manual de Identidad de Marca establece los estándares y directrices para el uso correcto de la identidad visual y verbal de StoreHub. Estas normas aseguran consistencia, coherencia y profesionalismo en todas nuestras comunicaciones.",
    body_style
))

elements.append(Paragraph("Misión", heading3_style))
elements.append(Paragraph(
    "StoreHub es una plataforma de comercio electrónico que facilita la venta de productos de forma intuitiva y segura, proporcionando a los clientes una experiencia de compra excepcional.",
    body_style
))

elements.append(Paragraph("Valores", heading3_style))
valores = [
    "<b>Confianza:</b> Seguridad y transparencia en cada transacción",
    "<b>Innovación:</b> Tecnología moderna y eficiente",
    "<b>Calidad:</b> Productos y servicio de excelencia",
    "<b>Accesibilidad:</b> Plataforma fácil de usar para todos"
]
for valor in valores:
    elements.append(Paragraph(valor, body_style))

elements.append(PageBreak())

# Sección 2: Identidad Corporativa
elements.append(Paragraph("2. Identidad Corporativa", subtitulo_style))
elements.append(Paragraph("Nombre de la Marca", heading3_style))
elements.append(Paragraph(
    "<b>StoreHub</b> es el nombre oficial de la marca. Se escribe como una sola palabra con mayúscula inicial en ambas sílabas.",
    body_style
))

elements.append(Paragraph("Definición de la Marca", heading3_style))
elements.append(Paragraph(
    "StoreHub representa un centro o hub de tiendas virtuales. Es un espacio donde convergen vendedores y compradores en una experiencia segura, moderna y confiable.",
    body_style
))

elements.append(Paragraph("Público Objetivo", heading3_style))
publicos = [
    "<b>Clientes:</b> Personas mayores de 18 años que compran en línea",
    "<b>Vendedores:</b> Emprendedores y empresas que desean vender en línea",
    "<b>Administradores:</b> Personal que gestiona la plataforma"
]
for publico in publicos:
    elements.append(Paragraph(publico, body_style))

elements.append(PageBreak())

# Sección 3: Logo
elements.append(Paragraph("3. Logo y Variantes", subtitulo_style))
elements.append(Paragraph("Logo Principal", heading3_style))
elements.append(Paragraph(
    "<b>Logo actual:</b> logo.svg - SVG (Scalable Vector Graphics) - Formato vectorial para máxima calidad en cualquier tamaño",
    body_style
))

elements.append(Paragraph("Especificaciones Técnicas", heading3_style))
specs = [
    "Formato: SVG (vectorial)",
    "Proporción: Se mantiene en todos los tamaños",
    "Mínimo de uso: 40px de ancho",
    "Márgenes de seguridad: 10px alrededor del logo"
]
for spec in specs:
    elements.append(Paragraph(spec, body_style))

elements.append(Paragraph("Nota importante:", heading3_style))
elements.append(Paragraph(
    "El logo debe mantener sus proporciones originales. No se permite comprimir, estirar o transformar de forma arbitraria. Siempre consultar la versión original en logo.svg.",
    ParagraphStyle('Warning', parent=body_style, textColor=colors.HexColor('#c62828'))
))

elements.append(PageBreak())

# Sección 4: Colores
elements.append(Paragraph("4. Paleta de Colores", subtitulo_style))
elements.append(Paragraph("Colores Corporativos", heading3_style))

color_data = [
    ['Color', 'Código HEX', 'RGB'],
    ['Azul Primario', '#386273', 'RGB(56, 98, 115)'],
    ['Azul Secundario', '#B6E1F2', 'RGB(182, 225, 242)'],
    ['Blanco', '#FFFFFF', 'RGB(255, 255, 255)'],
    ['Gris Claro', '#F5F5F5', 'RGB(245, 245, 245)'],
]

tabla_colores = Table(color_data)
tabla_colores.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#386273')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
    ('FONTSIZE', (0, 0), (-1, 0), 12),
    ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
    ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
    ('GRID', (0, 0), (-1, -1), 1, colors.black)
]))
elements.append(tabla_colores)

elements.append(Spacer(1, 0.3 * inch))
elements.append(Paragraph("Usos Recomendados", heading3_style))
usos = [
    "<b>Azul Primario (#386273):</b> Headers, botones principales, textos destacados",
    "<b>Azul Secundario (#B6E1F2):</b> Fondos, acentos, estados hover",
    "<b>Blanco:</b> Fondos, textos en colores oscuros",
    "<b>Gris Claro:</b> Separadores, fondos secundarios"
]
for uso in usos:
    elements.append(Paragraph(uso, body_style))

elements.append(PageBreak())

# Sección 5: Tipografía
elements.append(Paragraph("5. Tipografía", subtitulo_style))
elements.append(Paragraph("Familia Tipográfica Principal", heading3_style))
elements.append(Paragraph(
    "<b>Segoe UI, Roboto, Helvetica Neue, sans-serif</b><br/>Familia tipográfica moderna, limpia y muy legible en pantallas. Se utiliza en prácticamente todas las aplicaciones digitales.",
    body_style
))

elements.append(Paragraph("Jerarquía Tipográfica", heading3_style))
elements.append(Paragraph("<b>Títulos Principales (H1)</b><br/>Tamaño: 2.5-3em | Peso: 700 (Bold) | Color: #386273", body_style))
elements.append(Paragraph("<b>Subtítulos (H2)</b><br/>Tamaño: 1.8-2em | Peso: 600 (Semibold) | Color: #386273", body_style))
elements.append(Paragraph("<b>Cuerpo de Texto</b><br/>Tamaño: 0.95-1em | Peso: 400 (Regular) | Color: #666", body_style))

elements.append(Paragraph("Recomendaciones", heading3_style))
recomendaciones = [
    "Mantener contraste adecuado entre texto y fondo",
    "Usar máximo 3 tamaños diferentes de fuente",
    "Línea mínima de separación: 1.5 veces el tamaño de la fuente",
    "Ancho máximo de línea: 80 caracteres para mejor legibilidad"
]
for rec in recomendaciones:
    elements.append(Paragraph(rec, body_style))

elements.append(PageBreak())

# Sección 6: Elementos Visuales
elements.append(Paragraph("6. Elementos Visuales", subtitulo_style))
elements.append(Paragraph("Botones", heading3_style))
elementos_botones = [
    "<b>Color primario:</b> #386273",
    "<b>Color hover:</b> #B6E1F2 (fondo) con texto #386273",
    "<b>Padding:</b> 0.75rem 1.5rem",
    "<b>Altura mínima:</b> 48px"
]
for elemento in elementos_botones:
    elements.append(Paragraph(elemento, body_style))

elements.append(Paragraph("Tarjetas (Cards)", heading3_style))
elementos_cards = [
    "<b>Border radius:</b> 12px",
    "<b>Sombra:</b> 0 2px 8px rgba(0,0,0,0.1)",
    "<b>Padding interior:</b> 1.5rem",
    "<b>Transición hover:</b> 0.3s ease"
]
for elemento in elementos_cards:
    elements.append(Paragraph(elemento, body_style))

elements.append(Paragraph("Iconografía", heading3_style))
elementos_iconografia = [
    "Mantener consistencia visual",
    "Estar centrados en su contenedor",
    "Tener proporciones 1:1 (cuadrados)",
    "Ser escalables sin perder calidad"
]
for elemento in elementos_iconografia:
    elements.append(Paragraph(elemento, body_style))

elements.append(PageBreak())

# Sección 7: Tono de Voz
elements.append(Paragraph("7. Tono de Voz", subtitulo_style))
elements.append(Paragraph("Características de la Voz StoreHub", heading3_style))
caracteristicas = [
    "<b>Profesional pero amigable:</b> Formal cuando es necesario, accesible siempre",
    "<b>Claro y directo:</b> Evitar jerga innecesaria",
    "<b>Confiable:</b> Usar lenguaje que genere seguridad",
    "<b>Positivo:</b> Enfatizar beneficios y soluciones"
]
for caracteristica in caracteristicas:
    elements.append(Paragraph(caracteristica, body_style))

elements.append(Paragraph("Reglas de Gramática", heading3_style))
reglas = [
    "Usar vocabulario sencillo y directo",
    "Evitar siglas innecesarias",
    "Usar segunda persona cuando sea apropiado",
    "Mantener párrafos cortos (máximo 3 líneas)",
    "Terminar botones con verbos de acción (Guardar, Enviar, Comprar)"
]
for regla in reglas:
    elements.append(Paragraph(regla, body_style))

elements.append(PageBreak())

# Sección 8: Aplicaciones
elements.append(Paragraph("8. Aplicaciones", subtitulo_style))
elements.append(Paragraph("Sitio Web", heading3_style))
aplicaciones_web = [
    "<b>Página de Inicio:</b> Logo en header, paleta de colores corporativos, tipografía consistente",
    "<b>Página de Productos:</b> Tarjetas con imágenes 300x300px, precios en color primario",
    "<b>Página de Compra:</b> Formularios limpios, colores de validación (verde éxito, rojo error)"
]
for app in aplicaciones_web:
    elements.append(Paragraph(app, body_style))

elements.append(Paragraph("Panel de Administración", heading3_style))
elementos_admin = [
    "<b>Interfaz:</b> Navegación vertical con colores primarios, tablas con estilos consistentes",
    "<b>Gráficos:</b> Usar colores corporativos + colores de apoyo"
]
for elemento in elementos_admin:
    elements.append(Paragraph(elemento, body_style))

elements.append(Paragraph("Correo Electrónico", heading3_style))
elementos_email = [
    "<b>Header:</b> Logo de StoreHub (80px), color de fondo #F5F5F5",
    "<b>CTA Buttons:</b> Color primario #386273, texto blanco, 48px de altura"
]
for elemento in elementos_email:
    elements.append(Paragraph(elemento, body_style))

elements.append(PageBreak())

# Sección 9: Restricciones
elements.append(Paragraph("9. Restricciones de Uso", subtitulo_style))
elements.append(Paragraph("Qué NO hacer con el Logo", heading3_style))
restricciones = [
    "✗ No cambiar proporciones (estirar u comprimir)",
    "✗ No cambiar colores del logo",
    "✗ No agregar efectos (sombras, brillos no autorizados)",
    "✗ No rotar a ángulos diferentes de 0° o 180°",
    "✗ No colocar logo sobre fondos que no permitan visibilidad"
]
for restriccion in restricciones:
    elements.append(Paragraph(restriccion, ParagraphStyle('Restriccion', parent=body_style, textColor=colors.HexColor('#c62828'))))

elements.append(Paragraph("Qué NO hacer con Colores", heading3_style))
restricciones_color = [
    "✗ No usar colores diferentes a los especificados",
    "✗ No crear degradados con colores corporativos sin autorización",
    "✗ No usar colores con contraste insuficiente"
]
for restriccion in restricciones_color:
    elements.append(Paragraph(restriccion, ParagraphStyle('Restriccion', parent=body_style, textColor=colors.HexColor('#c62828'))))

elements.append(PageBreak())

# Sección 10: Contacto
elements.append(Paragraph("10. Contacto y Soporte", subtitulo_style))
elements.append(Paragraph("Para Consultas sobre la Marca", heading3_style))
elements.append(Paragraph(
    "Si tienes dudas sobre el uso correcto de elementos de marca, contacta al equipo de diseño.",
    body_style
))

elements.append(Paragraph("Archivos Disponibles", heading3_style))
archivos = [
    "<b>logo.svg:</b> Logo en formato vectorial",
    "<b>Paleta de colores:</b> CSS variables y códigos HEX",
    "<b>Tipografía:</b> Google Fonts (Segoe UI, Roboto)",
    "<b>Componentes:</b> HTML/CSS reutilizables"
]
for archivo in archivos:
    elements.append(Paragraph(archivo, body_style))

elements.append(Spacer(1, 0.5 * inch))
elements.append(Paragraph("© 2026 StoreHub. Todos los derechos reservados.", ParagraphStyle('Center', parent=body_style, alignment=TA_CENTER, fontName='Helvetica-Bold')))

# Generar PDF
try:
    doc.build(elements)
    if os.path.exists(ruta_pdf):
        tamaño = os.path.getsize(ruta_pdf) / 1024
        print(f"✅ PDF generado exitosamente!")
        print(f"📄 Ubicación: {ruta_pdf}")
        print(f"📊 Tamaño: {tamaño:.2f} KB")
    else:
        print("❌ Error: El PDF no se creó")
except Exception as e:
    print(f"❌ Error al generar PDF: {e}")
