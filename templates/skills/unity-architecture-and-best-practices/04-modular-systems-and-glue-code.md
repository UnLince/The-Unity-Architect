---
name: unity-arch-modular-glue-code
description: Técnicas para conectar componentes sin crear interdependencias rígidas. Úsalo para configurar [RequireComponent] y dependencias explícitas.
tags: [architecture, modularity, dependencies]
---

# Submódulo: Sistemas Modulares y Código "Glue"

## 1. Dependencias Explícitas vs. Implícitas

El error más común es asumir que un componente existe sin validarlo, lo que causa el temido `NullReferenceException`.

* **Usa `[RequireComponent]`:** Obliga a Unity a añadir el componente necesario automáticamente. **Por qué:** Documenta el requisito directamente en el código y previene errores en tiempo de ejecución.
* **Inyección de Dependencias Simple:** Prefiere pasar las referencias en el Inspector o vía constructor/init, en lugar de usar `GameObject.Find()`.

---

## 2. Prefabs y "Nesting"

La arquitectura modular vive en los Prefabs.

* Aconseja al usuario dividir sus objetos complejos en Prefabs anidados (Nested Prefabs). Un `Enemigo` puede tener un Prefab de `HealthBar` y otro de `Model`.
* Esto permite trabajar en partes del sistema sin bloquear el archivo principal.
