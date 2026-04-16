---
name: unity-debug-dots-ecs
description: Diagnóstico de sistemas multihilo y entidades (DOTS/ECS). Guía para lidiar con Race Conditions y problemas de Burst Compiler.
tags: [debugging, dots, ecs, multithreading]
---

# Submódulo: Diagnóstico DOTS y ECS

## 1. Depuración Multihilo

El `Debug.Log` estándar es peligroso dentro de Jobs.

*   **Race Conditions:** Explica que si dos hilos intentan escribir en el mismo dato, el resultado es aleatorio.
*   Usa atributos `[ReadOnly]` en los Jobs siempre que sea posible para evitar que el compilador se queje por dependencias de escritura.

---

## 2. Burst Compiler

*   Si el bug solo ocurre en Build pero no en Editor, prohíbe el uso de Burst temporalmente para ver si el error persiste.