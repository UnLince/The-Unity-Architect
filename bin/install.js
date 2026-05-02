#!/usr/bin/env node

/**
 * The Unity Architect - CLI Installer (v1.2.2)
 * 
 * Unified installation into a single 'The-Unity-Architect' folder.
 * Setup for Skills, Execution scripts, Mega-Brain Wiki and AI Agent configuration.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ─── Configuration ────────────────────────────────────────────────────────────
const PKG_ROOT = path.join(__dirname, '..');
const TEMPLATES_DIR = path.join(PKG_ROOT, 'templates');
const FRAMEWORK_DIR_NAME = 'The-Unity-Architect';

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

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => rl.question(`\n  \x1b[33m?\x1b[0m  ${query} `, answer => {
    rl.close();
    resolve(answer.toLowerCase());
  }));
}

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

function ensureDir(dir) {
  if (!fs.existsSync(dir) && !isDryRun) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function detectProjectType(projectRoot) {
  const markers = {
    cursor:      fs.existsSync(path.join(projectRoot, '.cursorrules')),
    antigravity: fs.existsSync(path.join(projectRoot, '.gemini')) || fs.existsSync(path.join(projectRoot, 'agents.md')),
    claude:      fs.existsSync(path.join(projectRoot, 'CLAUDE.md')),
    windsurf:    fs.existsSync(path.join(projectRoot, '.windsurfrules')),
  };
  return markers;
}

function injectAIConfig(projectRoot, markers) {
  const injection = fs.readFileSync(
    path.join(TEMPLATES_DIR, 'ai-config', 'injection.md'),
    'utf-8'
  );

  const targets = [
    { name: 'agents.md', path: path.join(projectRoot, 'agents.md'), type: 'markdown' },
    { name: '.cursorrules', path: path.join(projectRoot, '.cursorrules'), type: 'markdown' },
    { name: 'CLAUDE.md', path: path.join(projectRoot, 'CLAUDE.md'), type: 'markdown' },
    { name: '.windsurfrules', path: path.join(projectRoot, '.windsurfrules'), type: 'markdown' }
  ];

  targets.forEach(target => {
    // If it's agents.md and doesn't exist, we CREATE it.
    // For others, only inject if they exist OR if force is used.
    const shouldProcess = (target.name === 'agents.md') || fs.existsSync(target.path) || isForce;
    
    if (shouldProcess) {
      if (!isDryRun) {
        if (fs.existsSync(target.path)) {
          const content = fs.readFileSync(target.path, 'utf-8');
          if (!content.includes('The Unity Architect — AI Agent Rules')) {
            fs.appendFileSync(target.path, '\n\n' + injection);
            log.success(`Injected rules into ${target.name}`);
          } else {
            log.info(`${target.name} already configured.`);
          }
        } else {
          fs.writeFileSync(target.path, injection);
          log.success(`Created and configured ${target.name}`);
        }
      } else {
        log.info(`[dry-run] Would configure ${target.name}`);
      }
    }
  });
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  try {
    const projectRoot = process.cwd();
    const frameworkRoot = path.join(projectRoot, FRAMEWORK_DIR_NAME);

    console.log('');
    console.log('\x1b[1m\x1b[35m  ████████╗██╗  ██╗███████╗    ██╗   ██╗███╗   ██╗██╗████████╗██╗   ██╗\x1b[0m');
    console.log('\x1b[35m     ██╔══╝██║  ██║██╔════╝    ██║   ██║████╗  ██║██║╚══██╔══╝╚██╗ ██╔╝\x1b[0m');
    console.log('\x1b[35m     ██║   ███████║█████╗      ██║   ██║██╔██╗ ██║██║   ██║    ╚████╔╝ \x1b[0m');
    console.log('\x1b[35m     ██║   ██╔══██║██╔══╝      ██║   ██║██║╚██╗██║██║   ██║     ╚██╔╝  \x1b[0m');
    console.log('\x1b[35m     ██║   ██║  ██║███████╗    ╚██████╔╝██║ ╚████║██║   ██║      ██║   \x1b[0m');
    console.log('\x1b[35m     ╚═╝   ╚═╝  ╚═╝╚══════╝     ╚═════╝ ╚═╝  ╚════╝╚═╝   ╚═╝      ╚═╝   \x1b[0m');
    console.log('\x1b[1m                      A R C H I T E C T  v1.2.2\x1b[0m');
    console.log('');

    if (isDryRun) log.warn('Running in DRY-RUN mode.\n');

    // Unity Detection
    const hasUnityFolders = fs.existsSync(path.join(projectRoot, 'Assets')) || fs.existsSync(path.join(projectRoot, 'ProjectSettings'));
    if (!hasUnityFolders && !isForce) {
      log.error('Not a Unity project. Use --force to override.');
      process.exit(1);
    }

    // Version Migration
    const legacyDirs = ['skills', 'execution', 'Wiki'].map(d => path.join(projectRoot, d)).filter(d => fs.existsSync(d));
    if (legacyDirs.length > 0 && !isForce) {
      log.warn('Legacy folders detected (skills, execution, Wiki sueltas).');
      const answer = await askQuestion('¿Deseas migrar a la estructura unificada (mover carpetas a The-Unity-Architect/)? [Y/n]');
      if (answer !== 'n') {
        ensureDir(frameworkRoot);
        legacyDirs.forEach(dir => {
          const baseName = path.basename(dir);
          const newPath = path.join(frameworkRoot, baseName);
          if (!isDryRun) {
            if (fs.existsSync(newPath)) fs.rmSync(newPath, { recursive: true, force: true });
            fs.renameSync(dir, newPath);
          }
          log.success(`Migrated: ${baseName} -> ${FRAMEWORK_DIR_NAME}/${baseName}`);
        });
      }
    }

    ensureDir(frameworkRoot);

    // Step 1: Skills
    log.step('Step 1/4 — Installing AI Skills');
    copyFolderSync(path.join(TEMPLATES_DIR, 'skills'), path.join(frameworkRoot, 'skills'));

    // Step 1.5: Architect Kit
    if (fs.existsSync(path.join(TEMPLATES_DIR, 'Unity'))) {
      const unityDest = hasUnityFolders ? path.join(projectRoot, 'Assets', 'Editor', 'TheUnityArchitect') : path.join(frameworkRoot, 'UnityEditor');
      copyFolderSync(path.join(TEMPLATES_DIR, 'Unity', 'Editor'), unityDest);
      log.success('Architect Kit installed in Assets/Editor.');
    }

    // Step 2: Execution Scripts
    log.step('Step 2/4 — Installing Scripts');
    copyFolderSync(path.join(TEMPLATES_DIR, 'execution'), path.join(frameworkRoot, 'execution'));

    // Step 3: Wiki Scaffolding
    log.step('Step 3/4 — Scaffolding Mega-Brain Wiki');
    const wikiRoot = path.join(frameworkRoot, 'Wiki');
    ['ADR', 'Systems', 'Features', 'Lore'].forEach(sub => ensureDir(path.join(wikiRoot, sub)));
    
    if (!isDryRun) {
      const indexFile = path.join(wikiRoot, 'Index.md');
      if (!fs.existsSync(indexFile)) {
        fs.writeFileSync(indexFile, '# Mega-Brain Wiki Index\n\nWelcome to the architectural and conceptual source of truth for this project.\n\n## Categories\n- [Architecture Decision Records (ADR)](./ADR/)\n- [Core Systems](./Systems/)\n- [Features](./Features/)\n- [Lore & Concept](./Lore/)\n');
      }
      const logFile = path.join(wikiRoot, 'Log.md');
      if (!fs.existsSync(logFile)) {
        fs.writeFileSync(logFile, '# Development Log\n\nSequential record of major changes and architectural decisions.\n\n- ' + new Date().toISOString().split('T')[0] + ': Framework initialized.\n');
      }
    }
    log.success('Wiki structure ready.');

    // Step 4: AI Config
    log.step('Step 4/4 — Configuring AI Agent');
    const markers = detectProjectType(projectRoot);
    injectAIConfig(projectRoot, markers);

    console.log(`\n\x1b[1m\x1b[32m  ✔ The Unity Architect is ready.\x1b[0m`);
    console.log(`\n  All framework files are centralized in: \x1b[33m${FRAMEWORK_DIR_NAME}/\x1b[0m`);
    console.log('  Your AI agent is now configured via \x1b[33magents.md\x1b[0m in the root.');
    console.log('\n  \x1b[2mHappy building!\x1b[0m\n');

  } catch (error) {
    log.error('Installation failed: ' + error.message);
    process.exit(1);
  }
}

main();
