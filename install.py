import os
import shutil
import sys
from datetime import datetime

# Configuration
VERSION = "1.2.2"
FRAMEWORK_DIR = "The-Unity-Architect"

class C:
    PURPLE = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    RESET = '\033[0m'
    BOLD = '\033[1m'

def log_step(msg): print(f"\n{C.BOLD}{C.PURPLE}▶ {msg}{C.RESET}")
def log_ok(msg): print(f"  {C.GREEN}✔{C.RESET}  {msg}")
def log_info(msg): print(f"  {C.CYAN}ℹ{C.RESET}  {msg}")
def log_warn(msg): print(f"  {C.YELLOW}⚠{C.RESET}  {msg}")
def log_err(msg): print(f"  {C.RED}✖{C.RESET}  {msg}")

def copy_folder(src, dst):
    if not os.path.exists(dst):
        os.makedirs(dst)
    for item in os.listdir(src):
        s = os.path.join(src, item)
        d = os.path.join(dst, item)
        if os.path.isdir(s):
            copy_folder(s, d)
        else:
            shutil.copy2(s, d)
            log_info(f"Copied: {item}")

def inject_config(project_root, injection_text):
    targets = ["agents.md", ".cursorrules", "CLAUDE.md", ".windsurfrules"]
    for target in targets:
        target_path = os.path.join(project_root, target)
        # Always create agents.md, others only if exist or forced
        if target == "agents.md" or os.path.exists(target_path):
            if os.path.exists(target_path):
                with open(target_path, "r", encoding="utf-8") as f:
                    content = f.read()
                if "The Unity Architect — AI Agent Rules" not in content:
                    with open(target_path, "a", encoding="utf-8") as f:
                        f.write("\n\n" + injection_text)
                    log_ok(f"Injected rules into {target}")
                else:
                    log_info(f"{target} already configured.")
            else:
                with os.open(target_path, os.O_CREAT | os.O_WRONLY, 0o644) as fd:
                    os.write(fd, injection_text.encode('utf-8'))
                log_ok(f"Created and configured {target}")

def main():
    project_root = os.getcwd()
    repo_dir = os.path.dirname(os.path.abspath(__file__))
    templates = os.path.join(repo_dir, "templates")
    framework_root = os.path.join(project_root, FRAMEWORK_DIR)
    
    print(f"\n{C.BOLD}{C.PURPLE}The Unity Architect {C.RESET}v{VERSION}")
    
    # Unity Check
    has_unity = os.path.exists(os.path.join(project_root, "Assets"))
    if not has_unity:
        log_warn("Not a standard Unity project root. Proceeding anyway...")

    # Migration
    legacy = [os.path.join(project_root, d) for d in ["skills", "execution", "Wiki"] if os.path.exists(os.path.join(project_root, d))]
    if legacy:
        log_warn("Legacy folders detected.")
        choice = input("  ? Deseas migrar a la estructura unificada? [Y/n] ").lower()
        if choice != 'n':
            if not os.path.exists(framework_root): os.makedirs(framework_root)
            for d in legacy:
                name = os.path.basename(d)
                target = os.path.join(framework_root, name)
                if os.path.exists(target): shutil.rmtree(target)
                os.rename(d, target)
                log_ok(f"Migrated: {name}")

    if not os.path.exists(framework_root): os.makedirs(framework_root)

    # Step 1: Skills
    log_step("Step 1/4 — AI Skills")
    copy_folder(os.path.join(templates, "skills"), os.path.join(framework_root, "skills"))

    # Step 2: Scripts
    log_step("Step 2/4 — Scripts")
    copy_folder(os.path.join(templates, "execution"), os.path.join(framework_root, "execution"))

    # Step 3: Wiki
    log_step("Step 3/4 — Wiki")
    wiki_path = os.path.join(framework_root, "Wiki")
    for sub in ["ADR", "Systems", "Features", "Lore"]:
        os.makedirs(os.path.join(wiki_path, sub), exist_ok=True)
    
    index_path = os.path.join(wiki_path, "Index.md")
    if not os.path.exists(index_path):
        with open(index_path, "w") as f:
            f.write("# Mega-Brain Wiki Index\n\n## Categories\n- [ADR](./ADR/)\n- [Systems](./Systems/)\n- [Features](./Features/)\n")
    
    log_ok("Wiki structure ready.")

    # Step 4: AI Config
    log_step("Step 4/4 — Configuring AI")
    ai_config_file = os.path.join(templates, "ai-config", "injection.md")
    with open(ai_config_file, "r", encoding="utf-8") as f:
        injection = f.read()
    inject_config(project_root, injection)

    print(f"\n{C.BOLD}{C.GREEN}  ✔ Success! Centralized in {FRAMEWORK_DIR}/{C.RESET}\n")

if __name__ == "__main__":
    main()
