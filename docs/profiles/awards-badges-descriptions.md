# BADGES - we don't need no stinking badges! 

Here are the copy-and-paste instructions to add to your backlog/issue tracker for the initial badge art assets.

You can stub these in as placeholder tasks so the developer knows what to expect, and then attach the final images once you get them made.

---

### 🎨 New Asset Task: Initial Badge Icons

**Title:** Create 4x Badge Art Assets for Rewards System
**Priority:** Medium (Blocking full feature implementation)
**General Specs:**

* **Style:** Simple, distinct, vector or pixel art (matching game aesthetic). Must be legible even at small sizes (e.g., 32x32px).
* **Background:** Transparent (PNG format).
* **Required Sizes:** Provide each icon in two sizes:
1. Large (for Profile/Main Menu): 256x256 pixels
2. Small (for In-game Toasts/Lists): 64x64 pixels



#### **Specific Asset Descriptions:**

**Asset 1: "Financial Wizardry (or Fraud)" Badge**

* **Trigger:** Going from negative balance to positive.
* **Concept:** Wealth and transformation.
* **Description:** A burlap money bag overflowing with gold coins. The bag has a green dollar sign ($) stamped on it. Optionally, add a tiny, comical wizard’s hat resting on top of the bag.

**Asset 2: "Glutton for Punishment" Badge**

* **Trigger:** 50 lifetime deaths.
* **Concept:** Comical persistent death.
* **Description:** A cartoon style tombstone. The face of the tombstone is grey, but on it are two small, white cartoon "X"s (representing dead eyes), with a tiny, hanging silver military-style medal below them.

**Asset 3: "Slippery When Wet" Badge**

* **Trigger:** Surviving a trap using the Schleimy Potion.
* **Concept:** Slimy navigation.
* **Description:** A classic triangular yellow "Slippery When Wet" warning sign shape. Inside the triangle, instead of a car or pedestrian, there is a glistening, bright green puddle of slime.

**Asset 4: "Devs Owe Me Five Bucks" Badge**

* **Trigger:** Surviving Level 4+.
* **Concept:** Beating the odds.
* **Description:** A stylized number "4" in a bold, metallic font. Tucked behind the '4' is a slightly crumpled green five-dollar bill.

**Asset 5: "Lucky" Badge**

* **Trigger:** The "Lucky Charm" Shleeb Shop item's luck bonus actually procs — i.e. it causes an extra positive map pickup (Jayden Gun, Schleimy Potion, or future good item) to spawn that wouldn't have otherwise. Not awarded just for buying the item. Confirmed by Ken and implemented in v0.4.31 — see `docs/handoffs/roadmap-handoff-v0.4.31.md`.
* **Concept:** A lucky break paying off.
* **Description:** A four-leaf clover with a small sparkle/shine burst behind it, in the same simple/legible style as the other badges.

**Asset 6: "Porcelain Prowler" Badge**

* **Trigger:** Finding the mandatory badge pickup hidden in Level 1 (Porcelain Palace) — required to advance past the level. Implemented in v0.4.32 — see `docs/handoffs/roadmap-handoff-v0.4.32.md`.
* **Concept:** Casing the joint before you leave it.
* **Description:** A simple porcelain toilet icon with a small magnifying glass or detective's hat resting on the rim.

**Asset 7: "Pipe Dreamer" Badge**

* **Trigger:** Finding the mandatory badge pickup hidden in Level 2 (Pipeworks) — required to advance past the level. Implemented in v0.4.32.
* **Concept:** Digging through the pipes for the good stuff.
* **Description:** A wrench crossed over a length of pipe, with a small shine/sparkle to mark the "found it" moment.

**Asset 8: "Annex Relic Hunter" Badge**

* **Trigger:** Finding the mandatory badge pickup hidden in Level 3 (Flooded Annex) — required to advance past the level. Implemented in v0.4.32.
* **Concept:** An archaeologist wading through the worst puddles in the building.
* **Description:** A small ceramic urn/relic shape, dripping with a few water droplets.

**Asset 9: "Mysterious Plunger" Badge**

* **Trigger:** Optional, low-odds (18% per level) random pickup — never required to progress. Implemented in v0.4.32.
* **Concept:** Something in the building that shouldn't be alive, but is.
* **Description:** A plunger with a faint, eerie glow/aura around the rubber cup.

**Asset 10: "Golden TP" Badge**

* **Trigger:** Same optional random-pickup pool as Asset 9. Implemented in v0.4.32.
* **Concept:** Absurd, useless luxury.
* **Description:** A roll of toilet paper rendered in a shiny gold/metallic finish.

**Asset 11: "Haunted Rubber Ducky" Badge**

* **Trigger:** Same optional random-pickup pool as Asset 9. Implemented in v0.4.32.
* **Concept:** It's watching you.
* **Description:** A classic yellow rubber duck with unsettling, slightly-too-detailed eyes.

---

*Note to Dev: Please use simple grey box placeholders for these eleven items (`earnedBadges[0]` through `earnedBadges[10]`) until the final art assets are attached to this ticket.*