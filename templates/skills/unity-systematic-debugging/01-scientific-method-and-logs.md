\# Submódulo: Método Científico, Aislamiento y Logs Estratégicos

\[cite\_start\]\*\*Propósito:\*\* Proporcionar al agente de IA un marco estricto para aislar la causa raíz de un bug de lógica, físicas o estado en Unity utilizando el análisis diferencial ("Is/Is Not") y la búsqueda binaria\[cite: 3095, 3099\].

\*\*Cuándo usarlo:\*\* Cuando el bug es reproducible pero la ubicación exacta en el código o en la escena es desconocida.

\---

\## 1. El Marco "Is / Is Not" (Aislamiento del Problema)

\[cite\_start\]Antes de leer código fuente, debes hacer preguntas para delimitar el espacio del problema. Pide al usuario que defina las siguientes fronteras:

\* \[cite\_start\]\*\*Ubicación (Where):\*\* ¿El bug ocurre en una escena específica, en todas las escenas, o solo en un Prefab particular instanciado dinámicamente? \[cite: 3096\]

\* \[cite\_start\]\*\*Temporalidad (When):\*\* ¿Ocurre en el frame 1 (\`Awake\`/\`Start\`), en cada frame (\`Update\`), durante la simulación física (\`FixedUpdate\`), o tras un evento específico (ej. carga de nivel asíncrona)? \[cite: 3096\]

\* \*\*Entorno (Context):\*\* ¿El bug ocurre solo en el Editor, solo en la Build, o en ambos? \[cite\_start\]¿Falla solo en IL2CPP o también en Mono? \[cite: 3096\]

\* \[cite\_start\]\*\*Magnitud (How much):\*\* ¿Falla el 100% de las veces, de forma intermitente (race condition), o bajo condiciones de estrés? \[cite: 3096\]

\*\*Tu tarea:\*\* Construye una tabla mental con lo que el bug ES y lo que NO ES. La diferencia entre ambos te dará la pista de qué sistema está fallando.

\---

\## 2. Protocolo de Búsqueda Binaria (Binary Search)

\[cite\_start\]Si el usuario tiene un proyecto masivo o un script de miles de líneas y no sabe dónde está el error, instruye la técnica de Búsqueda Binaria\[cite: 3098, 3099\]:

1\. \*\*Aislamiento de Escena:\*\* Pide al usuario que desactive el 50% de los GameObjects raíz en la escena. Si el bug persiste, está en la mitad activa. \[cite\_start\]Repetir hasta aislar el GameObject culpable\[cite: 3099\].

2\. \*\*Aislamiento de Componentes:\*\* Una vez aislado el GameObject, pide desactivar la mitad de sus componentes/scripts.

3\. \[cite\_start\]\*\*Aislamiento de Código:\*\* Si el bug está en un script grande, pide comentar la mitad del código dentro del método sospechoso (ej. \`Update\`) o insertar un \`return;\` a la mitad de la función para ver si el estado corrupto ya ocurrió antes de ese punto\[cite: 3099, 4395\].

\---

\## 3. Instrumentación y Logs Estratégicos

\[cite\_start\]En Unity 6 y proyectos modernos, inundar la consola con \`Debug.Log("Llegó aquí")\` es ineficiente y confunde el contexto\[cite: 3107\].

\[cite\_start\]Si necesitas proponer logs para probar una hipótesis, debes proponer \*\*Logs Estratégicos\*\*\[cite: 3108\]:

\* \*\*Límites de Estado:\*\* Imprime el estado ANTES y DESPUÉS de una mutación importante.

\* \[cite\_start\]\*Ejemplo correcto:\* \`Debug.Log($"\[PlayerHealth\] Damage Taken: {amount}. Health Before: {currentHealth}, Health After: {currentHealth - amount}");\` \[cite: 4405\]

\* \*\*Validación de Entradas/Salidas:\*\* Comprueba si los datos que entran a un método ya vienen corruptos.

\* \*\*Uso de \`Debug.Assert\`:\*\* Instruye al usuario a usar aserciones de Unity para romper la ejecución (en el Editor) si una condición crítica no se cumple, en lugar de dejar que el bug se propague en silencio.

\* \*Ejemplo:\* \`Debug.Assert(targetTransform != null, "Target Transform is null in Chaser.cs during Awake!", this);\`

\* \*\*Pausado Automático:\*\* Si el bug ocurre en un frame muy específico que es difícil de atrapar a mano, sugiere añadir \`Debug.Break();\` condicionalmente para pausar el Editor en el frame exacto del error.

\---

\## 4. Backtracing (Rastreo Inverso)

\[cite\_start\]Si el usuario te proporciona una Excepción (ej. \`IndexOutOfRangeException\`), no mires solo la línea donde explotó\[cite: 3103\].

1\. Lee el \*\*Call Stack\*\* (Stack trace) desde abajo hacia arriba.

2\. Identifica cuál fue el primer método de \*código de usuario\* (no código interno de Unity) que inició la reacción en cadena.

3\. Pregúntate: ¿Qué estado tuvo que ser verdadero en ese primer método para llegar a la línea que explotó?

\---

\## 5. Directiva de Contexto MCP (Si aplica)

\[cite\_start\]Si estás operando a través de \`unity-mcp\` (Model Context Protocol) o tienes acceso directo al entorno del usuario\[cite: 3148, 3149\]:

\* No pidas que el usuario te copie los logs; consúmelos directamente.

\* \[cite\_start\]Usa el MCP para consultar el estado actual de los GameObjects y sus componentes en lugar de adivinar\[cite: 3149\].