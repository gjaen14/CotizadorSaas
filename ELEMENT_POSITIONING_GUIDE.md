# 📍 Guía: ElementPosition y Agrupación de Componentes

## ¿Qué es ElementPosition?

`ElementPosition` es la estructura que controla dónde aparecen los elementos en tu cotización. Es simplemente dos números: `x` e `y` en píxeles.

```typescript
interface ElementPosition {
  x: number;  // Distancia desde la izquierda (en píxeles)
  y: number;  // Distancia desde arriba (en píxeles)
}
```

---

## El Nuevo Sistema: Grupos de Elementos

### Antes (Sistema antiguo):
Cada elemento tenía su posición de forma independiente:
```typescript
elementPositions: {
  quoteTitle: { x: 48, y: 60 },    // Solo número y posición
  logo: { x: 550, y: 40 },
  companyInfo: { x: 500, y: 180 }
}
```

### Ahora (Nuevo sistema con estilos):
Puedes **agrupar elementos** y añadir estilos compartidos:

```typescript
interface TitleHeaderGroup {
  position: ElementPosition;  // Dónde va
  style: StyleSettings;        // Cómo se ve
}

interface StyleSettings {
  fontSize?: number;      // Tamaño en píxeles
  fontWeight?: 'normal' | 'bold' | 'lighter';
  color?: string;         // Color hex, ej: #000000
}
```

---

## Ejemplo: Tu Caso "Número + Fecha"

### Lo que querías:
> "El elementPosition que contiene el número de cotización quiero pasarle la fecha, que sea un solo grupo, y cambiar el tamaño de las letras"

### La solución implementada:

**1. En `types.ts` - Definición:**
```typescript
titleHeaderGroup?: {
  position: { x: 48, y: 60 },
  style: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000'
  }
}
```

**2. En `App.tsx` - Estado inicial:**
```typescript
titleHeaderGroup: {
  position: { x: 48, y: 60 },
  style: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000'
  }
}
```

**3. En `QuotePreview.tsx` - Renderizado:**
```tsx
{renderDraggable('titleHeaderGroup', (
  <div className="w-[300px]">
    <h2 className="text-xl font-bold tracking-widest uppercase mb-1" 
        style={{ color: settings.themeColor }}>
      COTIZACIÓN #{settings.quoteNumber}
    </h2>
    <p className="text-sm text-slate-600 mt-2">
      Fecha: {settings.date}
    </p>
  </div>
), 48, 60, 'titleHeaderGroup')}
```

**4. En `App.tsx` - Controles en Settings:**
```tsx
<input 
  type="range" 
  min="12" 
  max="36" 
  value={state.settings.elementPositions?.titleHeaderGroup?.style?.fontSize || 18}
  onChange={e => {
    const newPos = {
      ...state.settings.elementPositions,
      titleHeaderGroup: {
        ...state.settings.elementPositions?.titleHeaderGroup!,
        style: {
          ...state.settings.elementPositions?.titleHeaderGroup?.style,
          fontSize: parseInt(e.target.value)
        }
      }
    };
    updateSettings('elementPositions', newPos);
  }}
/>
```

---

## Cómo Funciona el Layout Mode

1. **Desbloquea edición:**
   - En Settings → "🔒 Mover Elementos (Desbloquear)"
   - Los elementos apareceran con **bordes naranjas punteados**

2. **Arrastra elementos:**
   - Haz click y arrastra cualquier caja naranja
   - La posición se actualiza en `state.settings.elementPositions[key]`

3. **Bloquea edición:**
   - Vuelve a hacer click para terminar
   - Los bordes desaparecen

4. **Cambios persisten:**
   - Se guardan en el estado de React
   - (Para persistencia permanente, necesitarías localStorage o base de datos)

---

## Cómo Agrupa Diferentes Items

### Patrón para crear un nuevo grupo:

