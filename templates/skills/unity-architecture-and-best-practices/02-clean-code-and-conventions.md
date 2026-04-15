\# Submódulo: Código Limpio y Convenciones en C# para Unity

\*\*Propósito:\*\* Garantizar que todo el código generado sea legible, mantenible, seguro (encapsulado) y siga los estándares profesionales de la industria para C# y Unity.

\*\*Cuándo usarlo:\*\* Siempre que vayas a escribir, sugerir o refactorizar un script de C#. Estas reglas son de aplicación constante y obligatoria.

\---

\## 1. Encapsulación y Serialización Segura

El estado de un objeto debe estar protegido. La costumbre de usar \`public\` para mostrar variables en el Inspector de Unity es una mala práctica que destruye la encapsulación.

\*\*Regla de Hierro:\*\* \* \*\*Variables del Inspector:\*\* NUNCA uses campos \`public\` a menos que estés creando un \*Struct\* o \*Data Transfer Object (DTO)\* puro. Para exponer una variable en el Inspector, usa \*\*siempre\*\* \`\[SerializeField\] private\`.

\* \*\*Acceso Externo:\*\* Si otro script necesita leer esa variable, crea una Propiedad Pública (Property) con un \*getter\* público y un \*setter\* privado: \`public int Health { get; private set; }\`.

\*Ejemplo de código aceptable:\*

\`\`\`csharp

\[SerializeField, Tooltip("Velocidad base de movimiento.")\]

private float \_moveSpeed = 5f;

public float MoveSpeed => \_moveSpeed;

2\. Nomenclatura Estricta (Naming Conventions)
----------------------------------------------

La consistencia en el código ayuda a leerlo como si fuera prosa. Aplica estrictamente estas convenciones:

*   **Clases, Interfaces, Structs y Enums:** PascalCase (ej. PlayerController, IWeapon, GameState).
    
*   **Métodos y Propiedades Públicas:** PascalCase (ej. TakeDamage(), CurrentHealth).
    
*   **Variables Privadas/Protegidas (Campos):** \_camelCase con guion bajo como prefijo (ej. \_maxHealth, \_rigidbody). _Nota: El guion bajo permite diferenciar rápidamente los campos de la clase de las variables locales._
    
*   **Variables Locales y Parámetros:** camelCase sin guion bajo (ej. damageAmount, targetPosition).
    
*   **Constantes y Variables Estáticas de Solo Lectura:** UPPER\_SNAKE\_CASE (ej. MAX\_INVENTORY\_SLOTS).
    

3\. Structs vs. Classes (Conciencia de Memoria)
-----------------------------------------------

Unity y C# manejan la memoria de manera diferente dependiendo de si usas una Clase o un Struct. Debes elegir la estructura de datos correcta basándote en el rendimiento.

*   **Usa class (Reference Type):** Para comportamientos complejos, scripts que heredan de MonoBehaviour o ScriptableObject, y objetos que necesitan identidad propia o son pesados. (Se alocan en el _Heap_ y generan trabajo para el Garbage Collector).
    
*   **Usa struct (Value Type):** Para contenedores de datos pequeños (menos de 16-32 bytes), matemáticos o efímeros (ej. coordenadas, modificadores de daño, comandos de input). (Se alocan en el _Stack_, son rápidos y no generan basura). Define los structs como readonly siempre que sea posible.
    

4\. Cero "Números Mágicos" (No Hardcoding)
------------------------------------------

**Prohibición Estricta:** NUNCA escribas lógica con valores numéricos o strings hardcodeados directamente en el flujo del código.

*   _Mal:_ if (health < 20) o SceneManager.LoadScene("Level\_01");
    
*   _Bien:_ Extrae esos valores a constantes, variables \[SerializeField\] o variables estáticas de solo lectura.
    

C#

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   private const int LOW_HEALTH_THRESHOLD = 20;  private const string LEVEL_ONE_NAME = "Level_01";  // ...  if (health < LOW_HEALTH_THRESHOLD) { /* ... */ }   `

5\. Comentarios Funcionales (El "Por qué", no el "Qué")
-------------------------------------------------------

El código debe ser auto-documentado a través de una buena nomenclatura.

*   **No comentes lo obvio:** No escribas // Añade 1 a la vida encima de health += 1;.
    
*   **Comenta el "Por qué":** Usa los comentarios para explicar decisiones arquitectónicas, matemáticas complejas, o hacks necesarios por limitaciones del motor. _Ejemplo: // Multiplicamos por 1.5 para compensar la fricción del material en Unity 2022 que causa un arrastre anormal._
    
*   **Uso de Tooltips:** Para variables expuestas al diseñador, prefiere usar \[Tooltip("Descripción")\] en lugar de comentarios estándar, para que la documentación sea visible directamente en el Editor de Unity.
    

🛑 DIRECTIVA DE CÓDIGO LIMPIO
-----------------------------

ERES UN INGENIERO DE SOFTWARE METICULOSO. CADA VEZ QUE ESCRIBAS UN SCRIPT, DEBES REVISAR MENTALMENTE ESTA LISTA: ¿HE USADO \[SERIALIZEFIELD\]? ¿MIS VARIABLES PRIVADAS LLEVAN GUION BAJO? ¿HAY NÚMEROS MÁGICOS? SI ESCRIBES CÓDIGO DESCUIDADO, EL USUARIO PERDERÁ LA CONFIANZA EN TU ARQUITECTURA. LA DISCIPLINA SE DEMUESTRA EN LOS DETALLES.