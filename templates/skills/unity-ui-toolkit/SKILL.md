# Skill: Unity UI Toolkit - Best Practices & Performance (Unity 6+)

> Guía maestra para el desarrollo de interfaces de alto rendimiento usando UI Toolkit.  
> Basada en estándares de Unity 6 y optimización para hardware.

---

## 🏗️ Arquitectura y Estándares

### 1. Flexbox-First (Yoga Engine)
*   **Comportamiento por defecto:** La orientación es `flex-direction: column`.
*   **No use Inline Styles:** Todos los estilos deben vivir en archivos `.uss`. Use variables en `:root` para tokens de diseño (colores, espaciado).
*   **Componentes Custom (Unity 6):** Use los atributos `[UxmlElement]` y `[UxmlAttribute]` en clases `partial`. Evite el boilerplate antiguo de `UxmlFactory`.

### 2. UI Toolkit vs uGUI (¿Cuándo usar qué?)
*   **UI Toolkit (Retained Mode):** Ideal para HUDs estáticos, Menús, Inventarios y herramientas del Editor.
*   **uGUI (Immediate/GameObject Mode):** **Obligatorio** para UI en el espacio del mundo (World Space) con alta densidad o transformaciones complejas (ej. barras de vida sobre 100 enemigos), a menos que se use la nueva integración de World Space de Unity 6 con extrema precaución.

---

## ⚡ Optimización de Rendimiento (Critical)

### 1. Animaciones y Transformaciones por GPU
*   **Regla de Oro:** Nunca anime propiedades de layout (`width`, `height`, `margin`, `padding`, `top`, `left`). Esto fuerza un "Layout Recalculation" de todo el árbol en la CPU.
*   **Solución:** Use transformaciones de GPU: `translate`, `rotate`, `scale`.
*   **Usage Hints:** Active `UsageHints.DynamicTransform` en elementos que se mueven o animan frecuentemente para que Unity los trate eficientemente en la GPU.

### 2. Gestión de Paneles y Draw Calls
*   **UIDocument:** Evite tener múltiples `UIDocument` para elementos pequeños. Agrupe tantos elementos como pueda bajo un solo `UIDocument` para maximizar el batching.
*   **Vertex Budget:** Si su UI es compleja y ve parpadeos o elementos desapareciendo, aumente el **Vertex Budget** en el asset de `Panel Settings`.
*   **Texturas y Atlasing:** Use el **Sprite Packer** para asegurar que todos los iconos de la UI vivan en el mismo atlas, evitando rupturas de batching.

### 3. "Smart Hiding" (Ocultamiento Inteligente)
*   **display: none** vs **visibility: hidden**:
    *   `display: none`: Remueve el elemento del cálculo de layout (más eficiente si no cambia seguido).
    *   `visibility: hidden`: El elemento sigue ocupando espacio en el layout pero no se renderiza.
*   **No use opacity: 0** para ocultar elementos: Siguen procesando eventos y gastando recursos de renderizado.

---

## 🛠️ Herramientas de Diagnóstico
1.  **UI Toolkit Debugger:** Para inspeccionar el visual tree y tiempos de layout.
2.  **Panel Settings -> Live Reload:** Manténgalo activo durante el desarrollo para ver cambios en USS/UXML al instante.
3.  **Frame Debugger:** Crucial para identificar por qué se rompe el batching entre elementos.

---

## 🚫 Errores Comunes (Anti-Patterns)
*   **Deep Nesting:** Evite jerarquías excesivamente profundas de VisualElements. Cada nivel añade costo al cálculo de Flexbox.
*   **UxmlFactory manual:** No escriba `UxmlFactory` manualmente en Unity 6; deje que el generador de código lo haga por usted.
*   **Anclajes complejos en World Space:** Evite layouts dinámicos (Flex) en objetos que se mueven rápido en el espacio 3D.
