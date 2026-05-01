#!/usr/bin/env node

/**
 * The Unity Architect - CLI Installer
 * 
 * Copies skills, execution scripts, and AI config to any Unity project.
 * Usage: npx the-unity-architect
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ─── Configuration ────────────────────────────────────────────────────────────
const PKG_ROOT = path.join(__dirname, '..');
const TEMPLATES_DIR = path.join(PKG_ROOT, 'templates');

const isDryRun = process.argv.includes('--dry-run');
const isForce  = process.argv.includes('--force');

// ─── Utilities ────────────────────────────────────────────────────────────────
const log = {
  info:    (msg) => console.log(`  \x1b[36mℹ\x1b[0m  ${msg}`),
  success: (msg) => console.log(`  \x1b[32m✔\x1b[0m  ${msg}`),
  warn:    (msg) => console.log(`  \x1b[33m⚠\x1b[0m  ${msg}`),
  error:   (msg) => console.error(`  \x1b[31m✖\x1b[0m  ${msg}`),
  step:    (msg) => console.log(`\n\x1b[1m\x1b[35m▶ ${msg}\x1b[0m`),
};

function copyFolderSync(from, to) {
  if (!fs.existsSync(to)) {
    if (!isDryRun) fs.mkdirSync(to, { recursive: true });
  }
  fs.readdirSync(from).forEach((element) => {
    const fromEl = path.join(from, element);
    const toEl   = path.join(to, element);
    if (fs.lstatSync(fromEl).isFile()) {
      if (!isDryRun) fs.copyFileSync(fromEl, toEl);
      log.info(`Copied: ${path.relative(process.cwd(), toEl)}`);
    } else {
      copyFolderSync(fromEl, toEl);
    }
  });
}

function detectProjectType(projectRoot) {
  // Detect AI tool config files present
  const markers = {
    cursor:     fs.existsSync(path.join(projectRoot, '.cursorrules'))
                || fs.existsSync(path.join(projectRoot, '.cursor')),
    antigravity: fs.existsSync(path.join(projectRoot, '.gemini')),
    claude:     fs.existsSync(path.join(projectRoot, 'CLAUDE.md')),
    windsurf:   fs.existsSync(path.join(projectRoot, '.windsurfrules')),
  };
  return markers;
}

function injectAIConfig(projectRoot, markers) {
  const injection = fs.readFileSync(
    path.join(TEMPLATES_DIR, 'ai-config', 'injection.md'),
    'utf-8'
  );

  // ── Cursor ─────────────────────────────────────────────────────────────────
  if (markers.cursor || isForce) {
    const cursorRules = path.join(projectRoot, '.cursorrules');
    if (!isDryRun) {
      if (fs.existsSync(cursorRules)) {
        const content = fs.readFileSync(cursorRules, 'utf-8');
        if (!content.includes('The Unity Architect — AI Agent Rules')) {
          fs.appendFileSync(cursorRules, '\n\n' + injection);
          log.success('Injected rules into existing .cursorrules');
        } else {
          log.info('.cursorrules already has Architect rules. Skipping injection.');
        }
      } else {
        fs.writeFileSync(cursorRules, injection);
        log.success('Created .cursorrules');
      }
    } else {
      log.info('[dry-run] Would write .cursorrules');
    }
  }

  // ── Antigravity / Gemini ────────────────────────────────────────────────────
  const geminiDir = path.join(projectRoot, '.gemini');
  if (markers.antigravity || isForce) {
    const agentsFile = path.join(geminiDir, 'agents.md');
    if (!isDryRun) {
      if (!fs.existsSync(geminiDir)) fs.mkdirSync(geminiDir, { recursive: true });
      if (fs.existsSync(agentsFile)) {
        const content = fs.readFileSync(agentsFile, 'utf-8');
        if (!content.includes('The Unity Architect — AI Agent Rules')) {
          fs.appendFileSync(agentsFile, '\n\n' + injection);
          log.success('Injected rules into existing .gemini/agents.md');
        } else {
          log.info('.gemini/agents.md already has Architect rules. Skipping injection.');
        }
      } else {
        fs.writeFileSync(agentsFile, injection);
        log.success('Created .gemini/agents.md');
      }
    } else {
      log.info('[dry-run] Would write .gemini/agents.md');
    }
  }

  // ── Claude ─────────────────────────────────────────────────────────────────
  if (markers.claude || isForce) {
    const claudeMd = path.join(projectRoot, 'CLAUDE.md');
    if (!isDryRun) {
      if (fs.existsSync(claudeMd)) {
        const content = fs.readFileSync(claudeMd, 'utf-8');
        if (!content.includes('The Unity Architect — AI Agent Rules')) {
          fs.appendFileSync(claudeMd, '\n\n' + injection);
          log.success('Injected rules into existing CLAUDE.md');
        } else {
          log.info('CLAUDE.md already has Architect rules. Skipping injection.');
        }
      } else {
        fs.writeFileSync(claudeMd, injection);
        log.success('Created CLAUDE.md');
      }
    } else {
      log.info('[dry-run] Would write CLAUDE.md');
    }
  }

  // If none detected, default to creating all
  if (!markers.cursor && !markers.antigravity && !markers.claude && !isForce) {
    log.warn('No AI tool config detected. Creating .cursorrules as default.');
    if (!isDryRun) fs.writeFileSync(path.join(projectRoot, '.cursorrules'), injection);
    else log.info('[dry-run] Would create default .cursorrules');
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
function main() {
  const projectRoot = process.cwd();

  console.log('');
  console.log('\x1b[1m\x1b[35m  ████████╗██╗  ██╗███████╗    ██╗   ██╗███╗   ██╗██╗████████╗██╗   ██╗\x1b[0m');
  console.log('\x1b[35m     ██╔══╝██║  ██║██╔════╝    ██║   ██║████╗  ██║██║╚══██╔══╝╚██╗ ██╔╝\x1b[0m');
  console.log('\x1b[35m     ██║   ███████║█████╗      ██║   ██║██╔██╗ ██║██║   ██║    ╚████╔╝ \x1b[0m');
  console.log('\x1b[35m     ██║   ██╔══██║██╔══╝      ██║   ██║██║╚██╗██║██║   ██║     ╚██╔╝  \x1b[0m');
  console.log('\x1b[35m     ██║   ██║  ██║███████╗    ╚██████╔╝██║ ╚████║██║   ██║      ██║   \x1b[0m');
  console.log('\x1b[35m     ╚═╝   ╚═╝  ╚═╝╚══════╝     ╚═════╝ ╚═╝  ╚═══╝╚═╝   ╚═╝      ╚═╝   \x1b[0m');
  console.log('\x1b[1m                      A R C H I T E C T  v1.0.1\x1b[0m');
  console.log('');

  if (isDryRun) log.warn('Running in DRY-RUN mode — no files will be modified.\n');

  // Safety check: is this a Unity project?
  const hasUnityFolders = fs.existsSync(path.join(projectRoot, 'Assets'))
    || fs.existsSync(path.join(projectRoot, 'ProjectSettings'));

  if (!hasUnityFolders) {
    log.warn('This does not look like a Unity project (no Assets/ or ProjectSettings/ folder found).');
    log.warn('Run from the root of your Unity project, or use --force to skip this check.');
    if (!isForce) process.exit(1);
  }

  // ── Step 1: Copy Skills ─────────────────────────────────────────────────────
  log.step('Step 1/3 — Installing AI Skills');
  const skillsSrc  = path.join(TEMPLATES_DIR, 'skills');
  const skillsDest = path.join(projectRoot, 'skills');
  copyFolderSync(skillsSrc, skillsDest);
  log.success(`Skills installed → ${path.relative(projectRoot, skillsDest)}/`);

  // ── Step 2: Copy Execution Scripts ─────────────────────────────────────────
  log.step('Step 2/3 — Installing Execution Scripts');
  const execSrc  = path.join(TEMPLATES_DIR, 'execution');
  const execDest = path.join(projectRoot, 'execution');
  copyFolderSync(execSrc, execDest);
  log.success(`Scripts installed → ${path.relative(projectRoot, execDest)}/`);

  // ── Step 3: Inject AI Config ────────────────────────────────────────────────
  log.step('Step 3/3 — Configuring AI Agent');
  const markers = detectProjectType(projectRoot);
  injectAIConfig(projectRoot, markers);

  // ── Done ────────────────────────────────────────────────────────────────────
  console.log('');
  console.log('\x1b[1m\x1b[32m  ✔ The Unity Architect is ready. Your AI is now a Unity expert.\x1b[0m');
  console.log('');
  console.log('  \x1b[2mNext steps:\x1b[0m');
  console.log('  1. Open your project in Cursor / Antigravity / Claude');
  console.log('  2. The AI will automatically read skills/ for guidance');
  console.log('  3. Run scripts in execution/ for diagnostics: node execution/unity-doctor.js');
  console.log('');
}

main();
