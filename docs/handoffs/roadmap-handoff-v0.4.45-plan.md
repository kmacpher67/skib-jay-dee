# Roadmap Handoff Plan v0.4.45 — Player's Guide: modal → GitHub link

**Created by:** Claude Sonnet 5 — 2026-07-27
**Last updated by:** Claude Sonnet 5 — 2026-07-27
**Session mode:** Mode A (Planning — docs only, no code changes)

## Source

Ken, this session, reviewing the shipped v0.4.43 Player's Guide modal:

> "do we need a modal window or just a link to the file in github? can we
> just [use] a viewable .md friendly link on the main page? have some sort
> of note in [it] that we can update or add enhancements to the
> player-guide via issues? — modal page is waste of work effort and then
> me the user loses edit and easy update ability."

This reverses the `Flag for Ken` open question left in
[roadmap-handoff-v0.4.44-plan.md](roadmap-handoff-v0.4.44-plan.md)
("Modal vs. External Link... let me know if you would prefer it just
links out to a GitHub raw markdown file instead"). That question shipped
as a modal in v0.4.43 without Ken having answered it — see
`docs/skib-sdlc.md`'s "no code-cowboy" rule; this plan is the correction.

## Why the link wins (not just deferring to Ken — this holds up on review)

Checked the shipped implementation
(`frontend/src/components/PlayersGuideModal.jsx`): the guide text is
hand-duplicated into a `GUIDE_SECTIONS` array in the JSX, entirely
separate from `docs/players-guide.md`. That means:

- **Two sources of truth today.** Editing the doc does not update the
  in-game modal, and vice versa — they will drift.
- **Every wording fix requires a full Mode B session**: edit both files,
  `npm run build`, verify, bump `GAME_ITERATION`, run
  `./scripts/deploy-static.sh`. A typo fix costs a deploy.
- A plain link to the GitHub blob view of `docs/players-guide.md` renders
  GitHub-flavored markdown natively, costs nothing to update (edit the
  file on GitHub or in a normal Mode A-adjacent doc edit, no build/deploy
  needed), and can't drift from itself.
- The modal's real advantages (stays in-app, matches dark theme, doesn't
  depend on GitHub as a host) aren't worth paying a duplicated-content
  tax for on a project that's already hosted openly on GitHub Pages —
  there's no "don't expose the repo" concern to protect against here.

**Decision: drop the modal, use a plain external link.**

## Proposed Changes (for the Mode B session that picks this up)

### 1. Frontend (`frontend/src/App.jsx`)
- Remove the `PlayersGuideModal` import, the `playersGuideOpen` state, and
  its render block (`App.jsx:10`, `:56`, `:546`).
- Change the footer "Player's Guide" button (`App.jsx:762`) from an
  `onClick` state toggle to a plain external link, same pattern as the
  existing issues link at `App.jsx:766`:
  `<a href="https://github.com/kmacpher67/skib-jay-dee/blob/main/docs/players-guide.md" target="_blank" rel="noopener noreferrer">Player's Guide</a>`
  — keep it directly above the issues link, per the original v0.4.44
  placement request.
- Delete `frontend/src/components/PlayersGuideModal.jsx` and its
  `players-guide-modal` / `players-guide-panel` / `players-guide-list` /
  `players-guide-section` styles in `frontend/src/App.css` (added in
  v0.4.43) once nothing references them.

### 2. Content (`docs/players-guide.md`)
- Add a short note near the top: *"See something wrong or missing? Open
  an issue at [github.com/kmacpher67/skib-jay-dee/issues](https://github.com/kmacpher67/skib-jay-dee/issues)
  and we'll fold it into this guide."* This directly answers Ken's ask
  for a visible "update via issues" note, and lives in the doc itself so
  it's visible whether someone reads it on GitHub or locally.
- No other content changes needed — the mechanics text written for
  v0.4.43 stays as-is; only the delivery mechanism changes.

## Flag for Ken
None — this is Ken's own correction from this session, not a new open
question.

## Explicitly not in scope this pass
- No changes to the guide's mechanics content (guns/ammo, wall-hacks,
  Shart Knocker text all stay as written in v0.4.43).
- No change to the "report issues" link already in the footer — the new
  note in the guide doc points at the same issues URL, it doesn't add a
  second link.

---

## Copy-paste: next coding session (Mode B)

```text
Read docs/skib-sdlc.md and docs/handoffs/roadmap-handoff-v0.4.45-plan.md.

This is a frontend UI simplification: replace the Player's Guide modal
with a plain external link, and remove the now-duplicated content.

1. In frontend/src/App.jsx: remove the PlayersGuideModal import, the
   playersGuideOpen state, and its render block. Change the footer
   "Player's Guide" control to a plain <a> tag pointing at
   https://github.com/kmacpher67/skib-jay-dee/blob/main/docs/players-guide.md
   (target="_blank" rel="noopener noreferrer"), same pattern as the
   existing issues link, positioned directly above it.
2. Delete frontend/src/components/PlayersGuideModal.jsx and its
   players-guide-* styles in frontend/src/App.css.
3. Add a short "suggest an edit via GitHub issues" note near the top of
   docs/players-guide.md linking to
   https://github.com/kmacpher67/skib-jay-dee/issues.
4. Verify with `npm run build` and click the footer link in the browser
   to confirm it opens the rendered markdown on GitHub in a new tab.
5. Update docs/roadmap.md, docs/version-log.md, docs/handoffs/ledger.md,
   and create docs/handoffs/roadmap-handoff-v0.4.45.md.
6. Commit the changes and bump GAME_ITERATION to v0.4.45.
```
