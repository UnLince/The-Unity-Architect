# Next Steps

> What's planned for The Unity Architect. Updated when priorities shift.

---

## Immediate (v1.0.x)

- [ ] **Add `.npmignore`** — Exclude `creando un repo comunitario github.md`, `Contexto/`, `agents.md`, `memory.md`, `otros/` from the published NPM package. Only ship `templates/`, `bin/`, `install.py`, `README.md`, `package.json`.
- [ ] **Test end-to-end install** — Run `npx the-unity-architect --dry-run` from a real Unity project folder and verify all paths resolve correctly.
- [ ] **Fix `parse_editor_log.py` path in execution/** — Currently lives in `Systematic-Debugging-for-Unity/scripts/` but should also be a direct copy in `execution/`.

---

## Short Term (v1.1.0)

- [ ] **Add skill: `unity-mcp-integration`** — Guide for using the Unity MCP server with The Unity Architect. How to set up, what tools are available, how the AI uses them.
- [ ] **Add skill: `unity-testing`** — Unity Test Framework (NUnit), Play Mode vs Edit Mode tests, when and how to test game logic.
- [ ] **Add script: `generate-skill-index.js`** — Auto-generates a summary of all installed skills for the AI to scan quickly without reading each file.
- [ ] **GitHub Actions workflow** — Auto-publish to NPM on version tag push (`v*`).

---

## Medium Term (v2.0.0)

- [ ] **Interactive CLI** — Instead of piping everything at once, ask the user which skills to install (multi-select prompt).
- [ ] **Skill marketplace** — Community-contributed skills follow a schema and can be installed individually: `npx the-unity-architect --skill unity-netcode`.
- [ ] **VS Code extension** — Sidebar panel showing which skills are active, run diagnostic scripts with a button.

---

## Ideas / Backlog

- Skill: `unity-localization`
- Skill: `unity-addressables`
- Skill: `unity-cicd-pipeline`
- Script: `scene-complexity-report.js` — warns when a scene exceeds complexity thresholds
