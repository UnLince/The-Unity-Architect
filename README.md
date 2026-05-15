<div align="center">
  <h1>🏛️ The Unity Architect</h1>
  <p><strong>Your AI finally understands how Unity actually works.</strong><br/>
  Install it in one command. Build games correctly, from day one.</p>

  <a href="https://www.npmjs.com/package/the-unity-architect"><img src="https://img.shields.io/npm/v/the-unity-architect?color=purple&style=flat-square" alt="npm version"/></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="license"/></a>
  <a href="https://github.com/UnLince/The-Unity-Architect"><img src="https://img.shields.io/badge/github-repo-black?style=flat-square&logo=github" alt="github repo"/></a>
</div>

---

## The Problem With AI and Gamedev

You ask your AI to "add a shooting mechanic." It generates 300 lines of code in a single MonoBehaviour. No interfaces. No events. No pooling. A `PlayerController.cs` that handles input, physics, animation, shooting, and sound — all in one place.

Six weeks later, you can't change anything without breaking everything.

**This is not the AI's fault. It wasn't given the right rules.**

The Unity Architect is a framework of AI skills, Markdown protocols, and diagnostic scripts that teaches your AI to think like a senior Unity engineer — not a college student on a deadline.

> [!TIP]
> **New in v1.3.3:** Refined "Senior Architect" persona with stricter Design-First enforcement.

> [!NOTE]
> **New to the framework?** Read [WALKTHROUGH.md](./WALKTHROUGH.md) for your first session, whether your project is brand new or already has 50,000 lines of code.

---

## Install It

```bash
npx the-unity-architect
```

That's it. The installer will:

1. Copy all AI skills into `The-Unity-Architect/skills/`
2. Set up the **Mega-Brain Wiki** structure in `The-Unity-Architect/Wiki/`
3. Install the **Architect Kit** C# tools inside `Assets/Editor/`
4. Inject the agent rules into your `agents.md`, `.cursorrules`, or `CLAUDE.md` — whatever AI tool you use
5. Drop a `WALKTHROUGH.md` in your root so you know exactly where to start

---

## What You Get

### 🎯 4 AI Skill Modules

Skills are Markdown files your AI reads before it does anything. They define exactly how it should think, what it can and cannot do, and which diagnostic tools to run. Think of them as standing operating procedures for your AI — not prompts, but protocols.

---

#### `unity-feature-pipeline` — The Design-First Enforcer

This is the most important skill in the framework. **It prevents your AI from writing a single line of code until the design is solid.**

When you say "I want to add a crafting system," a generic AI writes code. This skill makes the AI interview you first — relentlessly — until every ambiguity is resolved.

**How it works — 4 mandatory phases:**

| Phase | Name | What happens |
|:------|:-----|:-------------|
| 1 | **The Grill** (`01-quest-giver.md`) | The AI interrogates you about edge cases, performance targets, and constraints. It forces the creation of a `CONTEXT.md` — a glossary of every term your project will use in code. |
| 2 | **The GDD** (`02-gdd-writer.md`) | The approved design gets turned into a structured Game Design Document — the contract between you and the code. |
| 3 | **The Issue Slicer** (`03-issue-slicer.md`) | The GDD is broken into atomic, vertical technical tasks. No vague tickets like "do the inventory." Only precise, implementable issues. |
| 4 | **Implementation** | Only now does the AI write code. And it hands off to `unity-architecture-and-best-practices` to do it correctly. |

**The Iron Laws (what the AI is forbidden to do):**
- Write implementation code before Phase 3 is done
- Accept a vague feature request without interrogating you first
- Let a term in the code diverge from the glossary in `CONTEXT.md`

---

#### `unity-architecture-and-best-practices` — The Senior Engineer's Rulebook

Seven sub-modules covering the architecture decisions that separate a scalable game from a prototype that falls apart at 10,000 lines.

The AI reads these before designing any system. The result: code that is composable, testable, and refactorable — not a tangle of direct references between every system in the game.

**The Iron Laws (always enforced):**
- `Health.cs` knows nothing about the blood particle system — Simulation is strictly separate from Presentation
- No God Classes — `PlayerController.cs` cannot handle input, physics, animation, and audio simultaneously
- Decoupling by default — C# Events, ScriptableObject channels, or Observer Pattern. Direct references are a last resort
- No GC in `Update` — Object Pooling is mandatory for anything that spawns frequently

---

#### `unity-systematic-debugging` — No More Witch Doctor Debugging

You paste an error. A generic AI guesses a fix. The fix works for dos days. The real bug was somewhere else entirely.

This skill forces the AI to apply the **scientific method** to every bug — forming falsifiable hypotheses, designing experiments, and confirming the root cause before writing a single line of solution code.

---

#### `unity-ui-toolkit` — Modern UI, Done Right

Stop using legacy uGUI for new features. This skill teaches your AI the Unity 6 way: `UIDocument`, UXML, USS, and the new `[UxmlElement]` attribute for custom components.

---

### 🛠️ 7 Diagnostic Scripts

| Script | Language | What it does |
|:-------|:---------|:-------------|
| `unity-doctor.js` | Node.js | Scans `.cs` files for architectural violations |
| `unity-audit.js` | Node.js | Deep static analysis and dangerous APIs |
| `unity-project-graph.js` | Node.js | Builds a dependency graph and finds broken GUIDs |
| `package-audit.js` | Node.js | Security and compatibility audit for assets |
| `find_missing_scripts.py` | Python | Missing script detector in prefabs/scenes |
| `parse_editor_log.py` | Python | Deduplicated error analysis from Unity logs |
| `scaffold_repo.py` | Python | Folder structure generator |

---

### 🧠 The Mega-Brain Wiki

Institutional memory for your game. Automatically updated via 3 triggers:

1.  **GDD Approval:** Designs archived in `Wiki/Features/`.
2.  **ADR Logging:** Technical tradeoffs saved in `Wiki/ADR/`.
3.  **Manual Librarian:** Say *"Update the wiki"* to consolidate recent session knowledge.

---

## The Architect Toolkit (v1.3.3)

Everything installs into a single centralized folder:

```text
                      A R C H I T E C T  v1.3.3
```

```
The-Unity-Architect/
├── skills/
├── execution/
└── Wiki/
```

The AI agent rules are injected into your existing `agents.md`, `.cursorrules`, `CLAUDE.md`, or `.windsurfrules`.

---

## Quickstart

**New project:**
```bash
npx the-unity-architect
```

**Existing project:**
```bash
npx the-unity-architect
# Then tell your AI: "Run diagnostics and populate the Wiki."
```

Read [WALKTHROUGH.md](./WALKTHROUGH.md) for a complete guide.

---

## License

MIT. Built by **Pedro Luchsinger (UnLince)**.

---

*"Build it correctly, or don't build it at all."*
