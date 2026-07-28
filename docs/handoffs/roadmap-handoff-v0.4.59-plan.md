# Roadmap Handoff Plan v0.4.59 — Neon Jump-Scare Upgrade

**Created by:** Antigravity — 2026-07-27
**Last updated by:** Cursor Grok 4.5 — 2026-07-28
**Session mode:** Mode A (Planning / refine — docs only, no code)
**Status:** UNBLOCKED — READY TO CODE (PX/fun refine applied)

## Trigger

User request: "update docs and roadmap enhance this perk, change it to extra
time after restart for player to run away. upgrade perk to give you extra
500ms headstart after scare. deducts -50 Shleebs each time. cost 250"

Context: "Neon Jump-Scare Filter" shipped in v0.4.50 as cosmetic-only
(magenta/cyan capture tint, 200 sheebs). Ken wants it upgraded into a
paid escape gag: buy once at 250, then every post-scare restart can buy
you a 500ms headstart for −50 sheebs.

**This refine pass (2026-07-28):** review the thin first draft against live
code + the session goal — *improve player experience, funny, and
engaging* — and lock implementation choices so Mode B ships a *moment*,
not a silent number tweak.

---

## Goal (player experience)

After the jump-scare roast and the fair 3…2…1 resume beat, owning Neon
should feel like **bribing the filter to glitch time** — a short, readable
comedy beat where toilets freeze, you bolt, and −50 sheebs floats off your
HUD. The cosmetic magenta/cyan scare tint stays; the upgrade *adds* the
headstart, it does not replace the look.

If you're too broke to pay, the gag is the refusal — not a silent no-op.

---

## Live code facts (correct the first draft)

| Draft said | Reality |
|---|---|
| item id `neon-scare-filter` | **`jump-scare-filter-neon`** (`gameContent.js`) |
| field `price` | field is **`cost`** (currently `200`) |
| `_startResumeCountdown()` | **`beginResumeCountdown()`** → `_updateResumeCountdown()` |
| Instant chase after scare | Flow is `'caught'` → `'caught-profile'` → `'resume-countdown'` (3s) → `'chase'` |
| Invent new freeze | Reuse existing **`chaser.stunnedUntil`** + `_drawStunEffect()` (gun already uses this) |

Shop entry today (`gameContent.js`):

- `id: 'jump-scare-filter-neon'`
- `cost: 200`, `effectLabel: 'Cosmetic only'`, `cosmetic: true`
- Engine flag: `neonJumpscareFilter` (passed from `App.jsx` when owned)

---

## Settled design (Ken's numbers + PX refine)

### Economy (Ken — locked)

- Shop **cost → 250** (was 200). Already-owned profiles keep the item; no
  refund/recharge.
- Each successful headstart: **−50 sheebs**.
- Debt rule: mirror death-penalty economy —
  - `highestLevel > 3`: may go negative (debt HUD already exists).
  - else: only trigger if `sheebs >= 50`; otherwise skip headstart.

### Headstart timing (locked — this is the fun)

