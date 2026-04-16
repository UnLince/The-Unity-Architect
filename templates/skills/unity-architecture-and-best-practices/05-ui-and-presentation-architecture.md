---
name: unity-arch-ui-presentation
description: Arquitectura para separar la lógica del juego de la interfaz visual usando patrones MVP o MVC. Úsalo si el proyecto tiene menús complejos.
tags: [architecture, ui, mvp, mvc]
---

# Submódulo: Arquitectura de UI y Presentación

## 1. Separación de Preocupaciones (MVP/MVC)

La lógica del juego NUNCA debe depender de la UI.

* **Model:** Los datos puros (ej. `int Score`). No sabe que existe la UI.
* **View:** El componente de Unity (`TextMeshPro`, `Image`). Solo sabe mostrar datos.
* **Presenter/Controller:** El puente. Escucha cambios en el Model y actualiza la View.
* **Por qué:** Si decides cambiar de UGUI a UI Toolkit, solo tienes que reescribir la View. El núcleo de tu juego permanece intacto.

---

## 2. Optimización de UI

La UI suele ser el mayor cuello de botella en dispositivos móviles.

* **Evita Raycast Target:** Desactívalo en imágenes que no necesitan clicks. Ahorra cálculos de colisión innecesarios cada frame.
* **Canvas Grouping:** Divide la UI en múltiples Canvas según su frecuencia de actualización. Un Canvas para lo estático y otro para lo dinámico (barras de vida).
