# 📄 Guía: Sistema de Paginación de Items

## Resumen

Tu cotizador ahora soporta **múltiples páginas** automáticamente. Cada página puede contener un máximo de **8 items**, y los **totales + métodos de pago** aparecen solo en la **última página**.

---

## Cómo Funciona

### 1. Paginación Automática

**Cálculo de páginas:**
```typescript
const ITEMS_PER_PAGE = 8;
const totalPages = Math.max(1, Math.ceil(state.items.length / ITEMS_PER_PAGE));
```

| Items | Páginas |
|-------|---------|
| 1-8   | 1       |
| 9-16  | 2       |
| 17-24 | 3       |
| 25+   | 4+      |

### 2. Navegación entre Páginas (Editor - Lado Izquierdo)

Cuando tienes más de 1 página, aparecen **tabs dinámicos** en el editor:

```tsx
{totalPages > 1 && (
  <div className="flex gap-1 mb-4 flex-wrap">
    {Array.from({ length: totalPages }).map((_, pageIdx) => (
      <button
        onClick={() => setSelectedItemsPage(pageIdx)}
        className={`${selectedItemsPage === pageIdx ? 'bg-brand-600 text-white' : 'bg-slate-200'}`}
      >
        Página {pageIdx + 1}
      </button>
    ))}
  </div>
)}
```

**Ejemplo:**
- Agregas 12 items → Se crean 2 tabs: "Página 1" y "Página 2"
- Haces click en "Página 2" → Ves solo los últimos 4 items
- Los primeros 8 items están en "Página 1"

### 3. Vista Previa (Lado Derecho)

Solo muestra los items de la página seleccionada:

```tsx
{getPageItems(selectedItemsPage).map((item) => (
  // Renderiza solo items de esa página
))}
```

---

## Comportamiento Especial de Elementos

### ✅ Elementos que aparecen en TODAS las páginas:
- ✓ Encabezado (número de cotización + fecha)
- ✓ Logo
- ✓ Datos de la empresa
- ✓ Datos del cliente

### ✅ Elementos que aparecen SOLO en la ÚLTIMA página:
- ✓ **Tabla de Items** (filtrada a los de esa página)
- ✓ **Totales** (Subtotal, ITBMS, Total)
- ✓ **Métodos de Pago**
- ✓ **Notas/Condiciones**

### ✓ Datos importantes:
- Los **cálculos de totales** (subtotal, impuestos, total) consideran **TODOS los items de todas las páginas**, no solo los de la última.

---

## Código Clave

### `App.tsx` - Función de Paginación

```typescript
const ITEMS_PER_PAGE = 8;
const totalPages = Math.max(1, Math.ceil(state.items.length / ITEMS_PER_PAGE));

const getPageItems = (pageIndex: number) => {
  const start = pageIndex * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  return state.items.slice(start, end);
};
```

### `App.tsx` - Agregar Item (auto-avanza a nueva página)

```typescript
const addItem = () => {
  const newItem: QuoteItem = { /* ... */ };
  setState(prev => ({ ...prev, items: [...prev.items, newItem] }));
  
  // Auto-avanza a la página del nuevo item
  const newTotalPages = Math.ceil((state.items.length + 1) / ITEMS_PER_PAGE);
  setSelectedItemsPage(newTotalPages - 1);
};
```

### `App.tsx` - Borrar Item (valida página seleccionada)

```typescript
const deleteItem = (id: string) => {
  setState(prev => ({
    ...prev,
    items: prev.items.filter(item => item.id !== id)
  }));
  
  // Si la página seleccionada ya no existe, regresa a la última válida
  const newItemsCount = state.items.length - 1;
  const newTotalPages = Math.max(1, Math.ceil(newItemsCount / ITEMS_PER_PAGE));
  if (selectedItemsPage >= newTotalPages) {
    setSelectedItemsPage(Math.max(0, newTotalPages - 1));
  }
};
```

### `QuotePreview.tsx` - Mostrar items de página actual

```typescript
{getPageItems(currentPageIndex).map((item) => (
  item.isVisible && (
    <div key={item.id} className="flex py-2 text-sm border-b border-slate-100">
      {/* Renderiza item */}
    </div>
  )
))}
```