**Do not** lengthen the 3…2…1 countdown (that freezes *everyone* and
doesn't let you "run away").

When `_updateResumeCountdown` would flip to `'chase'`:

1. If owned + can afford (or debt-eligible): deduct 50, call
   `onSheebsChange`, set **every** chaser's `stunnedUntil` to
   `this.levelSeconds + 0.5` (500ms), fire the neon theater beat.
2. Then set `phase = 'chase'` as today.
3. Player moves immediately; chasers stay stunned via existing chase-loop
   stun gate (~`GameEngine.js:1243`).

Result: fair countdown → neon bribe flash → you run while toilets glitch
→ they wake up angry. Readable in under a second.

### Keep the cosmetic (locked)

- Leave magenta/cyan `_drawJumpscare()` tint when owned.
- Remove `cosmetic: true` / "Cosmetic only" — this is now a real perk.
- New shop copy (suggested):
  - **description:** `After a scare, bribe the filter for a 0.5s neon headstart. Costs 50 sheebs each escape.`
  - **effectLabel:** `+0.5s headstart (−50/use)`

### Funny theater beat (locked — in scope for Mode B)

Ship these with the mechanic; they are the difference between "buff" and
"bit":

1. **Neon edge flash (~0.25–0.35s)** on headstart trigger — reuse the
   magenta/cyan pair from `_drawJumpscare` (same colors as the scare, so
   the filter "pays off" after the roast). Pattern precedent:
   `nearMissVignetteTimer` (v0.4.54).
2. **Runner speech-bubble line** from a new `NEON_HEADSTART_LINES` pool in
   `dialog.js` (3–5 lines). Suggested starters:
   - `NEON DODGE — YOU PAID FOR THAT!`
   - `FILTER SAYS RUN! (−50)`
   - `GLITCH ESCAPE UNLOCKED!`
   - `BRIBED THE TOILETS. DON'T LOOK BACK.`
   - `0.5 SECONDS OF PURE COWARDICE.`
3. **Broke refusal line** (when owned but can't afford, L1–3): one-shot
   runner bubble, e.g. `NEON FILTER NEEDS 50 SHEEBS — YOU'RE BROKE LOL`
   — then resume chase with **no** stun. Still funny, still fair.
4. **Stun draw tint (small):** while neon headstart stun is active, prefer
   magenta/cyan over the gun's yellow stun wash so the paid freeze reads
   as the filter, not a gun hit. Optional flag on chaser
   (`neonStun: true`) cleared when stun ends — keep tiny.

### Explicitly not required for funny (out of scope)

- New sprites / shop art.
- New audio (Audio 2 still Ken-blocked).
- Floating world-space `−50` particles (HUD sheebs + speech line is enough;
  float text can be a fast-follow if Ken wants more juice later).
- Changing Turdstone interaction — Neon still may fire after a Turdstone
  save resume (separate systems; stacking is fine and funny).

---

## Fix plan (Mode B — single session)

1. **`frontend/src/gameContent.js`**
   - `jump-scare-filter-neon`: `cost: 250`, new description + effectLabel,
     drop `cosmetic: true`.

2. **`frontend/src/dialog.js`**
   - Add `NEON_HEADSTART_LINES` (+ optional single `NEON_BROKE_LINE`).
   - Mirror the lines into `docs/dialog_content_chasing.md`.

3. **`frontend/src/GameEngine.js`**
   - On resume-countdown → chase transition:
     - if `this.neonJumpscareFilter` and affordability check passes:
       deduct 50 (debt rules above), stun all chasers 0.5s, set neon
       vignette timer, pick a headstart line → `runnerLine` /
       `runnerLineTimer`.
     - else if owned but broke: set broke line, no stun / no deduct.
   - Draw neon vignette while timer > 0 (chase overlay).
   - Optional: neon-colored stun wash when `chaser.neonStun`.

4. **`frontend/src/components/VersionModal.jsx`**
   - Update Neon blurb to mention headstart + −50/use (ship with bump).

5. **E2E** (`frontend/e2e/` — extend `cosmetic-sink.spec.js` or add
   `neon-headstart.spec.js`):
   - Own item, force capture via `window.__skibEngine`, dismiss profile,
   wait out countdown, assert chasers have `stunnedUntil` ahead and
   sheebs dropped by 50.
   - Broke path (sheebs < 50, low highestLevel): no stun, sheebs unchanged.

6. **Ship hygiene:** bump `GAME_ITERATION` → `v0.4.59`, ledger /
   version-log / roadmap checkbox / update-directions, commit, deploy only
   if Ken asks.

---

## Explicitly not in this pass

- Other shop items.
- New graphics beyond canvas tint / vignette / copy.
- Difficulty selector (`v0.4.60-plan`) or desktop FOV follow-ups.
- Changing the 3s resume countdown duration itself.

---

## Ken flags (none blocking)

No outside assets or open product decisions. Numbers and intent already
Ken-settled. PX theater choices above are recommendations locked for Mode B
unless Ken objects before coding.

Optional later (not this slice): world-space `−50` float, tick SFX, shop
rename to "Neon Glitch Escape."

---

## Copy-paste: next coding session (Mode B)

```text
Mode B unblocked: implement Neon Jump-Scare Upgrade (v0.4.59).
1. Read docs/handoffs/roadmap-handoff-v0.4.59-plan.md (2026-07-28 refine).
2. gameContent.js — jump-scare-filter-neon cost 250; new description/effectLabel; remove cosmetic:true.
3. dialog.js — NEON_HEADSTART_LINES (+ broke line); update dialog_content_chasing.md.
4. GameEngine.js — on resume-countdown→chase: if owned+affordable, −50 sheebs (debt rules), stun all chasers 500ms via stunnedUntil, neon vignette + runner line. Broke = line only.
5. Keep existing magenta/cyan jump-scare tint.
6. E2E: headstart stun + sheeb deduct; broke skip.
7. Bump GAME_ITERATION to v0.4.59, ledger/roadmap/version-log, commit.
Verify: cd frontend && npm run build && npx playwright test --workers=1
Deploy only if Ken asks.
```
