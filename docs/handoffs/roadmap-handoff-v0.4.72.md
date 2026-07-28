# Roadmap Handoff v0.4.72 — Badge Award Counts / Repeat-Award History

**Created by:** Assistant — 2026-07-28

## What was done

- **v0.4.72:** Implemented badge award counts and repeat-award history tracking in the profile.
- Modified `cookies.js` to initialize `badgeAwardCounts` object.
- Modified `App.jsx`'s `handleBadgeEarned` function to track the count of badge awards, while keeping the `earnedBadges` array strictly for unique badges. Repeat awards do not trigger sheebs or toast notifications, preserving existing unlock behavior.
- Updated `RewardsHistoryModal.jsx` to parse the new `badgeAwardCounts` from the profile and display a summary count under the History tab.
- Added a Playwright test `frontend/e2e/badge-award-counts.spec.js` that seeds a profile with badge counts and asserts the summary renders correctly.
- Bumped `GAME_ITERATION` to `v0.4.72` in `version.js` and added an entry in `VersionModal.jsx`.

## Verification
- `cd frontend && npm run build` passed.
- `npx playwright test` passed successfully.

## Next Steps
- Continue with next handoff item in backlog.
