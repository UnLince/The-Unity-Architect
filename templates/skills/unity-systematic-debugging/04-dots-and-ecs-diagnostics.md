\# Submódulo: Diagnóstico de DOTS y ECS

\*\*Propósito:\*\* Proveer directrices estrictas para depurar sistemas basados en Data-Oriented Technology Stack (DOTS), Entity Component System (ECS), C# Job System y Burst Compiler.

\*\*Cuándo usarlo:\*\* El usuario menciona "Entities", "Jobs", "Burst", reporta cuellos de botella en los \*Worker Threads\*, picos de \`WaitForJobGroupID\`, o problemas de sincronización en simulaciones masivas.

\---

\## 1. El Cambio de Paradigma (Breakpoints vs. Datos)

\[cite\_start\]En ECS, el código es a menudo no administrado (unmanaged), paralelizado y altamente abstraído a través de source generators.

\*\*Regla de Hierro:\*\* No confíes exclusivamente en los breakpoints tradicionales de C# para entender el flujo.

\* \[cite\_start\]\*\*Acción obligatoria:\*\* Instruye al usuario a abrir el \*\*Entity Debugger\*\* (\`Window > Analysis > Entity Debugger\`). \[cite\_start\]Este es el panel de control principal para visualizar Entidades, Sistemas y Componentes a través de diferentes "Worlds".

\---

\## 2. El Asesino Silencioso: Sync Points y Cambios Estructurales

El mayor problema de rendimiento en ECS ocurre cuando el hilo principal (Main Thread) se ve obligado a detenerse y esperar a que los hilos de trabajo (Worker Threads) terminen. \[cite\_start\]Esto se conoce como un \*\*Sync Point\*\*\[cite: 3150\].

\* \[cite\_start\]\*\*Diagnóstico:\*\* Si el CPU Profiler muestra bloques grises gigantes de \`WaitForJobGroupID\` en el hilo principal, el sistema se está asfixiando\[cite: 4594, 4595\].

\* \[cite\_start\]\*\*Causa Raíz:\*\* Los Sync Points casi siempre son causados por \*\*Cambios Estructurales\*\* (Structural Changes) a mitad de la simulación, como crear/destruir entidades o añadir/quitar componentes\[cite: 3150\].

\* \[cite\_start\]\*\*Herramienta a exigir:\*\* Pide al usuario que abra el \*\*Entities Structural Changes Profiler\*\* para identificar exactamente qué sistema está forzando la sincronización\[cite: 3150\].

\* \*\*Solución Estricta:\*\* 1. NUNCA sugieras hacer cambios estructurales directos dentro de un Job.

2\. Exige el uso de un \`EntityCommandBuffer\` (ECB) para diferir la creación/destrucción de entidades hasta un punto de sincronización seguro al final del frame.

3\. \[cite\_start\]Sugiere realizar cambios orientados a \*chunks\* (chunk-oriented changes) en lugar de modificar entidades individuales\[cite: 5436\].

\---

\## 3. Profiling de Sistemas y Componentes Híbridos

El diseño de los datos lo es todo en ECS.

\* \[cite\_start\]\*\*Systems List:\*\* Para rastrear el rendimiento, instruye al usuario a mirar la "Systems List" dentro del Entity Debugger, la cual muestra el tiempo de ejecución exacto por frame de cada sistema\[cite: 3149\].

\* \[cite\_start\]\*\*Componentes Híbridos (Peligro):\*\* Si el usuario está mezclando ECS con GameObjects tradicionales (ej. proyectiles que son Entidades pero tienen componentes híbridos como Shuriken Particle Systems o Visual Effect Graph), adviértele que esto destruirá el rendimiento\[cite: 5438, 5439\].

\---

\## 4. Bugs No Deterministas y Entities Journaling

Si el usuario reporta un bug que ocurre de forma intermitente o una simulación que pierde sincronía:

\* No pidas revisar la lógica de actualización simple. Los bugs en ECS suelen deberse a un orden de actualización de sistemas incorrecto o dependencias de Jobs mal configuradas.

\* \*\*Herramienta requerida:\*\* Sugiere usar \*\*Entities Journaling\*\* para grabar y reproducir las transiciones de estado del mundo ECS. \[cite\_start\]Esto es esencial para diagnosticar bugs no deterministas\[cite: 3153\].

\---

\## 5. Burst Compiler Diagnostics

Si el código matemático o lógico no está rindiendo al máximo, verifica que el Burst Compiler esté activado y funcionando.

\* \[cite\_start\]Pide al usuario que use el \*\*Burst Inspector\*\*\[cite: 3154\].

\* \[cite\_start\]Esta herramienta permite ver el código ensamblador (assembly) generado por el compilador, permitiendo verificar si la vectorización y los \*CPU intrinsics\* se están aplicando correctamente\[cite: 3154\].