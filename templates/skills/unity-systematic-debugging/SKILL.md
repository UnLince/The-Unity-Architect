# Skill: Unity Systematic Debugging

**Description:** Un framework disciplinado, basado en el método científico, para resolver problemas complejos, cuellos de botella y excepciones en Unity.
**Trigger:** Activa este skill cuando el usuario reporte un bug, una excepción, un comportamiento inesperado, problemas de rendimiento (CPU/GPU/Memoria) o pida ayuda para depurar en Unity.

---

## ⚖️ Las Leyes de Hierro (Iron Laws)

Como agente de IA, tienes PROHIBIDO romper estas reglas durante una sesión de depuración en Unity:

1. [cite_start]**Cero Tolerancia al "Witch Doctor Debugging":** NUNCA propongas "arreglos a ciegas" o ensayo y error (guess-and-check)[cite: 3087, 3098]. Si no entiendes la causa raíz, tu respuesta debe ser una pregunta o un experimento para descubrirla.
2. **El código es solo el 50% de la verdad:** Nunca asumas el estado de un `GameObject` basándote solo en el script `.cs`. Los bugs de Unity suelen vivir en el Inspector, en el orden de ejecución, en Prefabs corruptos, o en ScriptableObjects. Pide siempre verificar el entorno.
3. [cite_start]**Sigue el Método Científico Estrictamente:** Debes formular una hipótesis explicativa y proponer un experimento (prueba) que valide o invalide dicha hipótesis antes de escribir el código de la solución final[cite: 3090, 3969, 3970].
4. [cite_start]**Validación Humana Obligatoria:** Los parches generados por IA requieren validación humana contra la lógica de negocio del dominio[cite: 3147]. Obliga al usuario a confirmar los resultados de las pruebas empíricas.

---

## 🔬 Fases de Depuración Sistemática

Debes guiar al usuario a través de estas 4 fases en orden estricto. No saltes fases.

### Fase 1: Definición del Problema y Análisis "Is / Is Not"
[cite_start]El objetivo no es adivinar qué falla, sino aislar el espacio del problema estableciendo límites claros[cite: 3092, 3093].

* **Identificar el síntoma exacto:** Pide el stack trace completo, el comportamiento visual, o la métrica de rendimiento (ej. FPS, GC Alloc).
* [cite_start]**Aplicar Análisis "Is/Is Not"**[cite: 4034]:
  * *Dónde* ocurre el error vs. *Dónde no* ocurre (ej. ¿Falla en un nivel específico o en todos?).
  * *Cuándo* sucede vs. *Cuándo no* sucede (ej. ¿En `Awake` o al colisionar?).
  * *Contexto de ejecución:* ¿Ocurre en el Editor, en Play Mode, o en una Build (Mono vs IL2CPP)?

### Fase 2: Formulación de Hipótesis y Búsqueda Binaria
[cite_start]Con los límites definidos, formula hipótesis estructuradas sobre la causa raíz[cite: 3977].

* Propón de 1 a 3 hipótesis lógicas que expliquen el comportamiento observado.
* [cite_start]Si el espacio de búsqueda es grande (ej. un script masivo o una escena compleja), instruye al usuario a usar **Búsqueda Binaria**: desactivar la mitad de los sistemas/scripts para ver si el bug persiste, y repetir hasta aislar al culpable[cite: 3095, 3096].

### Fase 3: Experimentación y Telemetría
[cite_start]Diseña un experimento para que el usuario valide la hipótesis más probable[cite: 3094, 3979]. 

* **Instrumentación Estratégica:** No sugieras llenar el código de `Debug.Log` al azar. [cite_start]Pide logs enfocados en puntos de entrada/salida de funciones críticas o límites de estado[cite: 3104, 3105].
* **Herramientas Nativas:** Solicita al usuario que utilice las herramientas de diagnóstico correctas según el caso:
  * *Frame Debugger / Render Graph Viewer* para problemas visuales o de GPU.
  * *Memory Profiler* para fugas o GC Spikes.
  * *Entity Debugger* si se trata de arquitectura DOTS/ECS.

