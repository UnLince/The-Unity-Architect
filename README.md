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
> **New in v1.3.4:** Definitive long-form documentation and refined AI persona.

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

This skill also includes:

- `ADR-FORMAT.md` — Template for Architecture Decision Records (why you chose Event Bus over Singletons, why you're using UGS instead of Photon)
- `CONTEXT-FORMAT.md` — Template for the Ubiquitous Language glossary

---

#### `unity-architecture-and-best-practices` — The Senior Engineer's Rulebook

Seven sub-modules covering the architecture decisions that separate a scalable game from a prototype that falls apart at 10,000 lines.

The AI reads these before designing any system. The result: code that is composable, testable, and refactorable — not a tangle of direct references between every system in the game.

**The Iron Laws (always enforced):**

- `Health.cs` knows nothing about the blood particle system — Simulation is strictly separate from Presentation
- No God Classes — `PlayerController.cs` cannot handle input, physics, animation, and audio simultaneously
- Decoupling by default — C# Events, ScriptableObject channels, or Observer Pattern. Direct references are a last resort
- No GC in `Update` — Object Pooling is mandatory for anything that spawns frequently

**The 7 sub-modules:**

| File | What it covers |
|:-----|:---------------|
| `01-planning-and-workflow.md` | Task planning, version control, and grayboxing |
| `02-clean-code-and-conventions.md` | Naming conventions, access modifiers, encapsulation |
| `03-core-design-patterns.md` | State Machines, Observers, Event Channels, Factories |
| `04-modular-systems-and-glue-code.md` | Connecting components without spaghetti, `[RequireComponent]` |
| `05-ui-and-presentation-architecture.md` | MVP/MVC decoupling with UI Toolkit and uGUI |
| `06-combat-and-vfx-decoupling.md` | Hitboxes, `FixedUpdate` determinism, safe animation triggers |
| `07-performance-coding-patterns.md` | Caching, non-allocating APIs, avoiding GC in hot paths |

---

#### `unity-systematic-debugging` — No More Witch Doctor Debugging

You paste an error. A generic AI guesses a fix. The fix works for two days. The real bug was somewhere else entirely.

This skill forces the AI to apply the **scientific method** to every bug — forming falsifiable hypotheses, designing experiments, and confirming the root cause before writing a single line of solution code.

**The Iron Laws:**

- Zero "blind fixes." If the root cause isn't known, the next step is a question or an experiment — never a patch
- Code is only 50% of the truth. Inspector state, execution order, corrupted Prefabs, and ScriptableObjects are always part of the investigation
- Every debugging session maintains a `debug_report.md` on disk — so you never lose context across sessions

**The 5 debugging sub-modules:**

| File | What it covers |
|:-----|:---------------|
| `01-scientific-method-and-logs.md` | Building a fast, deterministic feedback loop |
| `02-state-and-serialization.md` | Inspector state, prefab corruption, serialization edge cases |
| `03-memory-and-gc-profiling.md` | GC.Alloc, memory leaks, Profiler interpretation |
| `04-dots-and-ecs-diagnostics.md` | Entity system debugging and job scheduling issues |
| `05-rendering-and-gpu-bottlenecks.md` | Draw calls, shader errors, GPU profiling |

---

#### `unity-ui-toolkit` — Modern UI, Done Right

Stop using legacy uGUI for new features. This skill teaches your AI the Unity 6 way: `UIDocument`, UXML, USS, and the new `[UxmlElement]` attribute for custom components.

The most common UI performance mistake — modifying `width`, `height`, or `margin` from code in every frame — forces a full Layout Recalculation on the CPU. This skill enforces GPU-side animation (`style.translate`, `style.rotate`) and smart visibility toggling (`DisplayStyle.None` vs. `Visibility.Hidden`).

---

### 🛠️ 7 Diagnostic Scripts

Run from the terminal, without opening the Unity Editor. Each one generates a clean report your AI can read and act on.

| Script | Language | What it does |
|:-------|:---------|:-------------|
| `unity-doctor.js` | Node.js | Scans `.cs` files for architectural violations: God Classes, VFX without pooling, `GetComponent` in `Update`, layout animation in hot paths |
| `unity-audit.js` | Node.js | Deep static analysis: dangerous APIs, deprecated Unity 6 methods (`FindObjectOfType`), physics allocations (`OverlapSphere` without NonAlloc) |
| `unity-project-graph.js` | Node.js | Builds a dependency graph of every Prefab, Scene, and Script. Exports `project-graph.json` + `project-graph-report.md`. Use `--missing` to find broken GUIDs instantly |
| `package-audit.js` | Node.js | Security and compatibility check for 3rd-party assets: `System.IO`, `System.Net`, `Application.OpenURL`, Built-in vs. URP shaders |
| `find_missing_scripts.py` | Python | Scans every `.prefab` and `.unity` file for `m_Script: {fileID: 0}` — the signature of a Missing Script |
| `parse_editor_log.py` | Python | Parses the Unity `Editor.log` and extracts unique exceptions and errors, deduplicated and formatted for AI consumption |
| `scaffold_repo.py` | Python | Creates the full `Assets/_Project/` folder structure: `Core`, `Gameplay`, `Characters`, `UI`, `Audio`, `VFX`, `Data`, `Prefabs` |

---

### 🧠 The Mega-Brain Wiki — Institutional Memory for Your Game

Here's what happens in most game projects: decisions get made in Slack messages, in your head, or in a 6-month-old commit message. Six months later, nobody — including you — remembers *why* you chose one approach over another.

The Mega-Brain Wiki solves this. It's an AI-maintained knowledge base that lives in `The-Unity-Architect/Wiki/`. Your AI keeps it updated automatically. You never have to think about documentation — it's a byproduct of your normal workflow.

**Three triggers that write the Wiki for you:**

**Trigger 1 — GDD Approval**
When a Feature Design Document is approved, the AI summarizes the core mechanic and archives it in `Wiki/Features/`. Next time someone asks "how does the combo system work?", the answer is already written.

**Trigger 2 — Architecture Decisions (ADR Logging)**
Every time you and the AI agree on a major technical decision — Event Bus vs. Singleton, Netcode for GameObjects vs. Mirror, UGS vs. Photon — the AI writes an Architecture Decision Record in `Wiki/ADR/`. The record captures the decision, the rationale, and the alternatives you considered.

**Trigger 3 — Manual Librarian**
Say *"Update the wiki"* at any point. The AI reviews the entire session, extracts new lore, mechanics, and architectural decisions, and consolidates them into the index.

**Wiki structure:**

```
The-Unity-Architect/Wiki/
├── ADR/          ← Architecture Decision Records
├── Features/     ← Approved GDDs and feature documentation  
├── Systems/      ← Core system architecture notes
├── Lore/         ← Game world, narrative, and design bible
└── Index.md      ← The central map of everything
```

---

### 🎮 Architect Kit (C# Editor Tools)

The framework also installs a set of custom Unity Editor tools in `Assets/Editor/TheUnityArchitect/`:

**Scene Insight** (`ArchitectKitSceneInsight.cs`)
One click from `Architect Kit → Tools → Dump Scene Insight` exports the full scene hierarchy — every GameObject, every component, every active state — as a structured JSON file. Feed it to your AI for analysis without having to describe the scene manually.

---

## How It Works in Practice

**Scenario: You're building a Grappling Hook system.**

Without The Unity Architect:
> You: "Add a grappling hook"  
> AI: *writes 400 lines across 2 files*  
> You: *it mostly works*  
> 3 weeks later: *changing the rope physics breaks the player controller*

With The Unity Architect:

> You: "I want to add a grappling hook"  
>
> AI (reading `01-quest-giver.md`): "Before I write anything, I need to understand the design. Is the grapple point always a fixed surface, or can it attach to dynamic objects? What's the maximum range? Does it interrupt other abilities? What does 'grappling' feel like — instant pull, or physics-based swinging?"  
>
> *20 minutes of design questions later...*  
>
> AI: "Here's your `CONTEXT.md` with the glossary. Terms defined: `GrappleAnchor`, `GrappleRange`, `PullForce`, `SwingMode`. Here's the GDD. Review and approve it."  
>
> *You approve.*  
>
> AI: "Here are 4 atomic issues broken out of the GDD. Which one do you want to start with?"  
>
> *You pick Issue 1.*  
>
> AI (reading `unity-architecture-and-best-practices`): "Here's my proposed component breakdown: `GrappleController.cs` (input + state), `GrapplePhysics.cs` (force calculation, FixedUpdate), `GrappleRenderer.cs` (rope VFX). Communication via C# Events. Approve this structure?"  
>
> *You approve. AI writes the code.*

The grappling hook works. And three weeks later, changing the rope physics only requires touching `GrapplePhysics.cs`.

---

## Who This Is For

**If you're a vibecoder or indie dev:**
You've been using AI to build your game and it's been mostly great — until the codebase got to a certain size and suddenly every change breaks something else. The Unity Architect gives your AI the structural rules it was missing. You still talk to it naturally. It just knows how to say "wait, let's design this first."

**If you're an experienced Unity developer:**
You know exactly what spaghetti code costs. You've read the articles about ScriptableObject architecture, the Ryan Hipple GDC talk, the articles about proper decoupling. The Unity Architect encodes all of that as AI operating constraints — so you don't have to enforce it manually in every conversation.

**If you're onboarding collaborators onto an existing project:**
The Wiki gives every new contributor instant access to every architectural decision ever made on the project. The Ubiquitous Language glossary means everyone writes code in the same vocabulary. No more "why is this called `SkillUser` when the GDD calls it `AbilityCaster`?"

---

## vs. Generic AI / Generic Skills

| | Generic AI | Generic Skills | The Unity Architect |
|:--|:--:|:--:|:--:|
| Knows Unity 6 APIs | ✅ | ✅ | ✅ |
| Enforces SOLID principles | ❌ | Partial | ✅ |
| Stops you before bad architecture | ❌ | ❌ | ✅ |
| Maintains project memory across sessions | ❌ | ❌ | ✅ |
| Runs diagnostic scripts on your codebase | ❌ | ❌ | ✅ |
| Builds a Ubiquitous Language glossary | ❌ | ❌ | ✅ |
| Logs every architectural decision | ❌ | ❌ | ✅ |
| Works with Cursor, Windsurf, Antigravity | ✅ | Partial | ✅ |

---

## 🛠️ The Architect Toolkit (v1.3.4)

Everything installs into a single centralized folder, so your Unity project stays clean:

```
The-Unity-Architect/
├── skills/
│   ├── unity-feature-pipeline/      ← Design-first enforcer (4 sub-modules)
│   ├── unity-architecture-and-best-practices/  ← Senior engineer rulebook (7 sub-modules)
│   ├── unity-systematic-debugging/  ← Scientific debugging (5 sub-modules)
│   └── unity-ui-toolkit/            ← UI Toolkit modern patterns
├── execution/
│   ├── unity-doctor.js              ← Architectural health scan
│   ├── unity-audit.js               ← Deep static analysis
│   ├── unity-project-graph.js       ← Dependency graph generator
│   ├── package-audit.js             ← Security and compatibility audit
│   ├── find_missing_scripts.py      ← Missing script detector
│   ├── parse_editor_log.py          ← Editor log parser
│   └── scaffold_repo.py             ← Folder structure generator
└── Wiki/
    ├── ADR/                         ← Architecture Decision Records
    ├── Features/                    ← Approved GDDs
    ├── Systems/                     ← Core system notes
    ├── Lore/                        ← Game world and design bible
    └── Index.md                     ← The map of everything
```

The AI agent rules are injected into your existing `agents.md`, `.cursorrules`, or `CLAUDE.md`. No new config files. It works with whatever AI tool you're already using.

---

## Quickstart

**New project:**

```bash
npx the-unity-architect
# Then tell your AI: "I want to add [feature]"
# The AI will start Phase 1 automatically
```

**Existing project:**

```bash
npx the-unity-architect
# Then tell your AI:
# "Run unity-doctor.js and unity-project-graph.js, then use Trigger 3
#  to populate the Wiki with everything you find in my current codebase."
```

Read [WALKTHROUGH.md](./WALKTHROUGH.md) for a complete step-by-step guide.

---

## License

MIT. Built by **Pedro Luchsinger (UnLince)**.

---

*"Build it correctly, or don't build it at all."*
