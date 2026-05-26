# 📝 Guía: Ajustar Tamaños de Letra con Tailwind

Ya que decidimos mantener los estilos con **Tailwind CSS**, aquí te muestro exactamente cómo cambiar tamaños, pesos y otros estilos directamente en el código.

---

## Localización Actual

El encabezado "COTIZACIÓN #" + "Fecha" está en:
```
📁 components/QuotePreview.tsx
   Líneas 173-183
```

---

## 1️⃣ Ajustar Tamaño del Título (COTIZACIÓN #)

**Archivo:** `components/QuotePreview.tsx` Línea 177

```tsx
<h2 className="text-xl font-bold tracking-widest uppercase mb-1" style={{ color: settings.themeColor }}>
    COTIZACIÓN #{settings.quoteNumber}
</h2>
```

### Clases Tailwind de Tamaño (en orden de menor a mayor):
| Clase | Tamaño | Uso |
|-------|--------|-----|
| `text-xs` | 12px | Muy pequeño |
| `text-sm` | 14px | Pequeño |
| `text-base` | 16px | Normal |
| `text-lg` | 18px | Grande |
| `text-xl` | 20px | **← Actual** |
| `text-2xl` | 24px | Muy grande |
| `text-3xl` | 30px | Extra grande |
| `text-4xl` | 36px | Gigante |
| `text-5xl` | 48px | Titán |

### Ejemplos de cambio:

**Más pequeño (18px → 16px):**
```tsx
<h2 className="text-lg font-bold tracking-widest uppercase mb-1" ...>
```

**Más grande (20px → 24px):**
```tsx
<h2 className="text-2xl font-bold tracking-widest uppercase mb-1" ...>
```

**Mucho más grande (20px → 36px):**
```tsx
<h2 className="text-3xl font-bold tracking-widest uppercase mb-1" ...>
```

---

## 2️⃣ Ajustar Peso de Fuente (Negrita/Normal)

**Archivo:** `components/QuotePreview.tsx` Línea 177

```tsx
<h2 className="text-xl font-bold tracking-widest uppercase mb-1" ...>
```

### Clases Tailwind de Peso (font-weight):
| Clase | Peso | Aspecto |
|-------|------|--------|
| `font-light` | 300 | Delgado, elegante |
| `font-normal` | 400 | Normal, estándar |
| `font-medium` | 500 | Medio |
| `font-semibold` | 600 | Más negrita |
| `font-bold` | 700 | **← Actual**, muy negrita |
| `font-extrabold` | 800 | Extremadamente negrita |

### Ejemplos:

**Normal (no negrita):**
```tsx
<h2 className="text-xl font-normal tracking-widest uppercase mb-1" ...>
```

**Extra bold:**
```tsx
<h2 className="text-xl font-extrabold tracking-widest uppercase mb-1" ...>
```

**Elegante (delgado):**
```tsx
<h2 className="text-xl font-light tracking-widest uppercase mb-1" ...>
```

---

## 3️⃣ Ajustar Tamaño de la Fecha

**Archivo:** `components/QuotePreview.tsx` Línea 179

```tsx
<p className="text-sm text-slate-600 mt-2">Fecha: {settings.date}</p>
```

Usa las mismas clases que arriba (text-xs, text-sm, text-lg, etc.)

### Ejemplos:

**Más pequeña (14px → 12px):**
```tsx
<p className="text-xs text-slate-600 mt-2">Fecha: {settings.date}</p>
```

**Más grande (14px → 16px):**
```tsx
<p className="text-base text-slate-600 mt-2">Fecha: {settings.date}</p>
```

**Grande como el título:**
```tsx
<p className="text-lg text-slate-600 mt-2">Fecha: {settings.date}</p>
```

---

## 4️⃣ Ajustar Color del Texto

El color ya es **dinámico** (toma el color del tema):
```tsx
<h2 className="..." style={{ color: settings.themeColor }}>
```

Pero para la fecha, el color está fijo (`text-slate-600`).

### Si quieres cambiar color de fecha, usa:

**Más oscuro:**
```tsx
<p className="text-sm text-slate-900 mt-2">Fecha: {settings.date}</p>
```

**Más claro:**
```tsx
<p className="text-sm text-slate-400 mt-2">Fecha: {settings.date}</p>
```

**Color rojo:**
```tsx
<p className="text-sm text-red-600 mt-2">Fecha: {settings.date}</p>
```

