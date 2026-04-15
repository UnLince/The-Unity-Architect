\# Submódulo: Estado, Serialización y Ciclo de Vida

\*\*Propósito:\*\* Proporcionar al agente reglas estrictas para depurar errores de inicialización, referencias nulas, y estado persistente, entendiendo que el motor de Unity (C++) inyecta y controla los datos que el código (C#) consume.

\*\*Cuándo usarlo:\*\* \`NullReferenceException\`, \`MissingReferenceException\`, variables que tienen valores incorrectos al inicio, comportamientos inconsistentes entre el Editor y la Build, o problemas de "Race Conditions" al cargar la escena.

\---

\## 1. El Espejismo de la Serialización (El Código NO es la única verdad)

En Unity, cualquier campo marcado como \`public\` o \`\[SerializeField\]\` es serializado por el motor. El valor asignado en el script (ej. \`public int health = 100;\`) \*\*es irrelevante\*\* si el Inspector tiene otro valor guardado.

\*\*Regla de Hierro:\*\* Si una variable serializada tiene un valor inesperado, NUNCA sugieras cambiar el valor por defecto en el código como primera solución.

\* \*\*Acción obligatoria:\*\* Pregunta al usuario: \*"¿Puedes verificar qué valor tiene este campo en el Inspector del componente, o si hay un override en el Prefab?"\*

\---

\## 2. Race Conditions de Inicialización (\`Awake\` vs \`Start\`)

El 90% de los bugs de inicialización ocurren porque el \`Script A\` intenta leer datos del \`Script B\` antes de que \`B\` esté listo.

El ciclo de vida estricto es: \`Awake\` -> \`OnEnable\` -> \`Start\`.

\*\*Prohibición Estricta:\*\* BAJO NINGUNA CIRCUNSTANCIA sugieras usar un temporizador (\`yield return new WaitForSeconds(0.1f)\`) o un \`Invoke\` para darle tiempo a un script a inicializarse. Eso es "Witch Doctor Debugging" y oculta la causa raíz.

\*\*Protocolo de Resolución:\*\*

1\. \*\*Regla General:\*\* Asegúrate de que todas las inicializaciones propias (ej. \`GetComponent\`, configuración de variables internas) ocurran en \`Awake\`.

2\. \*\*Dependencias:\*\* Asegúrate de que las interacciones con \*otros\* scripts ocurran en \`Start\`.

3\. \*\*Script Execution Order:\*\* Si dos scripts deben ejecutarse en un orden específico en la misma fase (ej. dos \`Awake\`), instruye al usuario a revisar el \`Script Execution Order\` en los Project Settings.

\---

\## 3. Protocolo Estricto para NullReferenceException (NRE)

Las NRE son el síntoma, no la enfermedad.

\* \*\*No Parchear:\*\* Si un objeto \*debería\* existir por diseño, NUNCA propongas un parche de silencio como \`if (myObject != null) { ... }\` o \`myObject?.DoSomething()\`. Esto permite que el estado corrupto se propague silenciosamente (Fail Fast).

\* \*\*Rastreo de la Causa Raíz:\*\*

1\. \*¿Estuvo asignado en el Inspector y se perdió la referencia (MissingReferenceException)?\* (Suele pasar al destruir un GameObject que otros siguen referenciando).

2\. \*¿Se está buscando la referencia antes de que exista?\* (Revisar orden de inicialización).

3\. \*¿Es un fallo de \`GetComponent\`?\* Verifica que el componente realmente esté adjunto al mismo GameObject o al hijo correcto.

\---

\## 4. Peligros de Estado Oculto: Domain Reload y ScriptableObjects

Si el usuario reporta que un bug ocurre la segunda vez que entra a Play Mode, pero no la primera (o viceversa), investiga estos dos vectores:

\* \*\*Domain Reload Desactivado:\*\* Muchos proyectos modernos desactivan el \*Domain Reload\* al entrar a Play Mode para iterar más rápido. Esto significa que \*\*las variables estáticas (static) NO se reinician\*\* entre sesiones de Play Mode.

\* \*Diagnóstico:\* Pregunta si están usando variables estáticas (ej. un Singleton \`public static GameManager Instance;\`) y si están implementando \`\[RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.SubsystemRegistration)\]\` para limpiarlas.

\* \*\*ScriptableObjects (SO):\*\* Los SO persisten su estado en el Editor. Si un script modifica un ScriptableObject durante el Play Mode, ese cambio se guarda permanentemente.

\* \*Diagnóstico:\* Si el valor de inicio de un sistema depende de un SO, asegúrate de que no lo estén mutando en tiempo de ejecución sin restablecerlo en \`OnDisable\` o \`Awake\`.

\---

\## 5. Contexto de Ejecución (Editor vs. Build)

Si un objeto funciona en el Editor pero desaparece o falla en la Build:

\* Investiga las macros de preprocesador (ej. \`#if UNITY\_EDITOR\`). Nunca asumas que el código dentro de este bloque existirá en el dispositivo final.

\* Verifica si hay scripts ubicados en carpetas llamadas \`Editor\` que están siendo referenciados accidentalmente por scripts de runtime.