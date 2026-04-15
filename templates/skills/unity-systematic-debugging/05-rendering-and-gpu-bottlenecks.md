\# Submódulo: Diagnóstico de Rendering y Cuellos de Botella GPU

\*\*Propósito:\*\* Proporcionar un marco sistemático para diagnosticar problemas visuales, caídas de framerate causadas por la GPU y cuellos de botella en el Render Thread, utilizando las herramientas modernas de URP/HDRP en Unity 6.

\*\*Cuándo usarlo:\*\* El usuario reporta problemas visuales (glitches, luces que no funcionan), caídas de FPS que no están en el Main Thread, uso excesivo de VRAM, o está optimizando gráficos para plataformas móviles/consolas.

\---

\## 1. Identificando al Culpable (El Cuello de Botella)

Antes de tocar un solo material o luz, debes obligar al usuario a confirmar si el problema está en el CPU (preparando la escena) o en la GPU (dibujando la escena).

\*\*Regla de Hierro:\*\* Pide al usuario que abra el \*\*CPU Profiler (Timeline View)\*\* y el \*\*Frame Debugger\*\* para observar los siguientes marcadores:

\* \*\*GPU-Bound:\*\* Si el Main Thread está inactivo y muestra bloques masivos de \`Gfx.WaitForPresentOnGfxThread\`, la GPU no puede seguir el ritmo de la CPU. El problema son los gráficos (shaders pesados, overdraw, resolución).

\* \*\*Render Thread-Bound:\*\* Si el Render Thread está saturado procesando comandos (\`Camera.Render\`), el problema es la cantidad de objetos, luces o cámaras activas que la CPU está intentando preparar.

\* \*\*Draw Call-Bound:\*\* Si la métrica de \*Batches\* o \*SetPass Calls\* es ridículamente alta.

\---

\## 2. El Arsenal de Optimización Gráfica (Unity 6)

Si el usuario tiene un cuello de botella en el Render Thread, no sugieras soluciones obsoletas. Debes guiar al usuario hacia las soluciones modernas de Unity 6:

\* \*\*Demasiadas Cámaras:\*\* Cada cámara invoca todo el pipeline de renderizado (culling, sorting, batching). Recomienda consolidar cámaras si es posible.

\* \*\*SRP Batcher:\*\* Es el estándar en URP/HDRP. Reduce la carga de CPU almacenando datos de materiales en la memoria de la GPU. Pide al usuario que verifique en el \*Frame Debugger\* si sus shaders son compatibles.

\* \*\*GPU Resident Drawer:\*\* En Unity 6, esta herramienta utiliza \*GPU Instancing\* automático y \*GPU Occlusion Culling\* para agrupar GameObjects y reducir drásticamente el trabajo de la CPU.

\* \*Diagnóstico:\* Pregunta si el usuario tiene el \`Forward+\` rendering path, y si el objeto tiene un \`Mesh Renderer\` compatible (sin MaterialPropertyBlocks ni Light Probes en modo Proxy Volume).

\---

\## 3. Diagnóstico de Flujos de Renderizado (Render Graph)

En Unity 6, URP y HDRP utilizan el sistema \*\*Render Graph\*\*. Si el usuario tiene problemas con un pase de renderizado personalizado (Custom Render Pass) o un efecto a pantalla completa que no se dibuja:

\* \*\*Herramienta Obligatoria:\*\* Pide al usuario que abra el \*\*Render Graph Viewer\*\* (\`Window > Analysis > Render Graph Viewer\`).

\* \*\*Análisis:\*\* Instrúyele a buscar el pase fallido en el visor.

\* ¿Está el pase en color negro (Cullled)? Significa que el Render Graph determinó que nadie consume su salida, por lo que no se ejecutó.

\* ¿Cómo son los bloques de acceso al recurso (Resource Access Blocks)? Revisa si el pase tiene acceso de lectura (azul/verde) o escritura (rojo) al recurso (ej. textura temporal) esperado.

\---

\## 4. Resolución de Problemas de Iluminación y Sombras

La iluminación suele ser el asesino del rendimiento y de la calidad visual.

\* \*\*Luces Dinámicas vs Horneadas (Baked):\*\* Si hay problemas de rendimiento extremos en móviles, exige que el usuario verifique si sus luces direccionales o puntuales están en modo \`Realtime\` y sugiere cambiarlas a \`Mixed\` o \`Baked\`.

\* \*\*Adaptive Probe Volumes (APV):\*\* En Unity 6, APV es el estándar para iluminación global indirecta. Si el usuario reporta "fugas de luz" (light leaks), sugiérele configurar máscaras de capas de renderizado (rendering layer masks) para prevenirlo, en lugar de poner objetos bloqueadores invisibles.

\---

\## 5. El Límite Móvil (Bandwidth y Overdraw)

Si el target es \*\*Móvil/Quest\*\*:

\* \*\*Overdraw:\*\* Pide al usuario que verifique el \*Overdraw\* (cuántas veces se dibuja el mismo píxel). Recomienda usar la vista de Overdraw en el Editor. Los sistemas de partículas pesados y las transparencias masivas son los principales sospechosos.

\* \*\*Ancho de Banda (Bandwidth):\*\* Los dispositivos móviles sufren por el ancho de banda de memoria. Sugiere reducir la resolución de las sombras, forzar la compresión de texturas (ASTC) y minimizar el post-procesado pesado (como el Bloom o el Depth of Field).