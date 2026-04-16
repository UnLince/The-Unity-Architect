---
name: unity-debug-rendering-gpu
description: Identificación de cuellos de botella visuales. Diferencia entre Vertex Bound, Pixel Bound y problemas de Batching.
tags: [debugging, rendering, gpu, shaders]
---

# Submódulo: Renderizado y Cuellos de Botella de GPU

## 1. Identificar el Origen: CPU vs GPU

*   Usa el "Frame Debugger" de Unity.
*   **Draw Calls:** Si el número de Draw Calls es superior a 200 en móvil o 2000 en PC, el problema es el **Batching**.
*   **Por qué:** Cada Draw Call es una llamada que la CPU debe preparar para la GPU. Reducirlas (vía Static/Dynamic Batching o GPU Instancing) es la forma más rápida de recuperar FPS.

---

## 2. Shaders y Overdraw

*   Muestra el modo de visualización "Overdraw" en la Scene View.
*   Si la pantalla se ve blanca/brillante, hay demasiadas partículas o capas de transparencia superpuestas. Reducir la densidad de partículas es más efectivo que optimizar el código en este caso.