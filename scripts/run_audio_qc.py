#!/usr/bin/env python3
"""Run the full audio QC in a reproducible, isolated Python environment."""

from __future__ import annotations

import os
from pathlib import Path
import subprocess
import sys
import venv

ROOT = Path(__file__).resolve().parent.parent
ENV_DIR = ROOT / ".cache" / "audio-qc-venv"
REQUIREMENTS = ROOT / "scripts" / "requirements-audio-qc.txt"
QC_SCRIPT = ROOT / "scripts" / "audio_qc_all.py"


def env_python() -> Path:
    if os.name == "nt":
        return ENV_DIR / "Scripts" / "python.exe"
    return ENV_DIR / "bin" / "python"


def dependencies_ready(python: Path) -> bool:
    if not python.exists():
        return False
    probe = subprocess.run(
        [str(python), "-c", "import miniaudio, numpy"],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    return probe.returncode == 0


def main() -> int:
    python = env_python()
    if not dependencies_ready(python):
        print("audio:qc: preparing isolated tool environment in .cache/audio-qc-venv")
        if not python.exists():
            venv.EnvBuilder(with_pip=True, clear=False).create(ENV_DIR)
        subprocess.run(
            [str(python), "-m", "pip", "install", "--disable-pip-version-check", "--requirement", str(REQUIREMENTS)],
            cwd=ROOT,
            check=True,
        )
    return subprocess.run([str(python), str(QC_SCRIPT)], cwd=ROOT).returncode


if __name__ == "__main__":
    sys.exit(main())
