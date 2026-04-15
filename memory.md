# Memory — User Preferences & Learned Behaviors

> This file is the AI's long-term memory for *this user* and *this project*.  
> Updated whenever a new preference, correction, or pattern is identified.  
> The AI should read this at the start of every session.  
> The AI may propose additions to this file — the user approves before they are written.

---

## Working Style

- **High agency.** The user gives direction; the AI executes autonomously. Don't ask for permission on obvious next steps.
- **Spanish preferred** for conversation. Code, file names, and technical terms stay in English.
- **Decision-making:** State a recommendation clearly. Don't present 5 options and ask which to pick unless the choice is genuinely consequential.
- **Pace:** Move fast. Don't re-explain what's already been established. Build on context.

---

## Command & Tooling Preferences

### PowerShell — Critical Rules
- **NEVER use `&&` or `||`** for sequential commands in PowerShell. These are bash operators and will fail.
- Use **semicolons (`;`)** to chain commands: `command1 ; command2`
- Or use **separate tool calls** for each command.
- When creating a directory before copying into it: always `New-Item` first, then `Copy-Item`.

### NPM Publishing
- Use **Classic Automation Token** or **Granular Token with Bypass 2FA** for publishing.
- Token is set as `$env:NPM_TOKEN` in the session — never stored in `.env` files in the repo.
- Publish command: `npm publish --access public --//registry.npmjs.org/:_authToken=$env:NPM_TOKEN`
- Bump version with `npm version patch/minor/major` before publishing updates.

### Git
- Default branch: `main` (not `master` — rename with `git branch -M main` on init).
- Commit message format: `type: short description` (feat, fix, chore, docs, refactor).
- Always `git add -A` and review status before committing.

---

## Project-Specific Patterns

### The-Unity-Architect Repo
- Package name on NPM: `the-unity-architect`
- GitHub: `https://github.com/UnLince/The-Unity-Architect`
- Local path: `c:\Users\Pedro Luchsinger\.gemini\antigravity\scratch\The-Unity-Architect`
- Skills and scripts live in `templates/` (for distribution) and in the source workspaces under `UNITY MASTER DEV\`.

---

## Mistakes to Avoid

| # | Mistake | Correct Behavior |
|---|---------|-----------------|
| 1 | Using `&&` in PowerShell commands | Use `;` or separate tool calls |
| 2 | Creating a target directory inline with `Copy-Item *` (fails with syntax error) | `New-Item` the dir first, then `Copy-Item` |
| 3 | Using Granular NPM token without bypass 2FA enabled | Enable bypass 2FA flag, or use Classic Automation token |
| 4 | Trying to `npm login` non-interactively | `npm login` opens a browser link — wait for user to confirm auth |
| 5 | Creating GitHub repo via browser automation when user already created it | Ask first if the repo already exists |

---

## Things I Like

- Clean, minimal file structures — no clutter, no redundant files.
- README files that feel human, not corporate.
- Tools that work with a single command.
- AI that moves, doesn't just talks.

---

*Last updated: 2026-04-15*
