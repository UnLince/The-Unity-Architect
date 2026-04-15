# Decisions Log

> Key technical and strategic decisions made in this project, with rationale.  
> This is the "why" record — so future sessions don't re-litigate solved problems.

---

## 2026-04-15

### D-001: NPM Package Name → `the-unity-architect`
**Decision:** Use `the-unity-architect` as the NPM package name (not `unity-ai-agent-framework` as the original Gemini plan suggested).  
**Rationale:** Aligns with the GitHub repo name (`UnLince/The-Unity-Architect`). More memorable, brand-consistent.  
**Status:** Confirmed, published.

---

### D-002: Granular Token with Bypass 2FA (not Classic Automation Token)
**Decision:** Use a Granular Access Token with the "Bypass 2FA" option enabled for NPM publishing.  
**Rationale:** User already had a granular token created. Classic Automation token is equivalent in risk for manual local publishing. Both are valid choices.  
**Status:** Used for v1.0.0 publish. Token expires in 90 days (July 14, 2026).

---

### D-003: Skills live in `templates/skills/` not at root
**Decision:** All skill files are nested under `templates/skills/[skill-name]/` rather than at the project root.  
**Rationale:** The root of this repo is the NPM package, not a Unity project. All installable content is under `templates/` to clearly separate "package infrastructure" from "what gets installed."  
**Status:** Implemented.

---

### D-004: Python installer as a first-class alternative
**Decision:** `install.py` at the root is a fully supported install method, not an afterthought.  
**Rationale:** Many game devs have Python (comes with most Unity workflows) but not Node.js. Removing that dependency barrier broadens adoption.  
**Status:** Implemented. Downloads zip from GitHub main branch and extracts templates.

---

### D-005: agents.md system architecture (immutable identity + living memory)
**Decision:** Split AI context into three layers:
1. `agents.md` — Immutable soul/mission/operating principles
2. `memory.md` — Living preferences, corrections, learned behaviors (proposed by AI, approved by user)
3. `Contexto/` — Current project state, next steps, decisions (updated frequently)  
**Rationale:** Keeps the core directives lean and stable. Allows preferences to evolve without polluting the identity file. Mirrors how a good senior developer operates: clear principles + adaptive memory.  
**Status:** Implemented.
