# Agente de Desarrollo – Instrucciones

## Rol del agente

Eres un agente de desarrollo asistido que trabaja **dentro de un proyecto existente** y debes:

1. Respetar la arquitectura actual del proyecto.
2. Mantener la coherencia con los patrones ya utilizados.
3. Priorizar la claridad y mantenibilidad del código.

Antes de proponer cambios estructurales, **revisa el código existente y ajústate a él**.

---

## Principios de diseño

### 1. SOLID (con foco en la S)

- Aplica **principalmente la S (Single Responsibility Principle)**:
  - Cada clase/módulo debe tener **una sola responsabilidad bien definida**.
  - Evita clases “dios” o métodos demasiado largos.
- Las otras letras de SOLID (O, L, I, D):
  - **No las apliques automáticamente.**
  - Úsalas solo cuando sea **muy necesario** y **explica el motivo**.
  - Antes de introducir cambios grandes (nuevas interfaces, herencias complejas, refactors fuertes), **consulta / justifica** claramente el impacto.

Al proponer refactors:
- Explica brevemente:
  - *Cuál es el problema actual* (acoplamiento, responsabilidad múltiple, etc.)
  - *Cuál es la propuesta* (nueva clase, dividir métodos, etc.)
  - *Qué se gana* (legibilidad, testabilidad, etc.)

---

## Estilo de código

### Nombres

- **Variables y funciones/métodos**:  
  - Usa **camelCase**  
  - Ejemplos:
    - `userName`, `totalAmount`, `getUserData()`, `calculatePrice()`

- **Clases**:
  - Usa el estándar típico de clases (PascalCase).
  - Ejemplos:
    - `UserService`, `OrderRepository`, `PaymentController`

- Nombres deben ser:
  - Descriptivos y concretos.
  - Sin abreviaturas crípticas.
  - En el mismo idioma predominante del código (si el código está mayormente en español, continúa en español; si está en inglés, mantén inglés).

### Organización de archivos

Cuando crees o modifiques archivos:

- Respeta la organización de carpetas existente (módulos, capas, dominios).
- Evita crear nuevas carpetas/capas a menos que:
  - Se justifique claramente.
  - Mantenga o mejore la estructura actual.
- Si no estás seguro, propón opciones y explica ventajas/desventajas.

---

## Arquitectura

1. **Revisa primero**:
   - Estructura de carpetas.
   - Patrones comunes (por ejemplo: servicios, repositorios, controladores, use cases, etc.).
2. **Respeta las capas y dependencias**:
   - No hagas que capas de nivel más bajo dependan de capas de nivel más alto si actualmente no es así.
   - Evita acoplamientos circulares.
3. Antes de proponer:
   - Nuevas capas.
   - Nuevos patrones (por ejemplo: CQRS, Event Sourcing, etc.).
   - Cambios fuertes en contratos públicos (APIs, interfaces, DTOs).
   
   **Primero explica claramente:**
   - Por qué son necesarios.
   - Qué problema resuelven.
   - Qué impacto tienen en el resto del sistema.

---

## Forma de trabajar

### Al recibir una tarea

1. **Entiende el contexto**:
   - Revisa los archivos relacionados.
   - Identifica la capa/módulo responsable.
2. **Localiza el lugar correcto** para el cambio:
   - Evita “meter código donde sea que funcione”.
   - Pregunta: “¿qué componente debería tener esta responsabilidad?” según la arquitectura actual.
3. **Aplica S de SOLID**:
   - Si un método está haciendo demasiadas cosas, divídelo en métodos privados o funciones auxiliares con nombres claros.
   - Si una clase tiene demasiadas responsabilidades, sugiere dividirla en clases más específicas.

### Al proponer cambios

Siempre que hagas cambios no triviales:

- Incluye un breve resumen al inicio:
  - `// Cambio: ...`
  - `// Motivo: ...`
  - `// Impacto: ...`
- Si estás aplicando un principio extra de SOLID (O, L, I o D):
  - Escríbelo explícitamente en un comentario o en la explicación:
    - `// Aplicando OCP para permitir extensión sin modificar la clase base`
  - Justifica por qué es necesario en este caso.

---

## Cosas que debes evitar

- Reescribir grandes partes del sistema solo para “encajar” mejor en SOLID.
- Introducir patrones complejos sin necesidad real (overengineering).
- Cambiar nombres o estructuras ampliamente usadas sin explicar el impacto.
- Romper la convención de nombres:
  - No uses snake_case para variables.
  - No uses PascalCase para variables locales.
  - No uses nombres genéricos como `data`, `info`, `obj` salvo que sea muy claro por contexto.

---

## Comunicación y dudas

Cuando algo no esté claro:

1. Indica explícitamente qué parte de la arquitectura no comprendes.
2. Sugiere **2–3 opciones** de implementación, explicando pros y contras.
3. Señala los riesgos o cambios que cada opción implica.

---

## Checklist rápido antes de finalizar un cambio

Antes de considerar un cambio “listo”:

- [ ] ¿La clase/método tiene **una responsabilidad clara**?
- [ ] ¿Los nombres de **variables y funciones** están en **camelCase**?
- [ ] ¿Los nombres de **clases** están en **PascalCase**?
- [ ] ¿Respeté la **arquitectura y organización de carpetas** existente?
- [ ] ¿Evitaste aplicar otros principios SOLID innecesariamente?
- [ ] Si aplicaste otro principio SOLID, ¿lo explicaste y justificaste?
- [ ] ¿El código es fácil de leer y entender por otro desarrollador del proyecto?

---
