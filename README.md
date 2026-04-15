<div align="center">
  <h1>🏛️ The Unity Architect</h1>
  <p><strong>An expert AI agent framework for Unity development.</strong><br/>
  Skills, best practices, and utility scripts — ready to install in one command.</p>

  <a href="https://www.npmjs.com/package/the-unity-architect"><img src="https://img.shields.io/npm/v/the-unity-architect?color=purple&style=flat-square" alt="npm version"/></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="license"/></a>
  <img src="https://img.shields.io/badge/Unity-2021%2B-black?style=flat-square&logo=unity" alt="Unity 2021+"/>
  <img src="https://img.shields.io/badge/Works%20with-Cursor%20%7C%20Antigravity%20%7C%20Claude-blueviolet?style=flat-square" alt="Works with Cursor, Antigravity, Claude"/>
</div>

---

## You don't have to be a Unity expert to build great games.

You just need the right architect in your corner.

---

Most people who want to make games hit the same wall: Unity is powerful, but it's brutal to learn. The documentation is dense. The errors are cryptic. The architecture decisions that feel fine today become the bugs you curse at 3am six months later.

So you Google. You copy from Stack Overflow. You paste from ChatGPT without knowing if the pattern is good or five years outdated. The AI helps — but it doesn't *know* your project. It doesn't know Unity's quirks. And it definitely doesn't know best practices for a scalable codebase.

**The Unity Architect fixes that.**

It's a framework you install once and forget about. After that, your AI assistant stops being a generic code autocomplete and starts acting like a senior Unity developer who's shipped real games — one who asks the right questions before writing a line of code, follows proven architecture patterns, and knows exactly how to diagnose what's breaking and why.

### For developers who don't know how to code yet

You've heard of "vibe coding" — describing what you want and letting the AI build it. That works for small things. But without structure, the AI builds on sand. Three features in, everything breaks and the AI can't figure out why, because nobody taught it *how Unity actually works*.

The Unity Architect gives the AI that knowledge. The result: you can describe the game you want to build, and the AI will architect it properly — not just make it work today, but make it *stay* working as your game grows.

**You can build a complete game. Almost entirely through conversation.**

### For developers who know Unity well

You know what good architecture looks like. You've refactored enough bad code to have opinions. What you don't want is to explain ScriptableObject event systems, object pooling patterns, or DOTS diagnostics to an AI every single session.

The Unity Architect pre-loads all of that. The AI reads the skill files before acting, follows your established patterns, runs diagnostic scripts when something breaks, and stops making the junior mistakes that slow you down.

**Less time explaining. More time building.**

---

### What is this, technically?

**The Unity Architect** is a plug-and-play framework that transforms any AI coding assistant (Cursor, Antigravity/Gemini, Claude) into a **senior Unity architect and debugger**.

It provides:
- 🧠 **AI Skills** — Structured knowledge files the AI reads to apply expert Unity patterns
- 🛠️ **Execution Scripts** — Node.js & Python utilities for project auditing, dependency graphs, and log parsing
- ⚡ **Auto-configuration** — Automatically wires itself into your AI tool's config (`.cursorrules`, `.gemini/agents.md`, `CLAUDE.md`)

---

## Quick Install

Run this from the **root of your Unity project**:

```bash
npx the-unity-architect
```

That's it. The installer will:

1. Create a `skills/` folder with expert AI guidance files
2. Create an `execution/` folder with diagnostic scripts
3. Inject rules into your AI tool's config so it reads the skills automatically

### Options

```bash
npx the-unity-architect --dry-run   # Preview what will be installed (no changes)
npx the-unity-architect --force     # Skip Unity project detection, install anywhere
```

---

## What Gets Installed

### `skills/` — AI Knowledge Base

| Skill | Description |
|-------|-------------|
| `unity-systematic-debugging/` | Step-by-step scientific debugging protocol for Unity |
| `unity-architecture-and-best-practices/` | Clean code, design patterns, and modular system architecture |

Each skill folder contains a `SKILL.md` (the main AI directive) plus detailed reference modules:

