---
name: unity-debug-scientific-method
description: El núcleo de la depuración sistemática. Guía para construir logs masivos, aislar síntomas y realizar experimentos controlados.
tags: [debugging, methodology, logs]
---

# Submódulo: Método Científico y Logs de Telemetría

## 1. El Log como Instrumento de Medición

En Unity, un log no es solo una frase, es un punto de datos.

*   **Pide Contexto:** Un log sin timestamp o frame id es inútil. Instruye al usuario a usar `Time.frameCount` en sus logs si el bug depende del tiempo.
*   **Logs Condicionales:** Para evitar el spam en consola, sugiere usar `Debug.Log` condicionales.
*   **Por qué:** Saturar la consola con 1000 mensajes por segundo bloquea el Editor de Unity y oculta el verdadero error detrás de cuellos de botella de I/O.

---

## 2. Aislamiento Científico

*   **Experimento Controlado:** Antes de cambiar el código, pide desactivar todos los GameObjects sospechosos excepto el núcleo del problema. 
*   Si el bug desaparece al desactivar el sistema X, el culpable es la interacción entre X e Y, no necesariamente el código de Y.