import re
import datetime

today = datetime.date.today().strftime("%Y-%m-%d")

# 1. Update VersionModal.jsx
with open('frontend/src/components/VersionModal.jsx', 'r') as f:
    vm = f.read()

new_version = f"  {{ version: 'v0.4.47', date: '{today}', notes: 'Added the Rod of Poopdom (Teleport Mechanic)' }},"
vm = vm.replace("export const PAST_VERSION_NOTES = [", "export const PAST_VERSION_NOTES = [\n" + new_version)
with open('frontend/src/components/VersionModal.jsx', 'w') as f:
    f.write(vm)

# 2. Update ledger.md
with open('docs/handoffs/ledger.md', 'a') as f:
    f.write(f"\n## v0.4.47 — {today}\n- Added the Rod of Poopdom (Teleport Mechanic)\n")

# 3. Update version-log.md
with open('docs/version-log.md', 'a') as f:
    f.write(f"\n## v0.4.47 - {today}\n\n**What changed:**\n- Implemented the Rod of Poopdom item\n- Added teleport mechanic mapped to T/F keys\n- Added smoke VFX and cooldown mechanics\n\n**Design Decisions:**\n- Default teleport range capped at 300px\n- Blocks teleport if the target destination hits a wall\n")

# 4. Update roadmap.md
with open('docs/roadmap.md', 'r') as f:
    rm = f.read()
rm = rm.replace("- [ ] **Rod of Poopdom (Teleport)**", "- [x] **Rod of Poopdom (Teleport)**")
with open('docs/roadmap.md', 'w') as f:
    f.write(rm)

