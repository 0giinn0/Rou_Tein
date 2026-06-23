import { getXpForLevel, getTodayKey, defaultChallenges } from "../streak";

describe("streak helpers", () => {
  it("calculates XP for level with exponential growth", () => {
    expect(getXpForLevel(1)).toBe(100);
    expect(getXpForLevel(2)).toBe(125);
    expect(getXpForLevel(3)).toBe(156);
  });

  it("returns today key in ISO date format", () => {
    const key = getTodayKey();
    expect(key).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(new Date(key).toISOString().startsWith(key)).toBe(true);
  });

  it("has default challenges", () => {
    expect(defaultChallenges.length).toBeGreaterThan(0);
    defaultChallenges.forEach((c) => {
      expect(c.id).toBeDefined();
      expect(c.title).toBeDefined();
      expect(c.xpReward).toBeGreaterThan(0);
    });
  });
});
