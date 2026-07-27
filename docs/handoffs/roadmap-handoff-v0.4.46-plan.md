# Roadmap Handoff v0.4.46-plan — Menu Footer Layout Fix

**Created by:** Antigravity
**Status:** PROPOSED

## Goal
Clean up the layout of the text, links, and color at the bottom of the main menu so it displays correctly on mobile devices without cutting off the links.

## Problems to Fix
1. The `.menu` container uses `overflow: hidden`, causing the content to clip on short screens (like mobile phones) and hiding the footer links.
2. The footer text is a bit large and has a default color, which the user noted is "horrible" and clutters the UI.
3. The spacing between the hint paragraphs and the footer warning is too tight.

## Proposed Changes

### 1. `frontend/src/App.css` Updates
- Change `.menu` from `overflow: hidden;` to `overflow-y: auto; overflow-x: hidden;`. This will allow the menu to scroll vertically on short mobile screens, guaranteeing that the bottom links are always accessible.
- Add `padding-bottom: 40px;` (or larger) to `.menu` to give "a little border space at the bottom" when scrolling down to the footer.
- Add specific styling for `.menu-footer` and `.parody-warning`:
  ```css
  .menu-footer {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .parody-warning {
    font-size: 10px;
    color: #8ec8ff;
    line-height: 1.3;
    opacity: 0.8;
  }
  .menu-footer a {
    color: #60ff72;
    text-decoration: none;
    font-weight: bold;
  }
  ```

### 2. `frontend/src/App.jsx` Updates
- Re-wrap the `.menu-footer` links to be slightly more grouped or just let the CSS handle it. Actually, just adding the CSS should be enough, but we might wrap the links in a separate `<div>` to avoid using `<br />` inside a `<p>` tag.

### 3. Review & Deploy
- Verify the mobile view by checking if the footer is reachable via scrolling.
- Build, deploy to `master`, and bump `GAME_ITERATION` to `v0.4.46`.

## Request for Approval
Please review this plan. If you approve, I will proceed with executing it.
