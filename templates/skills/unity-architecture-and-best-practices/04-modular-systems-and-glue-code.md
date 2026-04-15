Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML``   # Submódulo: Sistemas Modulares y Código Pegamento (Glue Code)  **Propósito:** Definir reglas estrictas para la composición de `GameObjects` y la interconexión de sus componentes. El objetivo es crear sistemas que sean fáciles de armar, probar y reutilizar, minimizando las dependencias directas.  **Cuándo usarlo:** Al diseñar la estructura de un `GameObject` complejo (ej. el Jugador, un Enemigo, un Vehículo) o al conectar múltiples sistemas que deben interactuar entre sí.  ---  ## 1. La Regla de la Composición sobre la Herencia  **Prohibición Estricta:** NUNCA sugieras jerarquías de herencia profundas (ej. `Entity` -> `Character` -> `Enemy` -> `MeleeEnemy` -> `Goblin`). En Unity, la herencia profunda lleva a un diseño rígido y a código duplicado.  * **La Solución:** Usa **Composición**.  * **Cómo hacerlo:** Construye entidades ensamblando componentes pequeños y de responsabilidad única. Un "Goblin" no hereda de "MeleeEnemy"; un "Goblin" es un `GameObject` que tiene componentes `Health`, `MeleeAttack`, `NavMeshMovement` y `GoblinAI`.  ---  ## 2. Dependencias Explícitas y Seguras  Si un componente *necesita* a otro para funcionar, esa dependencia debe ser obvia y segura desde el principio.  * **Uso de `[RequireComponent]`:** Exige el uso de este atributo para dependencias fuertes en el mismo `GameObject`.    * *Ejemplo:* Si `PlayerMovement.cs` necesita un `Rigidbody2D`, debe estar marcado con `[RequireComponent(typeof(Rigidbody2D))]`. Esto evita errores de "Componente no encontrado" en tiempo de ejecución.  * **Resolución de Referencias (Inyección de Dependencias Local):**    * Las referencias a componentes en el mismo `GameObject` deben obtenerse en el `Awake()` usando `GetComponent()`.    * Las referencias a componentes en *hijos* deben obtenerse en `Awake()` usando `GetComponentInChildren()`.    * Las referencias a objetos *externos* o globales NO deben buscarse con `FindObjectOfType()` o `GameObject.Find()`. Deben ser asignadas en el Inspector (`[SerializeField]`) o inyectadas a través de una arquitectura de inicialización.  ---  ## 3. Interfaces como Contratos  Para desacoplar componentes y facilitar las pruebas, utiliza interfaces.  * **Regla de Oro:** Los componentes no deben depender de implementaciones concretas, sino de abstracciones (Interfaces).  * **Ejemplo Práctico:** Si un arma hace daño, no debe buscar un script `EnemyHealth` o `PlayerHealth`. Debe buscar una interfaz `IDamageable`.    ```csharp    // Mal    EnemyHealth enemy = collision.GetComponent();    if (enemy != null) enemy.TakeDamage(10);    // Bien    IDamageable target = collision.GetComponent();    target?.TakeDamage(10);   ``

4\. "Glue Code" (Código Pegamento) y Coordinadores
--------------------------------------------------

A veces necesitas un script que simplemente conecte otros componentes dentro del mismo GameObject.

*   **El Patrón Controller / Coordinator:** En lugar de que PlayerInput.cs llame directamente a PlayerMovement.cs y a PlayerAnimation.cs, usa un "Glue Script" (ej. PlayerController.cs).
    
*   **Responsabilidad:** El PlayerController es el único que conoce las referencias a los demás componentes locales. Escucha eventos del Input y llama a métodos en Movement y Animation. Los sub-componentes no saben de la existencia de los demás.
    

5\. ScriptableObjects como Datos y Configuración Compartida
-----------------------------------------------------------

Los ScriptableObjects no son solo para Event Channels (ver Módulo 03). Son fundamentales para compartir datos estáticos y configuración, ahorrando memoria y facilitando el diseño.

*   **Configuración de Datos (Stats):** En lugar de que cada instancia de enemigo tenga sus propios valores de vida y velocidad, todos los enemigos del mismo tipo deben referenciar un solo ScriptableObject EnemyStatsSO.
    
*   **Beneficio:** Modificar el ScriptableObject actualiza instantáneamente todas las instancias en tiempo real, sin tener que buscar y editar cada Prefab en la escena.
    

🛑 DIRECTIVA DE MODULARIDAD
---------------------------

TU OBJETIVO ES QUE LOS COMPONENTES CREADOS SEAN TAN INDEPENDIENTES QUE EL USUARIO PUEDA ARRASTRAR UN SCRIPT DE HEALTH DESDE EL JUGADOR HACIA UN BARRIL EXPLOSIVO Y FUNCIONE SIN MODIFICACIONES. CUANDO DISEÑES LA ARQUITECTURA DE UN GAMEOBJECT, EXPLICA SIEMPRE LAS DEPENDENCIAS ENTRE LOS SCRIPTS Y CÓMO ESTARÁN AISLADOS UNOS DE OTROS MEDIANTE INTERFACES Y EVENTOS LOCALES.