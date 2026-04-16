/**
 * unity-project-graph.js
 * Analiza el proyecto Unity sin abrir el Editor.
 * Construye un grafo de dependencias entre escenas, prefabs, scripts y assets.
 *
 * Salida: project-graph.json  +  project-graph-report.md
 * Uso:    node execution/unity-project-graph.js
 * Flags:  --missing   Solo mostrar GUIDs rotos
 *         --json      Solo exportar JSON (sin md)
 *         --scene     También analizar .unity scenes
 */

'use strict';
const fs = require('fs');
const path = require('path');

// ── Config ───────────────────────────────────────────────────────────────────
const ROOT = path.resolve(__dirname, '..');
const ASSETS = path.join(ROOT, 'Assets');
const OUT_JSON = path.join(ROOT, 'project-graph.json');
const OUT_MD = path.join(ROOT, 'project-graph-report.md');
const ARGS = new Set(process.argv.slice(2));
const ONLY_MISSING = ARGS.has('--missing');
const NO_MD = ARGS.has('--json');
const SCAN_SCENES = ARGS.has('--scene');
// --project-only: restrict analysis to Assets/_Project only (skip 3rd party assets)
const PROJECT_ONLY = ARGS.has('--project-only');
const SCAN_ROOT = PROJECT_ONLY
    ? path.join(ROOT, 'Assets', '_Project')
    : ASSETS;


// ── Step 1: Build GUID → asset map from all .meta files (Assets + Packages) ──────
function buildGuidMap() {
    const map = {};     // guid → { type, path, name }
    // Scan both Assets and Packages so built-in scripts (TMP, URP, etc.) resolve correctly
    const scanRoots = [ASSETS, path.join(ROOT, 'Packages')];
    const metaFiles = scanRoots.flatMap(r => walkFiles(r, f => f.endsWith('.meta')));
    for (const metaPath of metaFiles) {
        const content = fs.readFileSync(metaPath, 'utf8');
        const guidMatch = content.match(/^guid:\s*([a-f0-9]{32})/m);
        if (!guidMatch) continue;
        const guid = guidMatch[1];
        const assetPath = metaPath.slice(0, -5); // strip .meta
        if (!fs.existsSync(assetPath)) continue;
        const ext = path.extname(assetPath).toLowerCase();
        const name = path.basename(assetPath);
        let type = ext.slice(1) || 'unknown';
        if (ext === '.cs') type = 'script';
        else if (ext === '.prefab') type = 'prefab';
        else if (ext === '.unity') type = 'scene';
        else if (ext === '.asset') type = 'asset';
        else if (ext === '.mat') type = 'material';
        else if (ext === '.anim') type = 'animation';
        map[guid] = { guid, type, path: path.relative(ROOT, assetPath), name };
    }
    return map;
}

// ── Step 2: Parse a YAML Unity file for MonoBehaviour → script references ────
function parseUnityFile(filePath, guidMap) {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);
    const relPath = path.relative(ROOT, filePath);

    const scriptRefs = [];

    // Split into YAML documents. Only MonoBehaviours (type 114) contain C# scripts.
    // Format: "--- !u!114 &12345"
    const blocks = content.split(/(?=^--- )/m);
    for (const block of blocks) {
        if (!block.startsWith('--- !u!114 ')) continue;  // only MonoBehaviours

        const scriptMatch = block.match(/m_Script:\s*\{fileID:\s*\d+,\s*guid:\s*([a-f0-9]{32})/);
        if (!scriptMatch) continue;

        const guid = scriptMatch[1];
        // Skip Unity built-in scripts
        if (/^0{32}$/.test(guid) || guid.startsWith('0000000000000000')) continue;

        const resolved = guidMap[guid];
        const existing = scriptRefs.find(r => r.guid === guid);
        if (!existing) {
            scriptRefs.push({ guid, resolved: resolved || null, missing: !resolved });
        }
    }

    // Extract unique GameObject names (m_Name fields)
    const gameObjects = [];
    const goRegex = /m_Name:\s*(.+)/g;
    let m;
    while ((m = goRegex.exec(content)) !== null) {
        const name = m[1].trim();
        if (name && name !== '{}' && name.length < 80) gameObjects.push(name);
    }

    return {
        file: relPath,
        name: fileName,
        type: path.extname(filePath).slice(1),
        gameObjects: [...new Set(gameObjects)].slice(0, 20),
        scriptRefs,
        missingScripts: scriptRefs.filter(r => r.missing),
    };
}