**Usar color del tema (como el título):**
```tsx
<p className="text-sm mt-2" style={{ color: settings.themeColor }}>Fecha: {settings.date}</p>
```

---

## 5️⃣ Espaciado (Margin/Padding)

Clases de espaciado que ya se usan:
- `mb-1` = margin-bottom pequeño (4px)
- `mt-2` = margin-top mediano (8px)
- `gap-2` = space between flex items

### Si quieres más/menos espacio:

**Sin espacio:**
```tsx
<h2 className="text-xl font-bold tracking-widest uppercase" ...>
```

**Más espacio abajo:**
```tsx
<h2 className="text-xl font-bold tracking-widest uppercase mb-4" ...>
```

**Mucho más espacio:**
```tsx
<h2 className="text-xl font-bold tracking-widest uppercase mb-6" ...>
```

---

## 6️⃣ Ejemplo Completo: Cambiar TODO

Si quieres un encabezado **MÁS GRANDE, DELGADO, Y CON MÁS ESPACIO**:

```tsx
// ANTES:
<div className="w-[300px]">
  <h2 className="text-xl font-bold tracking-widest uppercase mb-1" style={{ color: settings.themeColor }}>
      COTIZACIÓN #{settings.quoteNumber}
  </h2>
  <p className="text-sm text-slate-600 mt-2">Fecha: {settings.date}</p>
</div>

// DESPUÉS (más grande y elegante):
<div className="w-[300px]">
  <h2 className="text-3xl font-light tracking-widest uppercase mb-4" style={{ color: settings.themeColor }}>
      COTIZACIÓN #{settings.quoteNumber}
  </h2>
  <p className="text-base text-slate-500 mt-3" style={{ color: settings.themeColor }}>
      Fecha: {settings.date}
  </p>
</div>
```

---

## 📍 Localización de Otros Elementos

Si quieres ajustar tamaños de **otros elementos**, búscalos aquí:

| Elemento | Archivo | Líneas |
|----------|---------|--------|
| **Número de cotización** | `QuotePreview.tsx` | 177 |
| **Fecha** | `QuotePreview.tsx` | 179 |
| **Nombre empresa** | `QuotePreview.tsx` | ~195 |
| **Email/contacto** | `QuotePreview.tsx` | ~330 |
| **Tabla de items** | `QuotePreview.tsx` | ~240 |
| **Totales** | `QuotePreview.tsx` | ~280 |

---

## 🚀 Quick Reference - Copia y Pega

### Cambiar SOLO el tamaño de "COTIZACIÓN #":
Busca la línea que dice `text-xl` y cámbiala por uno de estos:
- `text-sm` (pequeño)
- `text-lg` (normal)
- `text-2xl` (grande)
- `text-3xl` (muy grande)
- `text-4xl` (enorme)

### Cambiar SOLO el peso (negrita):
Busca `font-bold` y cámbialo por:
- `font-normal` (regular)
- `font-light` (delgado)
- `font-extrabold` (más negrita)

### Cambiar SOLO el espacio:
Busca `mb-1` o `mt-2` y cámbialo por:
- `mb-0` (sin espacio)
- `mb-2`, `mb-3`, `mb-4` (más espacio)
- `mt-0`, `mt-1`, `mt-3`, `mt-4` (más espacio arriba)

---

## ✅ Paso a Paso Completo

1. **Abre:** `components/QuotePreview.tsx`
2. **Ve a:** Línea ~177 (busca "COTIZACIÓN #")
3. **Encuentra:** `className="text-xl font-bold ..."`
4. **Cambia:**
   - `text-xl` → tu nuevo tamaño
   - `font-bold` → tu nuevo peso
   - `mb-1` → tu nuevo espaciado
5. **Guarda** (Ctrl+S o Cmd+S)
6. **Ver cambios:** La app se actualiza automáticamente en dev mode

---

## ❓ FAQ

**P:** ¿Puedo combinar clases?
**R:** Sí. Ej: `className="text-2xl font-light tracking-tight uppercase mb-4"`

**P:** ¿Cómo vuelvo a lo original?
**R:** Solo revierte a `className="text-xl font-bold tracking-widest uppercase mb-1"`

**P:** ¿Y si quiero algo intermedio (ej: 22px)?
**R:** Usa `style` inline: `style={{ fontSize: '22px' }}` junto con las clases

**P:** ¿Dónde están los colores?
**R:** En `App.tsx` Settings → selector de colores (ya funciona)

¡Listo! Ahora puedes cambiar todos los tamaños directamente en el código. 🎨
