# Badges in Skib-Jay-Dee-Toilet

Badges are a core progression and bragging-rights mechanic in Skib-Jay-Dee-Toilet. They encourage players to explore, take risks, and master the game beyond just surviving timers.

## Why Badges are Important
1. **Pacing and Progression:** In early levels, badges act as a gate, ensuring players explore the environment (Progression Badges).
2. **Replayability:** Humor and Intrigue badges spawn randomly, giving players a reason to replay lower levels.
3. **End-game Bragging Rights:** High-tier badges (e.g. from Level 5+ Quest Rooms) are extremely difficult to get and serve as a status symbol in the UI.

## Existing Badges (v0.4.31)
- **Financial Wizardry:** Earned by accumulating a large amount of Sheebs.
- **Glutton for Punishment:** Earned by accumulating a high number of lifetime deaths.
- **Slippery When Wet:** Earned by escaping a close-call encounter, and
  the same trigger now pays out +50 sheebs on the runner's behalf.
- **Devs Owe Me Five Bucks:** A rare gag badge for encountering specific game states or bugs.
- **Lucky:** Earned when the "Lucky Charm" luck-only roll successfully spawns a Jayden Gun pickup.

## Upcoming Badges (v0.4.32+)
### Progression Badges (Levels 1-3)
These badges are mandatory to clear early levels. They force the player to find specific areas of the map rather than just running in a circle.
- **The Golden Plunger (Level 1):** Found in the Porcelain Palace.
- **Wrench of Woe (Level 2):** Found in the Pipeworks.
- **Soggy Map (Level 3):** Found in the Flooded Annex.

### Humor & Intrigue Random Badges
These have a very low spawn rate and provide comedic relief.
- **Mysterious Plunger:** "Why is it vibrating?"
- **Golden TP:** "The chosen wipe."
- **Half-Eaten Ramen:** "Someone left this here."

### Landmark Badges (Level 4+)
Found inside high-risk Quest Rooms (chokepoints with 1 or 2 exits).
- **Ramen Vault Keeper (Level 4):** Retrieved from the dual-exit Ramen Aisle stockroom.
- **World Star Witness (Level 5):** Retrieved from the single-door World Star booth. Requires immense skill or the Gawd Particle to escape alive.
- **Garage Survivor (Level 6):** Retrieved from the single-door garage quest room in "Jayden's Nightmare House." Shipped in `v0.4.38`.

## Future Badge Seeds (not yet queued)

These are the next funny awards that fit the content-pack direction
without needing new backend systems:

- **Bathroom Tourist:** Visit every landmark room in a level.
- **Dead-End Daredevil:** Survive a one-door quest room and keep going.
- **Gremlin in the Pipes:** Clear a level after touching a bad item.
- **Chaser Tax Audit:** Beat a chaser-specific hazard or trap.
- **Flaming Ass:** Trigger the Shart Knocker fart hit on a chaser in a Level 4+ chase. The icon should be the running stick figure with a tiny fire glyph coming out the back, just for maximum rude comedy.

See [docs/interactive-content-pack.md](interactive-content-pack.md) for the broader item catalog that could feed these badge ideas.

## Badge history (planned, not yet built)

`profile.earnedBadges` is currently just an unordered array of badge ids —
no timestamp, no "how/when did I get this" data. A planned `rewardsHistory`
log (design in
[docs/handoffs/roadmap-handoff-v0.4.41-plan.md](handoffs/roadmap-handoff-v0.4.41-plan.md))
would record a timestamped entry every time `handleBadgeEarned` fires,
feeding a new player-facing history panel opened from the menu's `Rewards`
pill (same pattern as the `Deaths` pill → `DeathsModal.jsx`). This is
additive only — it does not change how badges are gated or which array the
game reads to check if a badge is already earned.
If we later want a visible "earned N times" tally for repeat awards or
token-style achievements, that will need a separate count/history field;
`earnedBadges` should stay the unique unlock set. The planned follow-up
for this is `roadmap-handoff-v0.4.67-plan.md`, which introduces a
separate award-count surface.
