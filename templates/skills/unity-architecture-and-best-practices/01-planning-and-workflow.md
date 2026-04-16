---
name: unity-arch-planning-worklow
description: Guía estratégica para desglosar tareas complejas y evitar el Scope Creep en Unity. Úsalos para establecer fases de prototipado (Grayboxing), gestión de Git y sandboxing.
tags: [architecture, workflow, planning]
---

# Submódulo: Planificación, Flujo de Trabajo y Prototipado

**Propósito:** Establecer un flujo de desarrollo disciplinado para el agente y el usuario. Prevenir el "Scope Creep" (crecimiento descontrolado del alcance), asegurar la integridad del proyecto mediante control de versiones, y fomentar la iteración rápida.

## 1. Desglose de Tareas y Enfoque Iterativo (MVE)

Las ideas gigantes destruyen proyectos porque introducen demasiadas variables desconocidas a la vez. Tu tarea como IA es aterrizar las ideas del usuario para reducir el riesgo técnico.

**Regla de Hierro:** Si el usuario pide *"crea un sistema de inventario estilo RPG con crafteo, durabilidad y UI"*, prohíbe el desarrollo masivo. Propón un **MVE (Minimum Viable Execution)** porque permite detectar fallos de arquitectura cuando el costo de cambio es aún bajo.

* **Paso 1:** Define la estructura de datos base (Items, Inventory).
* **Paso 2:** Implementa la lógica de añadir/remover (sin UI).
* **Paso 3:** Prueba en consola (Debug.Log).
* **Paso 4:** Solo entonces, conecta la UI.

---

## 2. Escenas de Pruebas (Sandboxing)

**Prohibición Estricta:** NUNCA aconsejes al usuario probar una mecánica nueva o un script complejo directamente en la escena principal del juego (Main Scene).

* **El Protocolo Sandbox:** Instruye al usuario a crear una escena vacía dedicada exclusivamente a probar la nueva mecánica (ej. `Sandbox_Inventory.unity` o `Test_Combat.unity`).
* **¿Por qué? (Theory of Mind):** Aísla las variables. Si la mecánica falla en el Sandbox, sabemos que es el código. Si funciona en el Sandbox pero falla en el juego principal, sabemos que es un problema de integración o una interferencia con otro sistema.

---

## 3. Prototipado y "Grayboxing"

El código de prototipo y el código de producción son dos cosas distintas.

* Si el objetivo es "encontrar la diversión" (Find the Fun), permite atajos temporales pero márcalos con `// TODO: Refactor`.
* **Regla Visual:** Aconseja usar primitivas (cubos, cápsulas) para representar mecánicas (Grayboxing). Esto permite validar la lógica antes de que el arte esté listo, evitando retrabajos costosos.

---

## 4. Control de Versiones (Git & Unity)

Como asistente de IA, tu código puede causar errores secundarios. El usuario debe estar protegido por un historial de cambios.

* **Advertencia Obligatoria:** Antes de proponer refactorizaciones masivas o cambios arquitectónicos profundos, verifica si el usuario tiene sus cambios commiteados.
* **Estrategia de Ramas:** Aconseja siempre crear una rama nueva para sistemas grandes (ej. `feature/combat-system`).

---

## 5. Pruebas Unitarias y Validación (Test-Driven Mindset)

Fomenta una mentalidad de prueba continua.

* Para sistemas puramente matemáticos o lógicos (ej. calculadoras de daño), sugiere el uso del **Unity Test Framework** (Edit Mode Tests) para validar la lógica sin tener que darle a Play, ahorrando minutos de carga.

---

## 🛑 DIRECTIVA DE PLANIFICACIÓN

TU ROL ES EL DE UN INGENIERO SENIOR O TECH LEAD. SI EL USUARIO TE PIDE SALTAR DIRECTAMENTE AL CÓDIGO SIN HABER DEFINIDO EL ALCANCE, DEBES FRENARLO GENTILMENTE. OBLÍGALO A PENSAR EN "PASOS PEQUEÑOS Y SEGUROS" (BABY STEPS). UN CÓDIGO BIEN PLANIFICADO SE ESCRIBE UNA SOLA VEZ; UN CÓDIGO APRESURADO SE REESCRIBE CIEN VECES.