// ── Step 3: Build full project graph ─────────────────────────────────────────
function buildGraph(guidMap) {
    const extensions = ['.prefab', '.asset'];
    if (SCAN_SCENES) extensions.push('.unity');

    const files = walkFiles(SCAN_ROOT, f => extensions.some(e => f.endsWith(e)));

    const nodes = [];

    for (const f of files) {
        try {
            const node = parseUnityFile(f, guidMap);
            if (ONLY_MISSING && node.missingScripts.length === 0) continue;
            nodes.push(node);
        } catch (e) {
            // skip binary or unparseable files
        }
    }

    // Also index scripts themselves
    const scripts = walkFiles(SCAN_ROOT, f => f.endsWith('.cs') && !f.endsWith('.meta'));

    const scriptIndex = scripts.map(f => ({
        file: path.relative(ROOT, f),
        name: path.basename(f),
        type: 'script',
        guid: (() => {
            const meta = f + '.meta';
            if (!fs.existsSync(meta)) return null;
            const c = fs.readFileSync(meta, 'utf8');
            const gm = c.match(/^guid:\s*([a-f0-9]{32})/m);
            return gm ? gm[1] : null;
        })(),
    }));

    return { nodes, scriptIndex, guidMap };
}

// ── Step 4: Generate Markdown report ─────────────────────────────────────────
function generateReport(graph) {
    const { nodes, scriptIndex } = graph;
    const now = new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' });
    const lines = [];

    lines.push('# 🗂️ Unity Project Graph Report');
    lines.push(`\n> Generado el **${now}** por \`unity-project-graph.js\`\n`);

    // Summary
    const allMissing = nodes.flatMap(n => n.missingScripts.map(r => ({ ...r, file: n.file })));
    lines.push('## 📊 Resumen\n');
    lines.push(`| Tipo | Cantidad |`);
    lines.push(`|:-----|:---------|`);
    lines.push(`| Prefabs analizados | ${nodes.filter(n => n.type === 'prefab').length} |`);
    lines.push(`| Assets analizados | ${nodes.filter(n => n.type === 'asset').length} |`);
    lines.push(`| Escenas analizadas | ${nodes.filter(n => n.type === 'scene').length} |`);
    lines.push(`| Scripts en proyecto | ${scriptIndex.length} |`);
    lines.push(`| 🔴 Scripts rotos (missing) | **${allMissing.length}** |`);
    lines.push('');

    // Missing scripts (top priority)
    if (allMissing.length > 0) {
        lines.push('## 🔴 Scripts Rotos (Missing References)\n');
        lines.push('> Estos archivos referencian scripts que ya no existen. Usar `GameObjectUtility.RemoveMonoBehavioursWithMissingScript` para limpiarlos.\n');
        lines.push('| Archivo | GUID Roto |');
        lines.push('|:--------|:----------|');
        for (const m of allMissing) {
            lines.push(`| \`${path.basename(m.file)}\` | \`${m.guid}\` |`);
        }
        lines.push('');
    } else {
        lines.push('## ✅ No hay scripts rotos\n');
    }

    if (!ONLY_MISSING) {
        // Per-file dependency tree
        lines.push('---\n');
        lines.push('## 📦 Árbol de Dependencias por Archivo\n');

        for (const node of nodes) {
            lines.push(`### \`${node.name}\``);
            lines.push(`**Path:** \`${node.file}\`  `);
            lines.push(`**Tipo:** ${node.type}  `);

            if (node.gameObjects.length > 0) {
                lines.push(`**GameObjects:** ${node.gameObjects.slice(0, 10).map(g => `\`${g}\``).join(', ')}${node.gameObjects.length > 10 ? ' ...' : ''}`);
            }

            if (node.scriptRefs.length > 0) {
                lines.push('\n**Scripts referenciados:**');
                for (const ref of node.scriptRefs) {
                    if (ref.missing) {
                        lines.push(`  - 🔴 MISSING \`${ref.guid}\``);
                    } else {
                        lines.push(`  - ✅ \`${ref.resolved.name}\` (\`${ref.resolved.path}\`)`);
                    }
                }
            }

            lines.push('');
        }

        // Script index
        lines.push('---\n');
        lines.push('## 📝 Índice de Scripts\n');
        lines.push('| Script | GUID | Path |');
        lines.push('|:-------|:-----|:-----|');
        for (const s of scriptIndex.sort((a, b) => a.name.localeCompare(b.name))) {
            lines.push(`| \`${s.name}\` | \`${s.guid || 'N/A'}\` | \`${s.file}\` |`);
        }
    }

    lines.push('\n---\n_Generado por `execution/unity-project-graph.js`. Para regenerar: `node execution/unity-project-graph.js`_');
    return lines.join('\n');
}

