#!/usr/bin/env python3
"""Extract a bounded prompt from a skib handoff for code-monkey dispatch."""

from __future__ import annotations

import re
import sys
from pathlib import Path

PREFIX = (
    "You are the skib code-monkey lane. Read AGENTS.md first. Stay on main. "
    "Do not expand scope beyond the handoff. Keep the change bounded, verify it, "
    "and stop when the handoff says the work is done.\n\n"
)


def _first_fenced_block_under_heading(text: str, heading: str) -> str | None:
    heading_re = re.compile(rf"^##\s+{re.escape(heading)}\s*$", re.IGNORECASE | re.MULTILINE)
    match = heading_re.search(text)
    if not match:
        return None

    section = text[match.end() :]
    next_heading = re.search(r"^##\s+", section, re.MULTILINE)
    if next_heading:
        section = section[: next_heading.start()]

    fence = re.search(r"```[^\n`]*\n(.*?)```", section, re.DOTALL)
    if not fence:
        return None
    return fence.group(1).strip()


def extract_prompt(handoff_path: Path, repo_root: Path) -> str:
    text = handoff_path.read_text(encoding="utf-8")

    for heading in (
        "Code Monkey Dispatch",
        "Copy-paste: next natural steps for the next agent",
        "Copy-paste: next natural steps",
        "Paste block",
    ):
        body = _first_fenced_block_under_heading(text, heading)
        if body is not None:
            return PREFIX + body

    rel = handoff_path.relative_to(repo_root) if handoff_path.is_relative_to(repo_root) else handoff_path
    return PREFIX + f"Execute the bounded scope in `{rel}`.\n\n" + text


def main() -> int:
    if len(sys.argv) != 3:
        print(f"usage: {sys.argv[0]} <handoff_path> <repo_root>", file=sys.stderr)
        return 2

    handoff_path = Path(sys.argv[1])
    repo_root = Path(sys.argv[2])
    if not handoff_path.is_file():
        print(f"[code-monkey] handoff not found: {handoff_path}", file=sys.stderr)
        return 1

    print(extract_prompt(handoff_path, repo_root))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
