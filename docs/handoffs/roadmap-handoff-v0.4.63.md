# Roadmap Handoff Implementation v0.4.63 — Main Menu UI Clean Up

## Deliverables

1. **Top Profile Row:**
   - Consolidated the top five status items into a single row on all supported phone widths by modifying the `.status-row` grid layout.
   - Prevented overlap and clipping by adjusting column gaps, paddings, and font sizes using responsive `clamp()` functions.

2. **Vertical Clean up:**
   - Tightened vertical spacing on the Main Menu by reducing `.menu` gaps and paddings to ensure footer content is more accessible on smaller screens like mobile phones.
   - Preserved scrolling functionality for shorter viewport safety.
   - Retained the 88x88 size for both portrait previews and the 14px gap.

3. **Menu Mute Button Relocation:**
   - Repositioned the menu mute control from the top-left corner into the `.face-row` container.
   - Centered the `.face-row` element and anchored the mute control to the left side using absolute positioning.
   - The mute control size remains compact (38x38px) and vertically aligned with the center of the portraits.
   - The in-game mute button remains unaffected in its top-left position.

4. **E2E Testing:**
   - Extended `smoke.spec.js` with comprehensive assertions to verify the structural integrity of `.status-row` and `.face-row`, portrait sizing/gap, menu mute button placement, and in-game mute toggle functionality.

## Verification
- Passed `npm run build`.
- Playwright E2E tests (`smoke.spec.js` and `cosmetic-sink.spec.js`) executed and passed successfully.
- Version bumped to `v0.4.63` and prepared for production deployment.
