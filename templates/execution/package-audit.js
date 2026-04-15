const fs = require('fs');
const path = require('path');

const rules = [
    {
        id: "SAFETY_SYSTEM_IO",
        name: "Acceso a Sistema de Archivos",
        regex: /System\.IO/g,
        severity: "CRÍTICO",
        message: "Uso de System.IO detectado. Verifica si es necesario (ej. caché) o malicioso."
    },
    {
        id: "SAFETY_SYSTEM_NET",
        name: "Acceso a Red",
        regex: /System\.Net/g,
        severity: "CRÍTICO",
        message: "Uso de System.Net detectado. Posible comunicación externa no autorizada."
    },
    {
        id: "SAFETY_OPEN_URL",
        name: "Apertura de URLs",
        regex: /Application\.OpenURL/g,
        severity: "ADVERTENCIA",
        message: "Abre URLs externas. Verifica el destino."
    },
    {
        id: "COMPAT_BUILTIN_SHADER",
        name: "Shader de Pipeline Integrado (Legacy)",
        regex: /CGPROGRAM|UnityCG\.cginc/g,
        extension: '.shader',
        severity: "ADVERTENCIA",
        message: "Shader tipo Built-in detectado. En URP se verá ROSADO. Requiere conversión."
    },
    {
        id: "COMPAT_URP_SHADER",
        name: "Shader de URP",
        regex: /HLSLPROGRAM|Packages\/com\.unity\.render-pipelines\.universal/g,
        extension: '.shader',
        severity: "INFO",
        message: "Shader compatible con URP detectado."
    },
    {
        id: "PERF_GETCOMPONENT_UPDATE",
        name: "GetComponent en Update",
        regex: /void\s+(Update|FixedUpdate|LateUpdate)\s*\(.*\)[\s\S]*?GetComponent/g,
        severity: "ADVERTENCIA",
        message: "GetComponent en métodos de Update. Impacto en rendimiento, mejor cachear en Awake/Start."
    }
];

function audit(dir) {
    if (!fs.existsSync(dir)) {
        console.error(`Error: Directorio no encontrado: ${dir}`);
        process.exit(1);
    }

    console.log(`\n🛡️  Iniciando Auditoría de Seguridad y Compatibilidad en: ${dir}\n`);
    let findings = 0;

    const walk = (currentDir) => {
        const files = fs.readdirSync(currentDir);
        for (const file of files) {
            const fullPath = path.join(currentDir, file);
            if (fs.statSync(fullPath).isDirectory()) {
                walk(fullPath);
            } else {
                checkFile(fullPath);
            }
        }
    };

    const checkFile = (filePath) => {
        const ext = path.extname(filePath);
        if (ext !== '.cs' && ext !== '.shader') return;

        const content = fs.readFileSync(filePath, 'utf8');
        rules.forEach(rule => {
            if (rule.extension && rule.extension !== ext) return;

            let match;
            rule.regex.lastIndex = 0;
            while ((match = rule.regex.exec(content)) !== null) {
                const lines = content.substring(0, match.index).split('\n');
                const lineNum = lines.length;
                console.log(`[${rule.severity}] ${path.relative(dir, filePath)}:${lineNum} - ${rule.message}`);
                findings++;
            }
        });
    };

    walk(dir);
    console.log(`\n✅ Auditoría finalizada. Hallazgos totales: ${findings}\n`);
}

const target = process.argv[2] || './Assets/Hovl Studio';
audit(path.resolve(target));
