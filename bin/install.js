#!/usr/bin/env node

/**
 * The Unity Architect — Installer
 * Centralizes skills, execution scripts, and wiki in a single folder.
 * Injects rules into agents.md and other AI config files.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// --- Config ---
const PKG_ROOT = path.resolve(__dirname, '..');
const TEMPLATES_DIR = path.join(PKG_ROOT, 'templates');
const FRAMEWORK_DIR_NAME = 'The-Unity-Architect';

const log = {
  success: (m) => console.log(`\x1b[32m✔  ${m}\x1b[0m`),
  info: (m) => console.log(`\x1b[36mℹ  ${m}\x1b[0m`),
  warn: (m) => console.log(`\x1b[33m⚠  ${m}\x1b[0m`),
  error: (m) => console.log(`\x1b[31m✖  ${m}\x1b[0m`),
  step: (m) => console.log(`\n\x1b[1m\x1b[35m▶ ${m}\x1b[0m`)
};

function copyFolderSync(from, to) {
  if (!fs.existsSync(from)) return;
  if (!fs.existsSync(to)) fs.mkdirSync(to, { recursive: true });
  fs.readdirSync(from).forEach(element => {
    if (fs.lstatSync(path.join(from, element)).isFile()) {
      fs.copyFileSync(path.join(from, element), path.join(to, element));
    } else {
      copyFolderSync(path.join(from, element), path.join(to, element));
    }
  });
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function askQuestion(query) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(`  ${query} `, ans => {
    rl.close();
    resolve(ans.toLowerCase());
  }));
}

async function run() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');
  const isForce = args.includes('--force');
  const projectRoot = process.cwd();
  const frameworkRoot = path.join(projectRoot, FRAMEWORK_DIR_NAME);

  console.log('\x1b[35m');
  console.log('     ████████╗██╗  ██╗███████╗    ██╗   ██╗███╗   ██╗██╗████████╗██╗   ██╗');
  console.log('     ╚══██╔══╝██║  ██║██╔════╝    ██║   ██║████╗  ██║██║╚══██╔══╝╚██╗ ██╔╝');
  console.log('        ██║   ███████║█████╗      ██║   ██║██╔██╗ ██║██║   ██║    ╚████╔╝ ');
  console.log('        ██║   ██╔══██║██╔══╝      ██║   ██║██║╚██╗██║██║   ██║     ╚██╔╝  ');
  console.log('        ██║   ██║  ██║███████╗    ╚██████╔╝██║ ╚████║██║   ██║      ██║   ');
  console.log('        ╚═╝   ╚═╝  ╚═╝╚══════╝     ╚═════╝ ╚═╝  ╚════╝╚═╝   ╚═╝      ╚═╝   ');
  console.log('\x1b[1m                      A R C H I T E C T  v1.3.4\x1b[0m');
  console.log('');

  if (isDryRun) log.warn('Running in DRY-RUN mode.\n');

  const hasUnityFolders = fs.existsSync(path.join(projectRoot, 'Assets'));
  if (!hasUnityFolders) {
    log.warn('No standard Unity "Assets" folder found. Proceeding anyway...');
  }

  // AI Configuration Injection
  log.step('Step 0/4 — AI Config Injection');
  const injectionPath = path.join(TEMPLATES_DIR, 'ai-config', 'injection.md');
  if (fs.existsSync(injectionPath)) {
    const injection = fs.readFileSync(injectionPath, 'utf-8');

    const targets = [
      { name: 'agents.md', path: path.join(projectRoot, 'agents.md'), type: 'markdown' },
      { name: '.cursorrules', path: path.join(projectRoot, '.cursorrules'), type: 'markdown' },
      { name: 'CLAUDE.md', path: path.join(projectRoot, 'CLAUDE.md'), type: 'markdown' },
      { name: '.windsurfrules', path: path.join(projectRoot, '.windsurfrules'), type: 'markdown' }
    ];

    targets.forEach(target => {
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

  // Step 2: Scripts
  log.step('Step 2/4 — Execution Scripts');
  copyFolderSync(path.join(TEMPLATES_DIR, 'execution'), path.join(frameworkRoot, 'execution'));

  // Step 3: Wiki Structure
  log.step('Step 3/4 — Mega-Brain Wiki');
  const wikiPath = path.join(frameworkRoot, 'Wiki');
  ['ADR', 'Systems', 'Features', 'Lore'].forEach(sub => ensureDir(path.join(wikiPath, sub)));
  
  const indexPath = path.join(wikiPath, 'Index.md');
  if (!fs.existsSync(indexPath)) {
    fs.writeFileSync(indexPath, '# Mega-Brain Wiki Index\n\n## Categories\n- [ADR](./ADR/)\n- [Systems](./Systems/)\n- [Features](./Features/)\n- [Lore](./Lore/)\n');
  }
  log.success('Wiki architecture ready.');

  // Step 4: Walkthrough
  log.step('Step 4/4 — Finalizing');
  const walkthroughSrc = path.join(PKG_ROOT, 'WALKTHROUGH.md');
  const walkthroughDst = path.join(projectRoot, 'WALKTHROUGH.md');
  if (fs.existsSync(walkthroughSrc)) {
    if (!isDryRun) {
      fs.copyFileSync(walkthroughSrc, walkthroughDst);
      log.success('Walkthrough guide copied to project root.');
    }
  }

  log.success(`The Unity Architect centralized in ${FRAMEWORK_DIR_NAME}/`);
  console.log('\n\x1b[1m\x1b[32mSUCCESS: Ready to build greatness.\x1b[0m\n');
}

run().catch(err => {
  log.error(err.message);
  process.exit(1);
});
