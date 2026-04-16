---
name: unity-arch-combat-vfx
description: Mejores prácticas para desacoplar sistemas de combate, animaciones y efectos visuales. Úsalo para hitboxes y eventos de animación seguros.
tags: [architecture, combat, vfx, decoupling]
---

# Submódulo: Desacoplamiento de Combate y VFX

## 1. Animaciones como Feedback, No como Lógica

Un error común es atar el daño de un ataque al frame exacto de una animación. Si la animación cambia, el combate se rompe.

*   **Eventos de Animación (Animation Events):** Úsalos con precaución. Prefiere que la lógica llame a la animación y gestione su propio temporizador de impacto si la precisión técnica es crítica.
*   **Feedback Visual:** El script de combate solo debe decir `PlayParticle()`, no debe configurar el color o el tamaño del efecto. Deja eso al sistema visual.

---

## 2. Hitboxes y Triggers

*   Usa capas de colisión (Layer-based Collision) para filtrar qué puede golpear a qué. Es mucho más eficiente que preguntar `if (tag == "Player")` en cada colisión.