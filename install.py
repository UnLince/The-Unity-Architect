#!/usr/bin/env python3
"""
The Unity Architect - Python Alternative Installer
For developers who don't have Node.js installed.

Usage:
  python install.py
  python install.py --dry-run
  python install.py --force
"""

import os
import sys
import shutil
import urllib.request
import json
import argparse
import tempfile
import zipfile

REPO_URL = "https://github.com/UnLince/The-Unity-Architect"
ZIP_URL  = "https://github.com/UnLince/The-Unity-Architect/archive/refs/heads/main.zip"

DRY_RUN = "--dry-run" in sys.argv
FORCE   = "--force"   in sys.argv

# ── Terminal colors ────────────────────────────────────────────────────────────
class C:
    RESET   = "\033[0m"
    BOLD    = "\033[1m"
    PURPLE  = "\033[35m"
    GREEN   = "\033[32m"
    YELLOW  = "\033[33m"
    RED     = "\033[31m"
    CYAN    = "\033[36m"

def log_info(msg):    print(f"  {C.CYAN}ℹ{C.RESET}  {msg}")
def log_ok(msg):      print(f"  {C.GREEN}✔{C.RESET}  {msg}")
def log_warn(msg):    print(f"  {C.YELLOW}⚠{C.RESET}  {msg}")
def log_error(msg):   print(f"  {C.RED}✖{C.RESET}  {msg}")
def log_step(msg):    print(f"\n{C.BOLD}{C.PURPLE}▶ {msg}{C.RESET}")

# ── Core ───────────────────────────────────────────────────────────────────────
def copy_folder(src, dst):
    if not DRY_RUN:
        os.makedirs(dst, exist_ok=True)
    for item in os.listdir(src):
        s = os.path.join(src, item)
        d = os.path.join(dst, item)
        if os.path.isdir(s):
            copy_folder(s, d)
        else:
            if not DRY_RUN:
                shutil.copy2(s, d)
            log_info(f"Copied: {os.path.relpath(d, os.getcwd())}")

def inject_config(project_root, injection_text):
    targets = []
    if os.path.exists(os.path.join(project_root, ".cursorrules")):
        targets.append((".cursorrules", "append"))
    if os.path.exists(os.path.join(project_root, ".cursor")):
        targets.append((".cursorrules", "append"))
    if os.path.exists(os.path.join(project_root, ".gemini")):
        targets.append((os.path.join(".gemini", "agents.md"), "append"))
    if os.path.exists(os.path.join(project_root, "CLAUDE.md")):
        targets.append(("CLAUDE.md", "append"))
    if os.path.exists(os.path.join(project_root, ".windsurfrules")):
        targets.append((".windsurfrules", "append"))

    if not targets or FORCE:
        targets = [(".cursorrules", "create")]

    for (rel_path, mode) in targets:
        full_path = os.path.join(project_root, rel_path)
        if DRY_RUN:
            log_info(f"[dry-run] Would write to {rel_path}")
            continue
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        if mode == "append" and os.path.exists(full_path):
            with open(full_path, "a", encoding="utf-8") as f:
                f.write("\n\n" + injection_text)
            log_ok(f"Injected rules into {rel_path}")
        else:
            with open(full_path, "w", encoding="utf-8") as f:
                f.write(injection_text)
            log_ok(f"Created {rel_path}")

def main():
    try:
        project_root = os.getcwd()

        print(f"\n{C.BOLD}{C.PURPLE}  The Unity Architect — Python Installer v1.2.1{C.RESET}\n")

        if DRY_RUN:
            log_warn("DRY-RUN mode — no files will be modified.\n")

        # Safety check
        has_unity = os.path.exists(os.path.join(project_root, "Assets")) \
                 or os.path.exists(os.path.join(project_root, "ProjectSettings"))
        if not has_unity and not FORCE:
            log_error("This does not look like a Unity project (no Assets/ or ProjectSettings/).")
            log_warn("Use --force to skip this check.")
            sys.exit(1)

        # Download the repo zip
        log_step("Downloading The Unity Architect...")
        with tempfile.TemporaryDirectory() as tmpdir:
            zip_path = os.path.join(tmpdir, "repo.zip")
            log_info(f"Fetching {ZIP_URL}")
            urllib.request.urlretrieve(ZIP_URL, zip_path)
            log_ok("Download complete.")

            with zipfile.ZipFile(zip_path, 'r') as z:
                z.extractall(tmpdir)

            # The extracted folder is named 'The-Unity-Architect-main'
            repo_dir   = os.path.join(tmpdir, "The-Unity-Architect-main")
            templates  = os.path.join(repo_dir, "templates")
            ai_config  = os.path.join(templates, "ai-config", "injection.md")

            # Step 1: Skills
            log_step("Step 1/3 — Installing AI Skills")
            copy_folder(os.path.join(templates, "skills"), os.path.join(project_root, "skills"))
            log_ok("Skills installed → skills/")

            # Step 1.5: Architect Kit
            unity_src = os.path.join(templates, "Unity", "Editor")
            if os.path.exists(os.path.join(templates, "Unity")):
                unity_dst = os.path.join(project_root, "Assets", "Editor") if has_unity else os.path.join(project_root, "Unity", "Editor")
                copy_folder(unity_src, unity_dst)
                log_ok(f"Architect Kit tools installed → {os.path.relpath(unity_dst, os.getcwd())}/")

            # Step 2: Execution scripts
            log_step("Step 2/3 — Installing Execution Scripts")
            copy_folder(os.path.join(templates, "execution"), os.path.join(project_root, "execution"))
            log_ok("Scripts installed → execution/")

            # Step 3: AI config injection
            log_step("Step 3/3 — Configuring AI Agent")
            with open(ai_config, "r", encoding="utf-8") as f:
                injection_text = f.read()
            inject_config(project_root, injection_text)

        print(f"\n{C.BOLD}{C.GREEN}  ✔ The Unity Architect is ready. Your AI is now a Unity expert.{C.RESET}\n")
        print(f"  {C.BOLD}Next steps:{C.RESET}")
        print("  1. Open your project in Cursor / Antigravity / Claude")
        print("  2. The AI will automatically read skills/ for guidance")
        print("  3. Run: node execution/unity-doctor.js  (or python execution/parse_editor_log.py)")
        print()
    except Exception as e:
        print()
        log_error("Installation failed due to a system error:")
        print(f"  {str(e)}")
        log_info("Please check your permissions or network connection.")
        sys.exit(1)

if __name__ == "__main__":
    main()
