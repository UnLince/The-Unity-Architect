/**
 * unity-doctor.js
 * Enforcer de guidelines VFX y UI Toolkit para Hex Protocol.
 * Genera un reporte detallado en "doctor-report.md".
 *
 * Uso: node execution/unity-doctor.js
 */

const fs = require('fs');
const path = require('path');

// ── Configuración ────────────────────────────────────────────
const PROJECT_ROOT = path.resolve(__dirname, '..');
const SCRIPTS_PATH = path.join(PROJECT_ROOT, 'Assets', '_Project', 'Scripts');
const REPORT_PATH = path.join(PROJECT_ROOT, 'doctor-report.md');

// ── Reglas del Doctor ────────────────────────────────────────
const DOCTOR_RULES = [
    // VFX / Proyectiles
    {
        id: 'VFX-001',
        category: 'VFX / Proyectiles',
        severity: 'CRÍTICO',
        title: 'Instantiate de VFX sin Object Pool',
        detail: '`Instantiate()` en métodos de hit/trigger causa GC spikes en combate intenso.',
        fix: 'Implementar `UnityEngine.Pool.ObjectPool<T>` o `IObjectPool<T>`. Llamar `pool.Get()` al activar y `pool.Release()` al desactivar.',
        skill: 'unity-vfx-systems/SKILL.md §2 — Gestión de Memoria y Rendimiento',
        scope: 'method',
        methodPattern: /(?:Hit|OnTrigger|OnCollision|OnImpact|Explode|Activate)/,
        regex: /Instantiate\s*\(/g,
    },
    {
        id: 'VFX-002',
        category: 'VFX / Proyectiles',
        severity: 'CRÍTICO',
        title: 'Destroy directo en lógica de hit (falta pool.Release)',
        detail: '`Destroy(gameObject)` en un projectile/VFX garantiza GC pressure. En un MOBA con habilidades frecuentes esto produce frame drops.',
        fix: 'Reemplazar `Destroy(gameObject)` con `pool.Release(this.gameObject)`. El objeto se desactiva y se recicla.',
        skill: 'unity-vfx-systems/SKILL.md §2 — Object Pooling Obligatorio',
        scope: 'method',
        methodPattern: /(?:Hit|OnTrigger|OnCollision|HitTarget|Activate)/,
        regex: /Destroy\s*\(\s*gameObject\s*\)/g,
    },
    {
        id: 'VFX-003',
        category: 'VFX / Proyectiles',
        severity: 'CRÍTICO',
        title: 'OverlapSphere con allocación — falta NonAlloc',
        detail: '`Physics.OverlapSphere` devuelve un nuevo array en cada llamada → GC allocation.',
        fix: 'Usar `Physics.OverlapSphereNonAlloc(center, radius, _buffer)` con un `Collider[]` pre-alocado como campo privado.',
        skill: 'unity-vfx-systems/SKILL.md §2 — Non-Alloc API',
        scope: 'global',
        regex: /Physics\.OverlapSphere\s*\(/g,
    },
    {
        id: 'VFX-004',
        category: 'VFX / Proyectiles',
        severity: 'ADVERTENCIA',
        title: 'Movimiento de proyectil en Update (debe ser FixedUpdate)',
        detail: '`transform.position +=` o `MovePosition` en `Update` hace el movimiento framerate-dependent.',
        fix: 'Mover lógica de traslación/física a `FixedUpdate`. Activar `Rigidbody.interpolation = Interpolate`.',
        skill: 'unity-vfx-systems/SKILL.md §1 — Detección Física y Determinismo',
        scope: 'hotpath_update_only',
        excludePathPattern: /(?:^|[/\\])UI[/\\]/,  // texto UI en Update es correcto (DamagePopup, Billboard)
        regex: /MovePosition|transform\.position\s*(\+|-)?=/g,
    },

    // UI Toolkit
    {
        id: 'UI-001',
        category: 'UI Toolkit',
        severity: 'CRÍTICO',
        title: 'Animación de propiedades de Layout en Hot Path',
        detail: 'Modificar `style.left/top/width/height` cada frame fuerza un "Layout Recalculation" completo que escala con la complejidad del árbol UI.',
        fix: 'Usar `style.translate = new Translate(x, y)` o `transform.scale` para animaciones. Es GPU-handled y tiene costo cero de layout.',
        skill: 'unity-ui-skills/unity-ui-optimization/SKILL.md §1 — Golden Rule',
        scope: 'hotpath',
        regex: /style\.(left|top|right|bottom|width|height|margin|padding)\s*=/g,
    },
    {
        id: 'UI-002',
        category: 'UI Toolkit',
        severity: 'ADVERTENCIA',
        title: 'Toggle display:none en Hot Path',
        detail: 'Cambiar `DisplayStyle.None/Flex` en Update fuerza rebuild de layout en cada toggle.',
        fix: 'Usá `style.visibility` (preserva espacio, muy barato) o `style.translate` off-screen para toggles frecuentes.',
        skill: 'unity-ui-skills/unity-ui-optimization/SKILL.md §4 — Visibility Strategies',
        scope: 'hotpath',
        regex: /\.style\.display\s*=/g,
    }
];

// ── Motor de extracción ──────────────────────────────────────
function extractMethodBlocks(content, methodNamePattern) {
    const blocks = [];
    const sig = /(?:(?:private|public|protected|internal|static|override|virtual|async)\s+)*[\w<>\[\]]+\s+(\w+)\s*\([^)]*\)\s*\{/g;
    let m;
    while ((m = sig.exec(content)) !== null) {
        const methodName = m[1];
        if (!methodNamePattern.test(methodName)) continue;
        let depth = 1, i = m.index + m[0].length;
        const bodyStart = i;
        while (i < content.length && depth > 0) {
            if (content[i] === '{') depth++;
            else if (content[i] === '}') depth--;
            i++;
        }
        blocks.push({ name: methodName, body: content.substring(bodyStart, i - 1), bodyStart });
    }
    return blocks;
}

function extractHotPathBodies(content) {
    return extractMethodBlocks(content, /^(Update|FixedUpdate|LateUpdate)$/);
}

function extractUpdateOnlyBodies(content) {
    return extractMethodBlocks(content, /^Update$/);
}

function lineAt(content, index) {
    return content.substring(0, index).split('\n').length;
}

// ── Severidad → emoji ────────────────────────────────────────
function severityEmoji(s) {
    if (s === 'CRÍTICO') return '🔴';
    if (s === 'ADVERTENCIA') return '🟡';
    return '🔵';
}

// ── Lógica principal ─────────────────────────────────────────
function runDoctor() {
    if (!fs.existsSync(SCRIPTS_PATH)) {
        console.error(`❌ No se encontró: ${SCRIPTS_PATH}`);
        process.exit(1);
    }

    const allFiles = fs.readdirSync(SCRIPTS_PATH, { recursive: true })
        .filter(f => f.endsWith('.cs'))
        .map(f => ({ rel: f, full: path.join(SCRIPTS_PATH, f) }));

    // Estructura: { ruleId → [{ file, line, methodName }] }
    const findings = {};
    DOCTOR_RULES.forEach(r => { findings[r.id] = []; });

    allFiles.forEach(({ rel, full }) => {
        const content = fs.readFileSync(full, 'utf8');
        const basename = path.basename(rel);

        DOCTOR_RULES.forEach(rule => {
            // Skip file if it matches the rule's excludePathPattern
            if (rule.excludePathPattern && rule.excludePathPattern.test(rel)) return;

            let blocks = [];

            if (rule.scope === 'global') {
                blocks = [{ name: 'global', body: content, bodyStart: 0 }];
            } else if (rule.scope === 'hotpath') {
                blocks = extractHotPathBodies(content);
            } else if (rule.scope === 'hotpath_update_only') {
                blocks = extractUpdateOnlyBodies(content);
            } else if (rule.scope === 'method') {
                blocks = extractMethodBlocks(content, rule.methodPattern);
            }

            blocks.forEach(({ name, body, bodyStart }) => {
                rule.regex.lastIndex = 0;
                let match;
                while ((match = rule.regex.exec(body)) !== null) {
                    const line = lineAt(content, bodyStart + match.index);
                    findings[rule.id].push({ file: basename, line, method: name });
                }
            });
        });
    });

    // ── Generar Reporte ──────────────────────────────────────
    const now = new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' });
    const lines = [];

    lines.push(`# 🏥 Doctor Report — Hex Protocol`);
    lines.push(`\n> Generado el **${now}** por \`unity-doctor.js\`\n`);
    lines.push(`**Scope:** \`Assets/_Project/Scripts\``);
    lines.push(`**Archivos analizados:** ${allFiles.length}\n`);

    // Resumen ejecutivo
    const criticals = DOCTOR_RULES.filter(r => r.severity === 'CRÍTICO' && findings[r.id].length > 0);
    const warnings = DOCTOR_RULES.filter(r => r.severity === 'ADVERTENCIA' && findings[r.id].length > 0);
    const total = criticals.reduce((a, r) => a + findings[r.id].length, 0)
        + warnings.reduce((a, r) => a + findings[r.id].length, 0);

    lines.push(`## 📊 Resumen Ejecutivo\n`);
    lines.push(`| Nivel | Reglas con hallazgos | Instancias |`);
    lines.push(`|:------|:---------------------|:-----------|`);
    lines.push(`| 🔴 CRÍTICO | ${criticals.length} | ${criticals.reduce((a, r) => a + findings[r.id].length, 0)} |`);
    lines.push(`| 🟡 ADVERTENCIA | ${warnings.length} | ${warnings.reduce((a, r) => a + findings[r.id].length, 0)} |`);
    lines.push(`| **TOTAL** | **${criticals.length + warnings.length}** | **${total}** |`);
    lines.push('');

    if (total === 0) {
        lines.push(`\n✅ **¡Sin problemas detectados! El proyecto cumple todas las guidelines.**\n`);
    }

    // Detalle por categoría
    const categories = [...new Set(DOCTOR_RULES.map(r => r.category))];
    categories.forEach(cat => {
        const rulesInCat = DOCTOR_RULES.filter(r => r.category === cat);
        const anyFindings = rulesInCat.some(r => findings[r.id].length > 0);
        if (!anyFindings) return;

        lines.push(`\n---\n\n## 📦 ${cat}\n`);

        rulesInCat.forEach(rule => {
            const hits = findings[rule.id];
            if (hits.length === 0) return;

            lines.push(`### ${severityEmoji(rule.severity)} \`${rule.id}\` — ${rule.title}\n`);
            lines.push(`**Severidad:** ${rule.severity}  `);
            lines.push(`**¿Qué pasa?** ${rule.detail}  `);
            lines.push(`**Cómo arreglarlo:** ${rule.fix}  `);
            lines.push(`**Skill de referencia:** \`${rule.skill}\`\n`);
            lines.push(`**Hallazgos (${hits.length}):**\n`);
            hits.forEach(h => {
                const methodStr = h.method !== 'global' ? ` (en \`${h.method}\`)` : '';
                lines.push(`- \`${h.file}:${h.line}\`${methodStr}`);
            });
            lines.push('');
        });
    });

    // Archivos OK
    lines.push(`\n---\n\n## ✅ Archivos sin problemas\n`);
    const filesWithIssues = new Set(
        Object.values(findings).flat().map(h => h.file)
    );
    const cleanFiles = allFiles.map(f => path.basename(f.rel)).filter(f => !filesWithIssues.has(f));
    if (cleanFiles.length === 0) {
        lines.push('_Todos los archivos tienen al menos un hallazgo._');
    } else {
        cleanFiles.forEach(f => lines.push(`- \`${f}\``));
    }

    lines.push(`\n---\n\n_Reporte generado por \`execution/unity-doctor.js\`. Para volver a correrlo: \`node execution/unity-doctor.js\`_`);

    const reportContent = lines.join('\n');
    fs.writeFileSync(REPORT_PATH, reportContent, 'utf8');

    // Console summary
    console.log(`\n🏥 Doctor Report — Hex Protocol`);
    console.log(`${'─'.repeat(50)}`);
    DOCTOR_RULES.forEach(rule => {
        const hits = findings[rule.id];
        if (hits.length === 0) return;
        console.log(`\n${severityEmoji(rule.severity)} [${rule.id}] ${rule.title}`);
        hits.forEach(h => {
            const methodStr = h.method !== 'global' ? ` (en ${h.method})` : '';
            console.log(`   • ${h.file}:${h.line}${methodStr}`);
        });
    });
    console.log(`\n${'─'.repeat(50)}`);
    console.log(`📄 Reporte completo guardado en: doctor-report.md`);
    console.log(`   🔴 ${criticals.reduce((a, r) => a + findings[r.id].length, 0)} críticos  |  🟡 ${warnings.reduce((a, r) => a + findings[r.id].length, 0)} advertencias  |  ${total} total`);
}

runDoctor();