**Paso 1: Define la interfaz en `types.ts`**
```typescript
interface PaymentSection {
  position: ElementPosition;
  style: StyleSettings;
  // Puedes agregar más propiedades según necesites
}

// Luego en elementPositions:
paymentSection?: PaymentSection;
```

**Paso 2: Inicializa en `App.tsx`**
```typescript
paymentSection: {
  position: { x: 48, y: 700 },
  style: {
    fontSize: 12,
    fontWeight: 'normal',
    color: '#333333'
  }
}
```

**Paso 3: Renderiza en `QuotePreview.tsx`**
```tsx
{renderDraggable('paymentSection', (
  <div>
    <h3>Información de Pago</h3>
    <p>{settings.paymentInfo}</p>
  </div>
), 48, 700, 'paymentSection')}
```

**Paso 4: Añade controles en `App.tsx` Settings**
```tsx
<div>
  <label>Tamaño Fuente - Sección Pago</label>
  <input 
    type="range"
    value={state.settings.elementPositions?.paymentSection?.style?.fontSize || 12}
    onChange={e => {
      // Actualiza paymentSection.style.fontSize
    }}
  />
</div>
```

---

## Funciones Clave en QuotePreview.tsx

### `getPos()` - Extrae la posición
```typescript
const getPos = (key: string, defX: number, defY: number) => {
  const p = (pos as any)[key];
  if (p && typeof p === 'object' && 'position' in p) {
    // Es un grupo con { position, style }
    return p.position || { x: defX, y: defY };
  }
  return p || { x: defX, y: defY };
};
```

### `getStyle()` - Extrae los estilos
```typescript
const getStyle = (key: string) => {
  const p = (pos as any)[key];
  if (p && typeof p === 'object' && 'style' in p) {
    return {
      fontSize: p.style.fontSize ? `${p.style.fontSize}px` : 'inherit',
      fontWeight: p.style.fontWeight || 'normal',
      color: p.style.color || 'inherit'
    };
  }
  return {};
};
```

### `renderDraggable()` - Renderiza con posición + estilos
```typescript
const renderDraggable = (key: string, content: React.ReactNode, defaultX: number, defaultY: number) => {
  const p = getPos(key, defaultX, defaultY);
  const customStyle = getStyle(key);
  
  return (
    <div
      style={{
        position: 'absolute',
        left: p.x,
        top: p.y,
        ...customStyle  // ← Aplica fontSize, fontWeight, color
      }}
    >
      {content}
    </div>
  );
};
```

---

## Ventajas de Esta Estructura

✅ **Agrupa datos relacionados:** Número + Fecha + Estilos en un solo objeto  
✅ **Escalable:** Fácil agregar más propiedades (ej: sombra, borde, etc.)  
✅ **Flexible:** Cada grupo puede tener diferentes estilos  
✅ **Reutilizable:** El patrón funciona para cualquier elemento  
✅ **TypeScript-safe:** Tipos bien definidos evitan errores  

---

## Próximos Pasos Posibles

1. **Agrupa más elementos:**
   - Totales (Subtotal + IVA + Total) en un solo grupo
   - Tabla de items con su propio estilos (tamaño, color encabezados)

2. **Añade más propiedades de estilo:**
   ```typescript
   interface StyleSettings {
     fontSize?: number;
     fontWeight?: 'normal' | 'bold' | 'lighter';
     color?: string;
     textAlign?: 'left' | 'center' | 'right';
     textDecoration?: 'underline' | 'none';
     letterSpacing?: number;  // Espaciado entre letras
   }
   ```

3. **Persiste cambios:**
   - Guarda elementPositions en localStorage
   - O crea un backend para guardar plantillas

---

## Debugging Tips

Si algo no aparece:
1. Revisa que `elementPositions` esté inicializado en INITIAL_STATE
2. Verifica que `renderDraggable()` use la clave exacta
3. En browser DevTools → `console` → busca errores de React
4. Activa Layout Mode para ver dónde está realmente el elemento

¡Listo! Ahora entiendes cómo funcionan ElementPosition y cómo agrupar elementos. 🎉
