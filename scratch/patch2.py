import re

with open('frontend/src/GameEngine.js', 'r') as f:
    content = f.read()

boom_stick_logic = """
  _tryBoomStickSpawn() {
    const displayedLevel = this.levelIndex + 1;
    let step = 0.06; // casual
    if (this.difficulty === 'noob-noob') step = 0.03;
    if (this.difficulty === 'hardcore') step = 0.09;
    
    let baseChance = Math.min(0.90, 0.06 + (displayedLevel - 1) * step);
    let success = Math.random() < baseChance;
    
    if (!success) {
      const luckyChance = Math.min(0.04, this.luckBonus / 10);
      const effectiveCap = 0.90;
      if (baseChance + luckyChance > effectiveCap) {
         // Trimming
      }
      if (Math.random() < luckyChance && baseChance + luckyChance <= effectiveCap) {
        success = true;
      }
    }
    
    if (success) {
      // spawn boom stick pickup
      const existing = this.pickups.find(p => p.type === 'boom_stick_shell');
      if (existing) {
        existing.lifetime = 12; // refresh
      } else {
        const x = Math.random() * (WORLD.width - 24);
        const y = Math.random() * (WORLD.height - 24);
        this.pickups.push({ type: 'boom_stick_shell', x, y, w: 24, h: 24, lifetime: 12 });
      }
    }
  }
"""

content = content.replace("  _spawnPickups(dt) {", boom_stick_logic + "\n  _spawnPickups(dt) {")

content = content.replace("  _startLevelAdvance() {", "  _startLevelAdvance() {\n    this._tryBoomStickSpawn();")

with open('frontend/src/GameEngine.js', 'w') as f:
    f.write(content)