// ── Utilities ─────────────────────────────────────────────────────────────────
function walkFiles(dir, filter) {
    const results = [];
    function walk(d) {
        if (!fs.existsSync(d)) return;
        for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
            const full = path.join(d, entry.name);
            if (entry.isDirectory()) {
                // Skip Library, Temp, Packages
                if (['Library', 'Temp', 'Packages', 'node_modules'].includes(entry.name)) continue;
                walk(full);
            } else if (filter(full)) {
                results.push(full);
            }
        }
    }
    walk(dir);
    return results;
}

// ── Main ──────────────────────────────────────────────────────────────────────
console.log('🗂️  Unity Project Graph\n' + '─'.repeat(50));
console.log(`📂 Scope: ${PROJECT_ONLY ? 'Assets/_Project only (--project-only)' : 'Assets/ completo'}`);
console.log('📂 Leyendo GUIDs del proyecto (Assets + Packages)...');

const guidMap = buildGuidMap();
console.log(`   ${Object.keys(guidMap).length} assets indexados`);

console.log('🔍 Analizando prefabs y assets...');
const graph = buildGraph(guidMap);
console.log(`   ${graph.nodes.length} archivos analizados`);

// Write JSON
const jsonOut = {
    generated: new Date().toISOString(),
    summary: {
        total_nodes: graph.nodes.length,
        missing_scripts: graph.nodes.flatMap(n => n.missingScripts).length,
        scripts: graph.scriptIndex.length,
    },
    nodes: graph.nodes,
    scripts: graph.scriptIndex,
};
fs.writeFileSync(OUT_JSON, JSON.stringify(jsonOut, null, 2), 'utf8');
console.log(`✅ JSON exportado: project-graph.json`);

if (!NO_MD) {
    const md = generateReport(graph);
    fs.writeFileSync(OUT_MD, md, 'utf8');
    console.log(`✅ Reporte exportado: project-graph-report.md`);
}

// Console summary of missing
const missing = graph.nodes.filter(n => n.missingScripts.length > 0);
if (missing.length > 0) {
    console.log(`\n🔴 Scripts rotos encontrados en ${missing.length} archivo(s):`);
    for (const node of missing) {
        console.log(`   • ${node.name}`);
        for (const r of node.missingScripts) {
            console.log(`     GUID roto: ${r.guid}`);
        }
    }
} else {
    console.log('\n✅ No se encontraron scripts rotos');
}
console.log('');
