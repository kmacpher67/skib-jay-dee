# Handoff — Level 4 Input Dead-Zone (Raman Aisle "Hang") — Continue Resolution

**Created by:** Cursor Composer — 2026-07-28
**Session mode:** Mode B follow-up / verification
**Status:** Fix shipped as **v0.4.64.1**; Ken verification pending

## Copy-paste: next agent session

```text
Continue resolution of the Ramen Aisle / Level 4 "hang" bug.

CONTEXT (resolved RCA):
- Ken reported getting stuck on Level 4 (The Ramen Aisle) — looked like a
  wall pinch / crash. v0.4.51 and v0.4.52.1 map pinches were already fixed
  and verified still in tree; audit-map-widths.py passes.
- Ken's debug dump (2026-07-28) proved the real bug: after the Level 4
  stakes warning overlay ("I ACCEPT MY FATE"), runner stayed at exact spawn
  (225, 1360) for 228s with phase='chase' and rafActive=true but runner.y
  never changed when holding move keys. NOT a map pinch, NOT broth slip.
- Root cause: GameEngine.stop() (called when Level 4 warning shows) runs
  _unbindInput(), but start() (on warning accept) only resumed RAF — input
  listeners never re-bound.

FIX (already in repo):
- Commit d902e18 — v0.4.64.1: start() calls _bindInput() with _inputBound
  guard; e2e level-4-warning.spec.js asserts movement after accept;
  buildDebugDump() includes inputBound.
- v0.4.64 also shipped Triple-Q debug dump (buildDebugDump + clipboard).

DEPLOY STATUS:
- Website repo commit 1ce91f8 already has v0.4.64.1 on origin/master.
- Ken re-ran deploy-static.sh v0.4.64.1 → "No deploy changes" (expected).
- Ken's pre-fix prod dumps showed version:'unknown' and y stuck at 1360 —
  likely cached v0.4.60 JS. Hard refresh required.

YOUR TASKS (in order):
1. Confirm Ken can play Level 4 after hard refresh (Ctrl+Shift+R):
   - Menu/HUD shows v0.4.64.1
   - After "I ACCEPT MY FATE", runner.y changes when holding W/arrow keys
   - Triple-Q dump shows version v0.4.64.1 and inputBound: true
2. If STILL broken after hard refresh on v0.4.64.1: fresh RCA — collect
   Triple-Q dump while stuck; check inputBound, phase, runner tile.
3. If verified fixed: close out docs (roadmap checkbox if any, version-log
   already has entry), mark Raman recurrence resolved in
   roadmap-handoff-hotfix-raman-rows-plan.md, push game repo if Ken wants.
4. Do NOT re-implement map pinch fixes or reinstall Sentry/PostHog.

KEY FILES:
- frontend/src/GameEngine.js — start()/stop()/_bindInput(), buildDebugDump()
- frontend/src/App.jsx — handleLevelChange (L4 warning stop), handleAcceptLevel4Warning (start)
- frontend/e2e/level-4-warning.spec.js — regression test
- docs/handoffs/roadmap-handoff-hotfix-raman-rows-plan.md — full RCA trail
- docs/handoffs/roadmap-handoff-v0.4.64-plan.md — debug dump + SDK (SDK blocked)

KEN VERIFICATION COMMANDS (browser console, active run):
  window.__skibEngine?.runner.y        // hold W, run again — must change
  copy(JSON.stringify(window.__skibEngine.buildDebugDump(),null,2))  // v0.4.64+

Read first: docs/update-directions.md, docs/skib-sdlc.md
Do not bump GAME_ITERATION unless a new fix is needed.
```

## Ken debug dump (pre-fix evidence)

```json
{
  "phase": "chase",
  "rafActive": true,
  "levelIndex": 3,
  "levelName": "The Ramen Aisle",
  "levelSeconds": 228,
  "runner": { "x": 225, "y": 1360, "tile": [22, 136] },
  "brothFrictionTimer": 0,
  "version": "unknown"
}
```

Runner at exact spawn; y=1360 unchanged under movement keys → input dead.