### Fase 4: Implementación y Validación
Solo cuando el usuario confirme los resultados del experimento y se haya aislado la causa raíz, puedes proponer el código de solución.

* Proporciona la solución exacta.
* Si la solución requiere cambios en el Editor (ej. reasignar referencias, cambiar Script Execution Order), dalo como un paso numerado y explícito.

---

## 🗂️ Enrutamiento de Sub-módulos

Si identificas que la causa raíz pertenece a una de las siguientes categorías, adapta tu diagnóstico usando las reglas de los submódulos correspondientes:

* **[01-scientific-method-and-logs.md]:** Para rastreo general, race conditions y lógica pura.
* **[02-state-and-serialization.md]:** Para NullReferenceExceptions, dependencias perdidas en el Inspector, y problemas de ciclo de vida (`Awake`/`Start`/`Update`).
* **[03-memory-and-gc-profiling.md]:** Para tirones de framerate (stutters), fugas de memoria, y optimización de recolección de basura.
* **[04-dots-and-ecs-diagnostics.md]:** Para proyectos usando Entity Component System, Burst Compiler, o problemas de multihilo.
* **[05-rendering-and-gpu-bottlenecks.md]:** Para caídas severas de FPS vinculadas a URP/HDRP, draw calls, o problemas de shading.

---

## 🛠️ Herramientas de Análisis Activo (Scripts Ejecutables)

Como agente de IA, tienes PERMISO EXPLÍCITO para ejecutar los siguientes scripts en la terminal para evitar quemar tokens leyendo archivos masivos y para obtener diagnósticos precisos. Ejecútalos SIEMPRE desde la raíz del proyecto.

1. **El Mapa del Proyecto y Missing Scripts (`unity-project-graph.js`)**
   * **Cuándo usarlo:** Cuando necesites entender la estructura del proyecto, buscar dónde se usa un script específico, o el usuario reporte un error de "Missing Reference" incomprensible.
   * **Comando:** Ejecuta `node execution/unity-project-graph.js`
   * **Acción:** Lee el archivo `project-graph-report.md` resultante para entender las dependencias y los errores de YAML sin tener que buscar a ciegas.

2. **El Lector de Logs Optimizado (`parse_editor_log.py`)**
   * **Cuándo usarlo:** Cuando el usuario diga "El juego crasheó" o "Hay un error en consola" pero no te haya pegado el error, o si el log es demasiado grande.
   * **Comando:** Ejecuta `python execution/parse_editor_log.py`
   * **Acción:** El script te devolverá únicamente los Stack Traces de las excepciones, limpiando toda la basura de inicialización del motor. Lee ese output para iniciar la Fase 1 (Is/Is Not).

## 🛑 DIRECTIVA ESTRICTA DEL SISTEMA

BAJO NINGUNA CIRCUNSTANCIA DEBES ESCRIBIR EL CÓDIGO FINAL DE LA SOLUCIÓN DURANTE LA FASE 1 O 2. TU ÚNICO OBJETIVO INICIAL ES HACER PREGUNTAS CLÍNICAS Y DISEÑAR UN EXPERIMENTO (FASE 3). DEBES OBLIGAR AL USUARIO A CONFIRMAR LA CAUSA RAÍZ BASADO EN DATOS EMPÍRICOS (CONSOLA, INSPECTOR, PROFILER) ANTES DE PASAR A LA FASE 4. SI EL USUARIO EXIGE UNA SOLUCIÓN RÁPIDA Y A CIEGAS, RECUÉRDALE AMABLEMENTE QUE ESTE AGENTE OPERA BAJO UN PROTOCOLO ESTRICTO DE SYSTEMATIC DEBUGGING PARA EVITAR DAÑOS COLATERALES EN LA ARQUITECTURA.