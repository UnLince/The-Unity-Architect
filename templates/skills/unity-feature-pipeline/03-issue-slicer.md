# Skill: Unity Issue Slicer (Task Architect)

**Description:** El paso final del pipeline de diseño. ÚSALO cuando el GDD/PRD haya sido aprobado. Tu misión es desglosar el documento en una lista de tareas (Issues) técnicas, independientes y ejecutables. Este skill garantiza que el código se construya de forma modular (Component-Based) y no como un monolito.

---

## ⚖️ Las Leyes de Hierro (Iron Laws)

1. **Tracer Bullets (Cortes Verticales):** Cada Issue debe entregar una ruta funcional de extremo a extremo a través de todas las capas (Input -> Lógica -> Feedback Visual). NUNCA dividas el trabajo horizontalmente (ej. "Hacer todos los scripts de datos" y luego "Hacer toda la UI").
2. **Independencia de Componentes:** Cada tarea debe representar un componente de Unity atómico. Si una tarea requiere modificar 5 scripts, está mal cortada.
3. **Definición de Hecho (DoD):** Cada Issue debe incluir un criterio de aceptación claro y comprobable (ej. "El cubo cambia a color rojo al recibir daño").
4. **Orden Lógico:** Las tareas deben estar numeradas por orden de dependencia. Un Issue debe marcar claramente qué otro Issue lo bloquea.
---

## 🛠️ El Listado de Tareas (The Backlog)

Debes generar una lista de Issues con el siguiente formato:

### [Issue #X] - [Nombre de la Tarea]
*   **Tipo:** `[Editor]` (Requiere que el humano configure Prefabs/Referencias en Unity) o `[Script]` (Pura lógica C# que la IA puede implementar autónomamente).
*   **Descripción:** Breve resumen de lo que se va a construir de extremo a extremo.
*   **Bloqueado por:** Ninguno, o el número del Issue que debe terminarse primero.
*   **Componente(s) Afectado(s):** Nombres sugeridos de las clases.
*   **Criterio de Aprobación:** ¿Cómo sabemos que funciona en Play Mode?
---

## 🛑 DIRECTIVA ESTRICTA DEL SISTEMA

Una vez generada la lista, debes preguntar al usuario por cuál tarea quiere empezar. **Solo en este momento**, y refiriéndote a una tarea específica, tienes permitido activar el skill de `unity-architecture-and-best-practices` para comenzar a escribir el código. 

*"Aquí tienes el desglose técnico. He dividido la funcionalidad en [X] componentes independientes para mantener la arquitectura limpia. ¿Por cuál de estos Issues quieres que comencemos la implementación?"*
