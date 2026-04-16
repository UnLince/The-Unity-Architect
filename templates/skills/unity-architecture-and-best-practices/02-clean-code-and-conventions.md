---
name: unity-arch-clean-code-conventions
description: Estándares de nomenclatura y encapsulación para Unity. Úsalo para definir si un dato debe ser Struct o Clase, y para asegurar que el Inspector de Unity se mantenga limpio y profesional.
tags: [architecture, clean-code, naming]
---

# Submódulo: Clean Code, Convenciones y Nomenclatura Unity

**Propósito:** Asegurar que el código sea legible, mantenible y profesional, siguiendo los estándares específicos de la industria de videojuegos y el motor Unity.

---

## 1. Nomenclatura y Estética del Código

En proyectos de Unity colaborativos, la consistencia es más importante que la preferencia personal.

* **Classes & Methods:** PascalCase (ej. `PlayerStats`, `TakeDamage()`).
* **Private Variables:** camelCase con prefijo de guion bajo (ej. `_currentHealth`). **Por qué:** Facilita la identificación rápida de variables de clase vs variables locales en métodos largos.
* **Public Variables:** PascalCase (ej. `MaxHealth`).
* **Constants & Enums:** PASCAL_CASE o PascalCase según equipo, pero nunca números mágicos.

---

## 2. Encapsulación y el Inspector de Unity

Unity rompe la encapsulación clásica de C# para facilitar el diseño. Debes navegar este compromiso con inteligencia.

* **Secret de Senior:** Prefiere `[SerializeField] private` sobre `public`. **Por qué:** Expone la variable al diseñador en el Inspector sin permitir que otros scripts la manipulen de forma desordenada, manteniendo la integridad de los datos.
* **Variables de solo lectura en Inspector:** Si una variable es informativa (como "IsGrounded"), úsala con `[field: SerializeField] public bool IsGrounded { get; private set; }`.

---

## 3. Clases vs. Structs en Unity

La elección afecta masivamente la memoria y el rendimiento (GC Alloc).

* **Usa Clases (Reference Types):** Para objetos con identidad propia (Jugador, Enemigo, Manager).
* **Usa Structs (Value Types):** Para contenedores de datos puros y pequeños que se crean y destruyen miles de veces (ej. `DamageData`, `InventorySlot`). **Por qué:** Los structs viven en el Stack y no generan basura para el Garbage Collector, optimizando los FPS en sistemas masivos.

---

## 4. El "Inspector" es parte del código

Un Inspector desordenado causa errores humanos en el diseño de niveles.

* Usa atributos de organización: `[Header("Settings")]`, `[Space]`, `[Tooltip("Descripción del campo")]`.
* **Prohibido:** Dejar variables públicas sin tooltip si su función no es obvia. El tooltip es la documentación viva para el usuario.