**Systematic Debugging modules:**

- `01-scientific-method-and-logs.md` — Hypothesis-driven debugging with Unity logs
- `02-state-and-serialization.md` — Inspector state, serialization pitfalls
- `03-memory-and-gc-profiling.md` — Memory leaks, GC pressure, Profiler workflow
- `04-dots-and-ecs-diagnostics.md` — DOTS/ECS specific debugging techniques
- `05-rendering-and-gpu-bottlenecks.md` — GPU profiling and render pipeline issues

**Architecture & Best Practices modules:**

- `01-planning-and-workflow.md` — Technical planning before coding
- `02-clean-code-and-conventions.md` — Naming, SOLID, Unity conventions
- `03-core-design-patterns.md` — ScriptableObject events, State Machine, Command pattern
- `04-modular-systems-and-glue-code.md` — Service Locator, dependency injection
- `05-ui-and-presentation-architecture.md` — MVP/MVC for Unity UI
- `06-combat-and-vfx-decoupling.md` — Data-driven combat, pooling VFX
- `07-performance-coding-patterns.md` — Burst, DOTS, Job System, object pooling

### `execution/` — Diagnostic Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `unity-doctor.js` | `node execution/unity-doctor.js` | Full project health check |
| `unity-audit.js` | `node execution/unity-audit.js` | Code quality and anti-pattern audit |
| `unity-project-graph.js` | `node execution/unity-project-graph.js` | Scene and dependency graph |
| `package-audit.js` | `node execution/package-audit.js` | Package & UPM dependency checker |
| `parse_editor_log.py` | `python execution/parse_editor_log.py` | Parse Editor.log for errors |
| `find_missing_scripts.py` | `python execution/find_missing_scripts.py` | Find missing MonoBehaviour references |
| `scaffold_repo.py` | `python execution/scaffold_repo.py` | Scaffold a new module/system |

---

## How the AI Uses This

After installation, your AI assistant will automatically:

1. **Read the relevant SKILL.md** before writing code or debugging
2. **Run diagnostic scripts** when asked to audit or inspect the project
3. **Follow expert Unity patterns** from the knowledge modules
4. **Integrate with Unity MCP** if available in the session

The AI is trained to summarize which rules it's applying (token-saving protocol) before acting, so you always know what framework it's following.

---

## Works With

| Tool | Config File Created/Updated |
|------|-----------------------------|
| **Cursor** | `.cursorrules` |
| **Antigravity (Gemini)** | `.gemini/agents.md` |
| **Claude Code** | `CLAUDE.md` |
| **Windsurf** | `.windsurfrules` |

If none are detected, defaults to creating `.cursorrules`.

---

## Alternative Install (No Node.js required)

For developers who only have Python:

```bash
curl -sSL https://raw.githubusercontent.com/UnLince/The-Unity-Architect/main/install.py | python3 -
```

Or on Windows PowerShell:

```powershell
iwr https://raw.githubusercontent.com/UnLince/The-Unity-Architect/main/install.py | python -
```

---

## Project Structure

```
The-Unity-Architect/
├── package.json              # NPM package config (npx entry point)
├── bin/
│   └── install.js            # CLI installer script
├── templates/
│   ├── ai-config/
│   │   └── injection.md      # AI rules injected into your config files
│   ├── skills/
│   │   ├── unity-systematic-debugging/
│   │   └── unity-architecture-and-best-practices/
│   └── execution/
│       ├── unity-doctor.js
│       ├── unity-audit.js
│       ├── unity-project-graph.js
│       ├── package-audit.js
│       ├── parse_editor_log.py
│       ├── find_missing_scripts.py
│       └── scaffold_repo.py
├── install.py                # Python alternative installer
└── README.md
```

---

## Contributing

Contributions are welcome! If you have Unity skills, patterns, or scripts to add:

1. Fork the repo
2. Add your skill folder under `templates/skills/your-skill-name/`
3. Include a `SKILL.md` with clear AI directives
4. Open a PR with a description of what the skill covers

---

## License

MIT © [UnLince](https://github.com/UnLince)
