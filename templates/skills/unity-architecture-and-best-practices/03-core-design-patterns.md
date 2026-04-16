---
name: unity-arch-core-design-patterns
description: Implementación senior de patrones de diseño adaptados a Unity. Úsalo para decidir la comunicación entre sistemas complejos (Eventos, Singletons, States).
tags: [architecture, patterns, events, singleton]
---

# Submódulo: Patrones de Diseño Core Aplicados a Unity

---

## 1. Comunicación por Eventos (Desacoplamiento)

Este es el patrón más importante para evitar el "Código Espagueti".

* **Patrón Observer:** Prefiere `System.Action` o `UnityEvent` para que los sistemas se reporten entre sí sin conocerse.
* **Por qué:** Si el `Player` emite un evento `OnDeath`, el `UIManager` y el `AudioManager` pueden reaccionar sin que el script de `Player` tenga una referencia a ellos. Esto permite borrar el sistema de audio sin que el código del jugador deje de compilar.

---

## 2. El Dilema del Singleton

El Singleton es una herramienta poderosa pero peligrosa.

* **Uso Permitido:** Managers únicos y persistentes que no almacenan estado volátil (ej. `GameManager`, `SoundManager`).
* **Uso Prohibido:** Como "bolsa de basura" de variables globales.
* **Mejora Senior:** Considera **ScriptableObject-based Architecture** (Event Channels) como alternativa a Singletons para comunicación entre escenas.

---

## 3. State Machines (Máquinas de Estado)

Fundamental para IA, controladores de personaje y flujos de juego.

* Para sistemas simples, usa un `enum` y un `switch`.
* Para sistemas complejos, usa el **State Pattern** (clases por estado).
* **Refinamiento:** Inyecta siempre el estado anterior y el nuevo en los logs de depuración para poder rastrear transiciones rotas.

---

## 🛑 REGLA DE ORO DEL ARQUITECTO

No elijas el patrón más "inteligente", elige el más simple que cumpla el requisito. La sobre-ingeniería es tan peligrosa como la falta de arquitectura. Explica siempre al usuario por qué un patrón específico es la mejor elección para su caso de uso actual.
