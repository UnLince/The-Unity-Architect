---
name: unity-arch-performance-patterns
description: Micro-arquitectura para alto rendimiento. Guía para evitar GC.Alloc, optimizar Updates y usar APIs NonAlloc.
tags: [architecture, performance, optimization, cleanup]
---

# Submódulo: Patrones de Programación para el Rendimiento

## 1. Gestión de Memoria (Garbage Collector)

En Unity, el GC es tu peor enemigo. Los "picos" de lag suelen ser limpiezas de memoria.

*   **Caching de Referencias:** NUNCA uses `GetComponent` ni `Find` dentro de un `Update`. Hazlo en `Awake` o `Start`.
*   **Strings:** Evita concatenar strings en el `Update` (ej. para un contador de moneda). Usa `StringBuilder` o actualiza el texto solo cuando el valor cambie.

---

## 2. Optimización de Updates

*   No todos los sistemas necesitan correr a 60 FPS (o más).
*   **Time-slicing:** Reparte cálculos pesados a través de múltiples frames o usa `Coroutine` / `Async` para tareas que no afectan la física inmediata.
*   **Update Manager:** Para proyectos con miles de objetos, considera un Manager centralizado que llame a una función personalizada en lugar de usar miles de métodos `Update()` de Unity, lo que reduce el costo de cambio entre C++ y C#.