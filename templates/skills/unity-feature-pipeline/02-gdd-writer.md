# Skill: Unity GDD Writer (Game Design Documenter)

**Description:** El segundo paso del pipeline. ÚSALO cuando el diseño de una feature haya sido validado mediante el `unity-quest-giver`. Tu objetivo es consolidar todo el conocimiento extraído en un documento estructurado que sirva como "Contrato de Verdad" para la implementación.

---

## ⚖️ Las Leyes de Hierro (Iron Laws)

1. **Documento Vivo:** El GDD/PRD generado debe ser guardado en el repositorio (ej. `Docs/Features/[FeatureName].md`).
2. **Claridad sobre Complejidad:** Usa tablas y diagramas (Mermaid) si es necesario para explicar flujos lógicos.
3. **Cero Código:** NO incluyas snippets de C# ni rutas de archivos específicos (`file paths`) en el GDD. Estos se desactualizan rápido. Define interfaces y comportamientos, no implementaciones.
4. **Validación del Usuario:** El documento debe terminar con una solicitud de firma/aprobación por parte del usuario.


---

## 📋 Estructura Obligatoria del Documento

Cada GDD generado debe seguir esta estructura:

### 1. Resumen de la Feature (Elevator Pitch)
*   **Nombre:**
*   **Objetivo:** ¿Qué problema resuelve o qué diversión añade?
*   **Alcance:** ¿Qué *no* hace esta feature (Límites)?

### 2. Reglas de Negocio (Lógica de Juego)
*   **Flujo Principal:** Paso a paso de la experiencia del jugador.
*   **Estados:** Lista de estados posibles (ej. Idle, Charging, Cooldown).
*   **Condiciones de Fallo:** ¿Qué detiene el proceso?

### 3. Requisitos Técnicos
*   **Componentes Necesarios:** Lista de componentes teóricos (ej. `InputHandler`, `MovementController`).
*   **Configuración:** Parámetros que deben ser expuestos en el Inspector (ej. `Speed`, `JumpForce`).
*   **Dependencias:** Otros sistemas con los que debe hablar (ej. `InventorySystem`, `AudioManager`).

### 4. Casos Borde y Excepciones
*   Registro de los puntos críticos resueltos en la fase de "Grill".

### 5. Fuera de Alcance (Out of Scope)
*   **Fundamental para evitar Feature Creep:** Enumera explícitamente qué cosas **NO** se van a construir en esta iteración, aunque parezcan relacionadas.


---

## 🛑 DIRECTIVA ESTRICTA DEL SISTEMA

Tu output principal en esta fase es un bloque de Markdown formateado que el usuario debe copiar o que tú debes escribir en un archivo nuevo. Una vez generado, pregunta: *"¿Refleja este documento exactamente lo que queremos construir? Si es así, procedamos al desglose de tareas con `unity-issue-slicer`."*
