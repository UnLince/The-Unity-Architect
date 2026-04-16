---
name: unity-debug-state-serialization
description: Diagnóstico de bugs invisibles en el Inspector de Unity. Guía para detectar errores de serialización, Prefabs corruptos y ScriptableObjects.
tags: [debugging, inspector, serialization, prefabs]
---

# Submódulo: Estado del Objeto y Serialización

## 1. El Inspector miente (a veces)

Unity no siempre sincroniza el estado real de la memoria con lo que ves en el Inspector.

*   **Modo Debug del Inspector:** Provee instrucciones al usuario para poner el Inspector en modo "Debug" mediante el menú de tres puntos (⋮).
*   **Por qué:** Esto revela variables privadas ocultas de otros componentes que podrían estar interfiriendo sin que el usuario las haya expuesto.

---

## 2. Prefabs y Overrides

*   Los bugs "invisibles" suelen vivir en valores sobreescritos (Overrides) en una instancia de Prefab que no se han aplicado al original.
*   Aconseja verificar si el componente tiene una línea azul a la izquierda en el Inspector.