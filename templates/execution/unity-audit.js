const fs = require('fs');
const path = require('path');

// ============================================================
//  REGLAS — Basadas en Skills y Best Practices
//  Cada regla tiene: id, name, severity, message
//  y una de las siguientes estrategias de matching:
//    type:"length"  — compara líneas totales
//    scope:"global" — regex sobre el archivo completo
//    scope:"hotpath"— regex sólo dentro de Update/FixedUpdate/LateUpdate
//    scope:"method" — regex sólo dentro de métodos que coinciden con methodPattern
// ============================================================
const rules = [
    // ── ARQUITECTURA ─────────────────────────────────────────
    {
        id: "ARCH_GOD_CLASS",
        name: "Clase Dios",
        type: "length",
        threshold: 400,
        severity: "ADVERTENCIA",
        message: "El script supera las 400 líneas. Considerá dividir responsabilidades."
    },

    // ── PERFORMANCE GENERAL ──────────────────────────────────
    {
        id: "PERF_CRITICAL_SENDMESSAGE",
        name: "Uso de SendMessage",
        scope: "global",
        regex: /\.SendMessage\s*\(/g,
        severity: "CRÍTICO",
        message: "SendMessage es lento e inseguro. Usá GetComponent, Interfaces o Eventos (Atoms)."
    },
    {
        id: "PERF_HOTPATH_FIND",
        name: "Búsqueda en Hot Path",
        scope: "hotpath",
        regex: /(GetComponent|FindObjectOfType|FindWithTag|GameObject\.Find)\s*[(<]/g,
        severity: "CRÍTICO",
        message: "Búsqueda costosa en Hot Path. Mover a Awake/Start y cachear en campo privado."
    },
    {
        id: "PERF_HOTPATH_GC_STRINGS",
        name: "Concatenación de Strings en Hot Path",
        scope: "hotpath",
        regex: /"\s*\+\s*\w|string\s*\+=/g,
        severity: "ADVERTENCIA",
        message: "Posible GC allocation por string concatenation en Hot Path. Usá StringBuilder o $\"{}\""
    },
    {
        id: "PLAT_DEPRECATED_FIND",
        name: "API Deprecada (Unity 6)",
        scope: "global",
        regex: /FindObjectsOfType\b|FindObjectOfType\b/g,
        severity: "ADVERTENCIA",
        message: "Método deprecado en Unity 6. Reemplazar con FindFirstObjectByType / FindObjectsByType."
    },
    {
        id: "PERF_OVERLAPSPHERE_ALLOC",
        name: "OverlapSphere con allocación",
        scope: "global",
        regex: /Physics\.OverlapSphere\s*\((?!.*NonAlloc)/g,
        severity: "CRÍTICO",
        message: "Usar Physics.OverlapSphereNonAlloc con buffer pre-alocado para evitar GC en combat."
    },

    // ── VFX / PROYECTILES ────────────────────────────────────
    {
        id: "VFX_INSTANTIATE_IN_HIT",
        name: "Instantiate de VFX sin Object Pool",
        scope: "method",
        methodPattern: /(?:Hit|OnTrigger|OnCollision|OnImpact|Explode|Activate)/,
        regex: /Instantiate\s*\(/g,
        severity: "CRÍTICO",
        message: "VFX instanciado directamente en hit/trigger. Usá UnityEngine.Pool.IObjectPool para evitar GC spikes en combate intenso."
    },
    {
        id: "VFX_DESTROY_WITHOUT_POOL",
        name: "Destroy directo (debería ser pool.Release)",
        scope: "method",
        methodPattern: /(?:Hit|OnTrigger|OnCollision|HitTarget|Activate)/,
        regex: /Destroy\s*\(\s*gameObject\s*\)/g,
        severity: "ADVERTENCIA",
        message: "Destroy(gameObject) en lógica de hit. Si este objeto puede ser frecuente, usá Object Pool con pool.Release(gameObject)."
    },
    {
        id: "VFX_MOVEMENT_IN_UPDATE",
        name: "Lógica de proyectil en Update",
        scope: "hotpath_update_only",
        regex: /MovePosition|transform\.position\s*\+=/g,
        severity: "ADVERTENCIA",
        message: "Movimiento de proyectil en Update. Toda lógica física/posicional debe estar en FixedUpdate."
    },

    // ── UI TOOLKIT ───────────────────────────────────────────
    {
        id: "UI_LAYOUT_ANIMATION",
        name: "Animación de propiedades de Layout (costoso)",
        scope: "hotpath",
        regex: /style\.(left|top|right|bottom|width|height|margin|padding)\s*=/g,
        severity: "CRÍTICO",
        message: "Modificar propiedades de layout en Hot Path fuerza un Layout Recalculation completo. Usá style.translate o transform para animaciones."
    },
    {
        id: "UI_DISPLAY_TOGGLE_IN_UPDATE",
        name: "Toggle de Display en Hot Path",
        scope: "hotpath",
        regex: /\.style\.display\s*=/g,
        severity: "ADVERTENCIA",
        message: "Cambiar display:none/flex en Update es costoso (rebuild). Preferí style.visibility o mover fuera del hot path."
    }
];

// ============================================================
//  HELPERS
// ============================================================

/** Extrae bloques de un método cuyo nombre coincida con pattern */
function extractMethodBlocks(content, methodNamePattern) {
    const results = [];
    // Encuentra "void|int|bool|... MethodName(...) { ... }"
    const sig = /(?:private|public|protected|internal|override|virtual)?\s*\w[\w<>\[\]]*\s+(\w+)\s*\([^)]*\)\s*\{/g;
    let m;
    while ((m = sig.exec(content)) !== null) {
        const methodName = m[1];
        if (!methodNamePattern.test(methodName)) continue;
        // Extraer el cuerpo contando llaves
        let depth = 1;
        let i = m.index + m[0].length;
        const bodyStart = i;
        while (i < content.length && depth > 0) {
            if (content[i] === '{') depth++;
            else if (content[i] === '}') depth--;
            i++;
        }
        results.push({ name: methodName, body: content.substring(bodyStart, i - 1), bodyStart });
    }
    return results;
}

/** Extrae cuerpos de Update, FixedUpdate, LateUpdate */
function extractHotPathBodies(content) {
    return extractMethodBlocks(content, /^(Update|FixedUpdate|LateUpdate)$/);
}

/** Extrae cuerpos de Update solamente */
function extractUpdateOnlyBodies(content) {
    return extractMethodBlocks(content, /^Update$/);
}

/** Calcula número de línea a partir de offset */
function lineAt(content, index) {
    return content.substring(0, index).split('\n').length;
}

// ============================================================
//  AUDITOR PRINCIPAL
// ============================================================
function auditScripts(dir) {
    if (!fs.existsSync(dir)) {
        console.error(`Error: La carpeta ${dir} no existe.`);
        process.exit(1);
    }

    const files = fs.readdirSync(dir, { recursive: true });
    console.log(`🔍 Iniciando auditoría en: ${dir}\n`);

    let totalIssues = 0;

    files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (!fs.statSync(fullPath).isFile() || !file.endsWith('.cs')) return;

        const content = fs.readFileSync(fullPath, 'utf8');
        const lines = content.split('\n');
        const basename = path.basename(file);
        let fileIssues = 0;

        // ── 1. Regla de longitud
        rules.filter(r => r.type === 'length').forEach(rule => {
            if (lines.length > rule.threshold) {
                console.log(`  [${rule.severity}] ${basename} — ${rule.message} (${lines.length} líneas)`);
                fileIssues++;
            }
        });

        // ── 2. Reglas globales
        rules.filter(r => r.scope === 'global').forEach(rule => {
            rule.regex.lastIndex = 0;
            let match;
            while ((match = rule.regex.exec(content)) !== null) {
                const ln = lineAt(content, match.index);
                console.log(`  [${rule.severity}] ${basename}:${ln} — ${rule.message}`);
                fileIssues++;
            }
        });

        // ── 3. Reglas de Hot Path (Update/FixedUpdate/LateUpdate)
        const hotpathRules = rules.filter(r => r.scope === 'hotpath');
        if (hotpathRules.length > 0) {
            const bodies = extractHotPathBodies(content);
            bodies.forEach(({ name, body, bodyStart }) => {
                hotpathRules.forEach(rule => {
                    rule.regex.lastIndex = 0;
                    let match;
                    while ((match = rule.regex.exec(body)) !== null) {
                        const ln = lineAt(content, bodyStart + match.index);
                        console.log(`  [${rule.severity}] ${basename}:${ln} — ${rule.message} (en ${name})`);
                        fileIssues++;
                    }
                });
            });
        }

        // ── 4. Reglas de Update-only (lógica física)
        const updateOnlyRules = rules.filter(r => r.scope === 'hotpath_update_only');
        if (updateOnlyRules.length > 0) {
            const bodies = extractUpdateOnlyBodies(content);
            bodies.forEach(({ name, body, bodyStart }) => {
                updateOnlyRules.forEach(rule => {
                    rule.regex.lastIndex = 0;
                    let match;
                    while ((match = rule.regex.exec(body)) !== null) {
                        const ln = lineAt(content, bodyStart + match.index);
                        console.log(`  [${rule.severity}] ${basename}:${ln} — ${rule.message} (en ${name})`);
                        fileIssues++;
                    }
                });
            });
        }

        // ── 5. Reglas de Método específico
        const methodRules = rules.filter(r => r.scope === 'method');
        if (methodRules.length > 0) {
            methodRules.forEach(rule => {
                const blocks = extractMethodBlocks(content, rule.methodPattern);
                blocks.forEach(({ name, body, bodyStart }) => {
                    rule.regex.lastIndex = 0;
                    let match;
                    while ((match = rule.regex.exec(body)) !== null) {
                        const ln = lineAt(content, bodyStart + match.index);
                        console.log(`  [${rule.severity}] ${basename}:${ln} — ${rule.message} (en ${name})`);
                        fileIssues++;
                    }
                });
            });
        }

        if (fileIssues > 0) {
            console.log(`  └─ ${fileIssues} problema(s) en ${basename}\n`);
            totalIssues += fileIssues;
        }
    });

    console.log(`\n${'─'.repeat(60)}`);
    if (totalIssues === 0) {
        console.log(`✅ Auditoría completada. Sin problemas detectados.`);
    } else {
        console.log(`⚠️  Auditoría completada. ${totalIssues} problema(s) total encontrado(s).`);
        console.log(`   → Ejecutá 'node execution/unity-doctor.js' para un reporte detallado.`);
    }
}

// Ejecutar sobre los scripts del proyecto
const scriptsPath = path.resolve(__dirname, '../Assets/_Project/Scripts');
auditScripts(scriptsPath);