### `QuotePreview.tsx` - Totales solo en última página

```typescript
{currentPageIndex === totalPages - 1 && renderDraggable('totalsBox', (
  <div className="w-[250px]">
    {/* Muestra Subtotal, Impuestos, Total */}
  </div>
))}
```

---

## Impresión / PDF

### Cómo funciona:

1. **Click en "Imprimir / Guardar PDF"** → Se renderiza un área oculta (`#print-all-pages`) con **todas las páginas**
2. Cada página es exactamente **210mm × 297mm (A4)**
3. Entre páginas se inserta automáticamente un `page-break-after: always` en CSS
4. Al abrir el diálogo de impresión, ves todas las páginas

### CSS en `index.html`:

```css
@media print {
  #print-all-pages { display: block !important; }
  #print-all-pages > div {
    page-break-after: always !important;
    width: 210mm !important;
    height: 297mm !important;
  }
}
```

### Flujo en `App.tsx`:

```tsx
{/* Hidden Print Area - All Pages */}
<div id="print-all-pages" style={{ display: 'none' }}>
  {Array.from({ length: totalPages }).map((_, pageIdx) => (
    <div key={pageIdx}>
      <QuotePreview 
        currentPageIndex={pageIdx}
        totalPages={totalPages}
        isForPrint={true}
      />
      {pageIdx < totalPages - 1 && <div style={{ pageBreakAfter: 'always' }} />}
    </div>
  ))}
</div>
```

---

## Casos de Uso

### Caso 1: Crear cotización con 8 items
1. Agregas los 8 items en "Página 1"
2. Haces click en "Imprimir / Guardar PDF"
3. Se imprime 1 página con los 8 items + totales + métodos de pago

### Caso 2: Crear cotización con 16 items
1. Agregas los primeros 8 items → automáticamente aparece "Página 2"
2. Cambias a "Página 2" y agregas 8 items más
3. Al imprimir → Página 1 (8 items) + Página 2 (8 items + totales + métodos de pago)

### Caso 3: Borrar item de página 2
1. Tienes 2 páginas (16 items)
2. Estás en "Página 2"
3. Haces click en "Quitar" para un item
4. Se borra → quedan 15 items → siguen siendo 2 páginas
5. Permaneces en "Página 2" mostrando los 7 items restantes

### Caso 4: Borrar todos los items de página 2
1. Tienes 9 items (Página 1: 8, Página 2: 1)
2. Estás en "Página 2"
3. Borras el último item
4. Quedan 8 items → se convierte en 1 sola página
5. Automáticamente te regresa a "Página 1" (la única)

---

## Características Implementadas

✅ Máximo 8 items por página  
✅ Tabs automáticos cuando superas 8 items  
✅ Navegación entre páginas en editor  
✅ Vista previa solo de página actual  
✅ Impresión de todas las páginas  
✅ Totales y métodos de pago solo en última página  
✅ Cálculos correctos (totales globales en todos los items)  
✅ Validación automática de página al borrar items  
✅ Layout A4 (210mm × 297mm) con CSS de impresión  

---

## Próximas Mejoras Opcionales

- [ ] Permitir reordenar items entre páginas (mover a página anterior/siguiente)
- [ ] Guardar plantilla de cotización (guardar/cargar JSON)
- [ ] Exportar a PDF automáticamente (sin diálogo de impresión)
- [ ] Añadir número de página en footer ("Página 1 de 2")
- [ ] Permitir personalizar items por página (no siempre 8)

---

## Debugging

### Si los items no aparecen después de agregar/borrar:
1. Abre DevTools (F12) → Console
2. Verifica que `selectedItemsPage` sea válido
3. Verifica que `totalPages` sea correcto
4. Recarga la página (Ctrl + R)

### Si la impresión no sale bien:
1. En el diálogo de impresión, verifica:
   - ✓ "Imprimir fondos/colores de fondo" activado
   - ✓ Márgenes en 10mm (o sin márgenes)
   - ✓ Orientación Portrait (A4)
2. Intenta "Guardar como PDF" en lugar de imprimir

---

¡Listo! Tu cotizador ahora maneja múltiples páginas automáticamente. 🎉
