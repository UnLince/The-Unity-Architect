\# Submódulo: Profiling de Memoria y Recolección de Basura (GC)

\*\*Propósito:\*\* Establecer un protocolo estricto para que el agente diagnostique tirones de framerate (stutters), picos de CPU por el Garbage Collector (GC Spikes) y fugas de memoria (Memory Leaks) basándose en métricas reales, no en suposiciones.

\*\*Cuándo usarlo:\*\* El usuario reporta caídas repentinas de FPS, el juego se congela intermitentemente, el uso de RAM crece sin control, o la consola muestra advertencias de memoria (Out of Memory).

\---

\## 1. La Regla de Oro del Rendimiento

\*\*Prohibición Estricta:\*\* NUNCA sugieras micro-optimizaciones (como cambiar un \`for\` por un \`foreach\` o hacer bitwise operations) si no tienes pruebas de que esa línea exacta de código es el cuello de botella.

\* \[cite\_start\]\*\*Acción obligatoria:\*\* Exige al usuario que abra el \*\*CPU Usage Profiler\*\* o el \*\*Memory Profiler\*\* y te indique exactamente qué método está alocando memoria o consumiendo milisegundos\[cite: 2404\].

\---

\## 2. Erradicación de "GC Spikes" (Basura en el Gameplay Loop)

\[cite\_start\]El recolector de basura de Unity (Boehm-Demers-Weiser) detiene la ejecución del juego para limpiar la memoria\[cite: 2437, 2438\]. \[cite\_start\]El objetivo en el bucle principal de juego (ej. \`Update\`) debe ser \*\*0 GC.Alloc\*\*\[cite: 2462\].

Si el usuario reporta tirones, busca estos sospechosos habituales en los bucles que se ejecutan cada frame:

\* \*\*Strings:\*\* En C#, los strings son inmutables. \[cite\_start\]Concatenar strings en un \`Update\` (\`"Puntos: " + score\`) aloca memoria en el \*managed heap\* en cada frame\[cite: 2441, 2442\]. \[cite\_start\]Instruye al usuario a usar \`StringBuilder\` o actualizar el texto solo cuando el valor cambie\[cite: 2444\].

\* \[cite\_start\]\*\*Boxing:\*\* Pasar un \*value type\* (como un \`int\` o \`struct\`) a un método que espera un \*reference type\* (\`object\`) crea una copia en el heap\[cite: 2450, 2452\].

\* \*\*Corrutinas:\*\* Retornar \`new WaitForSeconds(1f)\` dentro del \`yield\` crea basura. \[cite\_start\]Instruye al usuario a almacenar en caché (cachear) el objeto \`WaitForSeconds\` al inicio y reutilizarlo\[cite: 2454, 2455\].

\* \*\*LINQ y Regex:\*\* El uso de LINQ (\`.Where()\`, \`.ToList()\`) o expresiones regulares en métodos de actualización continua genera basura oculta y es lento. \[cite\_start\]Exige reemplazarlos por bucles \`for\` o \`while\` tradicionales con colecciones cacheadas\[cite: 2456, 2457\].

\---

\## 3. Fugas de Memoria (Memory Leaks) y el Memory Profiler

\[cite\_start\]Las fugas en Unity suelen ocurrir al cambiar de escena o destruir objetos que otros sistemas siguen referenciando\[cite: 2396, 2397\]. Si la memoria crece constantemente:

\* \[cite\_start\]\*\*No adivines:\*\* Pide al usuario que tome dos "Snapshots" con el \*\*Memory Profiler package\*\* (uno antes del pico de memoria y otro después) y que use la vista de comparación (Compare mode)\[cite: 2364, 2365\].

\* \[cite\_start\]\*\*Shortest Path to Root:\*\* Instruye al usuario a buscar el objeto filtrado en la pestaña "Shortest Path To Root"\[cite: 4744, 4745\]. \[cite\_start\]Esto le dirá exactamente qué cadena de referencias (ej. un evento estático, un Singleton) está evitando que el objeto sea destruido\[cite: 4745, 4746\].

\* \*\*Impact Analysis:\*\* Pide al usuario que revise la métrica de "Impact" del objeto. \[cite\_start\]Esta métrica calcula la huella real del objeto incluyendo la memoria proporcional de todo lo que referencia\[cite: 4750, 4751\].

\---

\## 4. Uso del Project Auditor (Análisis Estático)

\[cite\_start\]Para proyectos masivos donde encontrar cada \`GC.Alloc\` a mano es imposible, recomienda el \*\*Project Auditor\*\* (introducido en Unity 6.1)\[cite: 2412\].

\* \[cite\_start\]El Project Auditor escanea el código sin necesidad de entrar a Play Mode y genera un reporte con todas las líneas que causan alocaciones gestionadas (managed allocations)\[cite: 2413, 2414\].

\---

\## 5. La Solución: Object Pooling

\[cite\_start\]Si el problema es el costo de instanciar y destruir repetidamente objetos (como balas o enemigos), la única respuesta arquitectónica aceptable es el \*\*Object Pooling\*\*\[cite: 2471\].

\* Asegúrate de que el usuario utilice la API nativa de Unity \`UnityEngine.Pool\` (introducida en versiones recientes) en lugar de crear listas genéricas desde cero.