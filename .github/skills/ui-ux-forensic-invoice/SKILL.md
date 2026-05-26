---
name: ui-ux-forensic-invoice
description: Reglas estandarizadas para la clonación pixel-perfect de facturas premium. Incluye sistema de diseño, maquetación de secciones y guías de implementación para Antigravity. Úsalo al construir o auditar interfaces de facturación.
---

# 🎨 UI/UX Forensic Rules: Invoice System

Este skill define los estándares técnicos para replicar el diseño de facturas con alta fidelidad, asegurando coherencia visual y jerarquía de información.

## 1. Sistema de Diseño (Variables Globales)
Antes de maquetar, configura estas constantes en el entorno:
- **Paleta de Color Primaria:**
  - `Color-Brand-Dark`: #2A221E (Marrón muy oscuro - Logo, Header del Grid, Footer).
  - `Color-Row-Beige`: #EFEBE7 (Beige claro - Fondo alterno de las filas del grid).
  - `Color-Text-Primary`: #000000 (Negro - Textos generales).
  - `Color-Text-Inverse`: #FFFFFF (Blanco - Texto sobre fondos oscuros).
- **Tipografía:**
  - `Font-Serif`: (Ej. Playfair Display o similar) -> Usado para Títulos ("COTIZACIÓN") y Nombres Propios.
  - `Font-Sans`: (Ej. Montserrat o Helvetica) -> Usado para Data Grid, Subtotales y UI general.
- **Márgenes del Canvas (Padding Global):**
  - Top: 5%, Right: 8%, Bottom: 5%, Left: 8%.

## 2. Estructura y Maquetación (Layout Rules)
- **Dimensiones:** Ancho máximo de 800px a 900px, centrado [6].
- **Sección A (Header):** Layout de 2 columnas (40% Izquierda Gold / 60% Derecha Beige) [7].
  - La columna derecha DEBE tener un `border-radius: 0 0 0 60px` [7].
- **Sección B (Info):** Flexbox `space-between`. La píldora de "Gran Total" debe usar `border-radius: 50px` y fondo Gold [8].
- **Sección C (Tabla):** Grid de 4 columnas (50% | 15% | 15% | 20%) con borde inferior de 2px color Gold [9].

## 3. Patrones de Implementación (Correcto vs. Incorrecto)
Siguiendo las mejores prácticas de renderizado [10]:
- **✅ Correcto:** Crear la estructura de Divs (DOM) completa antes de aplicar clases de estilo [11].
- **❌ Incorrecto:** Aplicar márgenes a los bordes superior y laterales en el Header [6].
- **✅ Correcto:** Usar `position: absolute` con `opacity: 0.05` para el logo de fondo (Watermark) [9].
- **❌ Incorrecto:** Concatenar estilos en línea; usar clases reutilizables como `.text-gold-bold` o `.pill-shape` [11].

## 4. Reglas de Responsive y Exportación
- **Adaptabilidad:** En pantallas < 768px, el Header y Footer deben cambiar a `flex-direction: column` [12].
- **Assets:** Exportar logos en formato **SVG nativo** para mantener nitidez en cualquier resolución [11].

## Procedimiento de Validación
1. Verificar que el "Gran Total" esté alineado a la derecha en su píldora contenedora [8].
2. Confirmar que las columnas de CTD, PRECIO y TOTAL estén centradas o a la derecha, mientras SERVICIO esté a la izquierda [13].
3. Validar que las condiciones finales usen un tamaño de fuente reducido (9px-10px) con interlineado 1.4 [14].
