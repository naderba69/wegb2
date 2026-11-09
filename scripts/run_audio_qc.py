#!/usr/bin/env python3
"""Run the full audio QC in a reproducible, isolated Python environment."""

from __future__ import annotations

import json
import os
from pathlib import Path
import re
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
    """Validate the wheel lock and return the exact package versions it governs."""
    pinned: dict[str, str] = {}
    hashes: dict[str, set[str]] = {}
    current_package: str | None = None
    hash_pattern = re.compile(r"--hash=sha256:([0-9a-f]{64})$")

    for raw_line in REQUIREMENTS.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue
        line = line.removesuffix("\\").strip()
        hash_match = hash_pattern.fullmatch(line)
        if hash_match:
            if current_package is None:
                raise ValueError("audio QC hash appears before a pinned requirement")
            hashes[current_package].add(hash_match.group(1))
            continue

        requirement = line.split(maxsplit=1)[0]
        package, separator, version = requirement.partition("==")
        if not separator or not package or not version or package in pinned:
            raise ValueError(f"audio QC requirement must be uniquely pinned with ==: {line!r}")
        pinned[package] = version
        hashes[package] = set()
        current_package = package

    unhashed = [package for package in pinned if not hashes[package]]
    if not pinned or unhashed:
        raise ValueError(f"audio QC requirements must carry sha256 hashes: {unhashed!r}")
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
            [
                str(python), "-m", "pip", "install",
                "--disable-pip-version-check",
                "--require-hashes",
                "--only-binary=:all:",
                "--requirement", str(REQUIREMENTS),
            ],
            cwd=ROOT,
            check=True,
        )
    return subprocess.run([str(python), str(QC_SCRIPT)], cwd=ROOT).returncode


if __name__ == "__main__":
    sys.exit(main())
