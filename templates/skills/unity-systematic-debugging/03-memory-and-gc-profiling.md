---
name: unity-debug-memory-gc
description: Guía avanzada para el Unity Profiler. Identificación de fugas de memoria, GC Alloc excesivo y cuellos de botella de CPU.
tags: [debugging, profiling, performance, memory]
---

# Submódulo: Memoria y Perfilado de GC

## 1. El Profiler es el único diagnóstico real

NUNCA adivines un problema de rendimiento basándote en la "sensación" de lag.

*   **Gasto de GC (Garbage Collector):** Busca las barras turquesas en el CPU Profiler. Identifica qué script está alocando memoria cada frame.
*   **Deep Profile:** Adviértele al usuario que "Deep Profile" ralentiza masivamente el Editor, pero es necesario para encontrar el método exacto en jerarquías profundas.

---

## 2. Leaks (Fugas de Memoria)

*   **Eventos no desuscritos:** El culpable #1 de fugas en C#. Asegúrate de que cada `OnEnable` tenga su correspondiente desuscripción en `OnDisable`.
*   **Por qué:** Una referencia que queda colgada evita que el GC limpie el objeto, acumulando RAM hasta el crash en dispositivos móviles.