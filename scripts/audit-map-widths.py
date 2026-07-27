#!/usr/bin/env python3
"""Dev-only: flag interior floor runs narrower than the runner hitbox (40px / 4 tiles).

Usage (from repo root):
  python3 scripts/audit-map-widths.py

Exit code 0 when only known-benign flags remain (quest-room wall seams).
Exit code 1 if any unexpected sub-40px pinch is found.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MAP_GRIDS = ROOT / "frontend" / "src" / "mapGrids.js"

# Quest-room outer-wall seam in Ramen Aisle — not a walkable corridor.
ALLOWLIST = {
    ("RAMEN_AISLE_GRID", 20, 73, 74),
    ("RAMEN_AISLE_GRID", 21, 73, 74),
    ("RAMEN_AISLE_GRID", 22, 73, 74),
    ("RAMEN_AISLE_GRID", 23, 73, 74),
    ("RAMEN_AISLE_GRID", 24, 73, 74),
    ("RAMEN_AISLE_GRID", 25, 73, 74),
    ("RAMEN_AISLE_GRID", 26, 73, 74),
    ("RAMEN_AISLE_GRID", 27, 73, 74),
    ("RAMEN_AISLE_GRID", 28, 73, 74),
    ("RAMEN_AISLE_GRID", 29, 73, 74),
    ("RAMEN_AISLE_GRID", 30, 73, 74),
    ("RAMEN_AISLE_GRID", 31, 73, 74),
    ("RAMEN_AISLE_GRID", 32, 73, 74),
    ("RAMEN_AISLE_GRID", 38, 73, 74),
    ("RAMEN_AISLE_GRID", 39, 73, 74),
}


def main() -> int:
    data = MAP_GRIDS.read_text()
    grids = re.findall(r"export const (\w+_GRID) = \[(.*?)\n\];", data, re.S)
    unexpected = []
    allowed = []
    for name, body in grids:
        rows = re.findall(r'"([.#]+)"', body)
        for r, row in enumerate(rows):
            for m in re.finditer(r"\.+", row):
                start, end = m.start(), m.end()
                if start > 0 and end < len(row) and row[start - 1] == "#" and row[end] == "#":
                    if (end - start) < 4:
                        hit = (name, r, start, end)
                        width_px = (end - start) * 10
                        line = f"{name} row {r} cols {start}-{end} width_px {width_px}"
                        if hit in ALLOWLIST:
                            allowed.append(line)
                        else:
                            unexpected.append(line)

    if allowed:
        print("Allowed (benign seam) flags:")
        for line in allowed:
            print(" ", line)
    if unexpected:
        print("UNEXPECTED sub-40px pinches:")
        for line in unexpected:
            print(" ", line)
        return 1
    print("OK — no unexpected sub-40px corridor pinches.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
