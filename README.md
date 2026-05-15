<div align="center">
  <h1>🏛️ The Unity Architect</h1>
  <p><strong>A disciplined AI agent framework for Unity development.</strong><br/>
  Skills, best practices, and utility scripts — ready to install in one command.</p>

  <a href="https://www.npmjs.com/package/the-unity-architect"><img src="https://img.shields.io/npm/v/the-unity-architect?color=purple&style=flat-square" alt="npm version"/></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="license"/></a>
  <a href="https://github.com/UnLince/The-Unity-Architect"><img src="https://img.shields.io/badge/github-repo-black?style=flat-square&logo=github" alt="github repo"/></a>
</div>

---

A disciplined AI agent framework for Unity development. Skills, best practices, and utility scripts designed to build robust games correctly from the start.

> [!TIP]
> **New to the framework?** Read the [WALKTHROUGH.md](./WALKTHROUGH.md) for a step-by-step guide on how to ingest existing projects and start your first "Relentless Feature Pipeline".

---

## 🌪️ The Vision: Build Great Games, Fast

Unity development often fails because of **technical debt** and **ambiguous design**. **The Unity Architect** is not just a collection of scripts; it is a **philosophical shift** in how AI helps you build games. It enforces a strict design-first pipeline that forces you to think before you code.

### 🎮 Features
- **Relentless Feature Pipeline:** AI interrogates you about every detail before writing a single line of code.
- **Ubiquitous Language Integration:** Automatic glossary creation (`CONTEXT.md`) that syncs between GDD, code, and Wiki.
- **Mega-Brain Wiki (Institutional Memory):** An AI-managed knowledge base that tracks ADRs (Architectural Decision Records), systems, and lore.
- **Unity 6 Optimized:** Pre-configured with best practices for URP, UI Toolkit (UxmlElement), and high-performance C#.
- **Diagnostic Suite:** CLI tools to audit project health, find broken prefabs, and analyze dependency graphs without opening the Editor.
- **God Mode (Natural Language Creation):** Ask the IA to "Create a Player object in the scene with a click-to-move system using MOBA-like best practices for snappy game feel" and watch it build the objects, scripts, and components for you.

> [!TIP]
> **New in v1.3.1:** Full English alignment across all scripts, diagnostics, and UI strings.

---

## 🛠️ Installation

Run this in your Unity project root:

```bash
npx the-unity-architect
```

*For local/dev usage:*
```bash
git clone https://github.com/UnLince/The-Unity-Architect.git
cd The-Unity-Architect
python install.py
```

---

## 🏗️ The Senior Architect Persona

When you install this framework, your AI (Cursor, Windsurf, Antigravity) will adopt a **Senior Architect Soul**:

1.  **Architecture First:** It will refuse to write large systems without a GDD.
2.  **Scientific Debugging:** It will use the diagnostic scripts before guessing fixes.
3.  **Traceability:** It will silently log every major technical decision in your project's Wiki.

---

## 🧠 The Mega-Brain Wiki

The framework creates a centralized `The-Unity-Architect/Wiki/` folder. The AI maintains this wiki automatically via three triggers:

1.  **GDD Approval:** New features are archived in `Wiki/Features/`.
2.  **ADR Logging:** Technical tradeoffs (e.g., "Why we used an Event Bus") are saved in `Wiki/ADR/`.
3.  **Manual Librarian:** Say *"Update the wiki"* to consolidate all recent session knowledge into the index.

---

## 📂 Project Structure

> **Upgrading?** The installer now detects previous versions and offers an **interactive clean-up** to ensure your project stays tidy.

```text
                      A R C H I T E C T  v1.3.2
```

## 🛠️ The Architect Toolkit (v1.3.2)

Everything is now centralized under the `The-Unity-Architect/` directory to keep your project clean:

- **`skills/`**: Markdown-based skill modules that teach your AI exactly how to build and debug.
- **`execution/`**: Node.js and Python diagnostic scripts.
- **`Wiki/`**: The institutional memory of your project.
- **`WALKTHROUGH.md`**: The essential guide for first-time users.

---

## 📜 License

MIT License. Developed with passion by **UnLince** (Pedro Luchsinger).

---

*"Build it correctly, or don't build it at all."* — **The Unity Architect**
