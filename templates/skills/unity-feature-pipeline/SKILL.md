# Skill: Unity Feature Pipeline (Product Engineer)

**Description:** El flujo de trabajo completo para concebir, documentar e implementar nuevas features y sistemas en Unity. ÚSALO SIEMPRE que el usuario proponga construir algo nuevo (ej. "Haz un sistema de inventario", "Agrega una escopeta"). Este skill previene la generación de código frágil ("spaghetti code") obligando a diseñar antes de programar, utilizando un enfoque orientado a componentes.

---

## ⚖️ Las Leyes de Hierro (Iron Laws)

Como agente de IA, tienes PROHIBIDO escribir código de implementación si no se ha completado la fase de diseño y desglose.

1. **Cero Código Prematuro:** No propongas clases de C# hasta que la fase 3 (Issue Slicer) esté terminada.
2. **Arquitectura por Componentes:** Todas las features deben ser cortadas en componentes pequeños y aislados.
3. **Orden de Ejecución Obligatorio:** Debes seguir las fases en este orden estricto.

---

## 🔬 Fases del Pipeline (Routing)

Debes guiar al usuario a través de estas fases en orden. Lee los submódulos correspondientes para ejecutar cada fase.

### Fase 1: Recolección de Requisitos (The Grill)

Antes de aceptar una idea vaga, debes hacer las preguntas difíciles para descubrir los casos borde.

* 👉 **Lee `01-quest-giver.md` para conocer el cuestionario estricto.**

### Fase 2: Documentación del Diseño (The GDD)

Una vez resueltas las dudas, consolidas la información en un Documento de Diseño (PRD/GDD) que actuará como contrato.

* 👉 **Lee `02-gdd-writer.md` para ver la plantilla de documentación.**

### Fase 3: Desglose en Tareas (The Issue Slicer)

Con el GDD aprobado, traduces el documento en tareas de programación (Issues) atómicas y verticales.

* 👉 **Lee `03-issue-slicer.md` para las reglas de creación de issues.**

### Fase 4: Implementación (Architecture & Coding)

Solo cuando el usuario elija un Issue específico para comenzar, puedes empezar a escribir código. En ese momento, abandonas este pipeline y procedes con el estándar de arquitectura.

* 👉 **Cambia al skill `unity-architecture-and-best-practices` para la implementación.**

---

## 🛑 DIRECTIVA ESTRICTA DEL SISTEMA

Si el usuario hace una solicitud vaga o general para un nuevo sistema, INICIA INMEDIATAMENTE LA FASE 1 leyendo el submódulo `01-quest-giver.md`. NO procedas a escribir scripts hasta que todo el pipeline esté completo y se haya seleccionado un Issue específico.
