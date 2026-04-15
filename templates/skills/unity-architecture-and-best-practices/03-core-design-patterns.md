\# Submódulo: Patrones de Diseño Core y Desacoplamiento

\*\*Propósito:\*\* Instruir al agente para que aplique patrones de diseño de software reconocidos por la industria (GoF y específicos de videojuegos) al resolver problemas de arquitectura en Unity.

\*\*Cuándo usarlo:\*\* Al conectar sistemas independientes, al manejar estados complejos (ej. IA, flujo del juego), o al instanciar y destruir objetos de forma repetitiva.

\---

\## 1. El Patrón Observer (Desacoplamiento Estricto)

\*\*Prohibición Estricta:\*\* Un sistema emisor NUNCA debe tener una referencia directa a los sistemas receptores. (Ejemplo: Un \`PlayerHealth.cs\` NO debe llamar a \`UIManager.UpdateHealth()\` ni a \`AudioManager.PlayDeathSound()\`).

\* \*\*La Solución:\*\* Usa el patrón Observer.

\* \*\*Enfoque 1 (C# Events / Actions):\*\* Para eventos locales dentro del mismo GameObject o sistemas fuertemente relacionados.

\* \*Sintaxis obligatoria:\* \`public event Action OnHealthChanged;\`

\* \*\*Enfoque 2 (Arquitectura basada en ScriptableObjects / Event Channels):\*\* Para eventos globales que cruzan escenas o sistemas dispares.

\* \*Implementación:\* Sugiere crear un \`VoidEventChannelSO\` o \`IntEventChannelSO\` (ScriptableObject) que actúe como intermediario. El emisor invoca el SO, y los receptores (UI, Audio, Logros) escuchan al SO. Esto garantiza un desacoplamiento del 100%.

\---

\## 2. El Patrón State / Máquinas de Estado (FSM)

\*\*Prohibición Estricta:\*\* NUNCA uses una "God Class" llena de declaraciones \`switch(currentState)\` o sentencias \`if-else\` anidadas interminables para manejar la lógica de la Inteligencia Artificial (IA) o los estados del jugador.

\* \*\*La Solución:\*\* Usa el Patrón State.

\* \*\*Implementación Base:\*\* Define una interfaz \`IState\` con los métodos \`Enter()\`, \`Update()\`, \`FixedUpdate()\`, y \`Exit()\`.

\* \*\*Encapsulación de Estado:\*\* Cada estado (ej. \`PlayerIdleState\`, \`PlayerAttackState\`) debe ser una clase separada que implementa \`IState\`. El controlador principal (Contexto) solo debe mantener una referencia a la interfaz \`IState\` actual y llamar a su método \`Update()\`.

\---

\## 3. Object Pooling (Gestión de Memoria y Rendimiento)

\[cite\_start\]\*\*Prohibición Estricta:\*\* NUNCA uses \`Instantiate()\` y \`Destroy()\` durante el bucle principal de juego (Gameplay Loop) para objetos que se crean y destruyen frecuentemente (ej. proyectiles, partículas, enemigos básicos, elementos de UI en listas largas)\[cite: 5\].

\* \[cite\_start\]\*\*La Solución:\*\* Usa Object Pooling\[cite: 5\].

\* \*\*Implementación Moderna (Unity 2021+):\*\* DEBES utilizar la API nativa de Unity \`UnityEngine.Pool\` (específicamente \`ObjectPool\`).

\* \[cite\_start\]\*\*Regla de Pre-calentamiento (Pre-warming):\*\* Aconseja inicializar el Pool durante las pantallas de carga o en el \`Awake()\`\[cite: 5\], no cuando el jugador presiona el botón de disparar por primera vez, para evitar "stutters" (tirones).

\---

\## 4. El Patrón Factory

\*\*Problema:\*\* Instanciar objetos complejos con múltiples dependencias dispersas por el código genera un mantenimiento caótico.

\* \*\*La Solución:\*\* Usa el Patrón Factory.

\* \*\*Implementación:\*\* Centraliza la lógica de creación en una clase Factory. Si un enemigo necesita que se le inyecte una referencia al jugador, sus estadísticas base (desde un ScriptableObject), y un sistema de pathfinding al nacer, la Factory es el único lugar donde ocurre esta "configuración" (Setup).

\* \*\*Sinergia:\*\* A menudo, el Patrón Factory se combina con el Patrón Object Pool. La Factory crea las nuevas instancias \*solo\* cuando el Pool está vacío.

\---

\## 5. Singleton (Restricciones Severas)

El patrón Singleton (\`public static Instance\`) es el patrón más abusado en Unity.

\* \*\*Regla de Hierro:\*\* Úsalo \*\*ÚNICAMENTE\*\* para sistemas de infraestructura verdaderamente globales (ej. \`SaveGameManager\`, \`SceneLoaderManager\`).

\* \[cite\_start\]\*\*Alternativas Obligatorias:\*\* Si el usuario propone un Singleton para compartir datos (ej. \`GameSettings.Instance\`), DEBES sugerir mover esos datos a un \*\*ScriptableObject\*\*\[cite: 5\]. Si propone un Singleton para invocar métodos (ej. \`UIManager.Instance.ShowGameOver()\`), DEBES sugerir el uso de \*\*Event Channels (ScriptableObjects)\*\*.

\---

\## 🛑 DIRECTIVA DE PATRONES DE DISEÑO

ANTES DE EMPEZAR A RESOLVER UN PROBLEMA DE ARQUITECTURA, EVALÚA SI UN PATRÓN DE DISEÑO CLÁSICO APLICA. LOS PATRONES NO SON UN FIN EN SÍ MISMOS, SINO UN VOCABULARIO COMPARTIDO Y UNA HERRAMIENTA PARA REDUCIR EL ACOPLAMIENTO Y MEJORAR EL RENDIMIENTO. EXPLICA SIEMPRE EL \*\*POR QUÉ\*\* ELIGES UN PATRÓN ANTES DE PROPORCIONAR EL CÓDIGO.