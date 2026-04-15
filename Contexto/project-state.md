# Project State

> Updated at the end of each significant work session.

---

## What is this project?

**The Unity Architect** is an open-source framework that turns any AI coding assistant into an expert Unity developer. It installs via `npx the-unity-architect` and provides:
- AI Skills (structured knowledge files the AI reads before acting)
- Execution Scripts (Node.js + Python diagnostics for Unity projects)
- Auto-configuration (writes to `.cursorrules`, `.gemini/agents.md`, or `CLAUDE.md`)

---

## Current Version

`v1.0.0` — Published to NPM and GitHub on 2026-04-15.

---

## What's Working

- [x] `npx the-unity-architect` installs skills + scripts + AI config
- [x] `--dry-run` and `--force` flags supported
- [x] Detects Cursor, Antigravity, Claude config files and injects rules
- [x] 2 skills included: `unity-systematic-debugging`, `unity-architecture-and-best-practices`
- [x] 7 execution scripts included
- [x] Python alternative installer (`install.py`) for non-Node users
- [x] README with full About copy, install docs, structure reference
- [x] `agents.md`, `memory.md`, `Contexto/` folder established

---

## Known Issues / Gaps

- `bin` entry in package.json uses `bin/install.js` path (path without `./` was flagged by NPM — resolved for v1.0.0)
- No `.npmignore` yet — using `.gitignore` as fallback (works, but generates a warning)
- The `creando un repo comunitario github.md` planning file is included in the NPM package (unnecessary — exclude in next version via `.npmignore`)

---

## Stack

- **Runtime:** Node.js ≥ 18
- **Registry:** NPM (`the-unity-architect`)
- **Repo:** GitHub (`UnLince/The-Unity-Architect`)
- **No build step** — pure JavaScript + Markdown + Python scripts
