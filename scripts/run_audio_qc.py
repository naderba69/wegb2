#!/usr/bin/env python3
"""Run the full audio QC in a reproducible, isolated Python environment."""

from __future__ import annotations

import json
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


def pinned_requirements() -> dict[str, str]:
    pinned: dict[str, str] = {}
    for raw_line in REQUIREMENTS.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue
        package, separator, version = line.partition("==")
        if not separator or not package or not version:
            raise ValueError(f"audio QC requirement must be pinned with ==: {line!r}")
        pinned[package] = version
    return pinned


def dependencies_ready(python: Path) -> bool:
    if not python.exists():
        return False
    expected = pinned_requirements()
    probe_code = (
        "import importlib.metadata as metadata, json; "
        f"expected = json.loads({json.dumps(json.dumps(expected))}); "
        "actual = {name: metadata.version(name) for name in expected}; "
        "raise SystemExit(0 if actual == expected else 1)"
    )
    probe = subprocess.run(
        [str(python), "-c", probe_code],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    return probe.returncode == 0


def main() -> int:
    python = env_python()
    if not dependencies_ready(python):
        print("audio:qc: preparing isolated tool environment in .cache/audio-qc-venv", flush=True)
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
