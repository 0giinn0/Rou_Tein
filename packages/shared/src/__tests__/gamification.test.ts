import { BADGES, THEMES, getBadgeById, getThemeById, getLevelReward, STREAK_FREEZE_COST } from "../gamification";

describe("gamification", () => {
  it("has badges with required fields", () => {
    expect(BADGES.length).toBeGreaterThan(0);
    BADGES.forEach((b) => {
      expect(b.id).toBeTruthy();
      expect(b.title).toBeTruthy();
      expect(b.icon).toBeTruthy();
    });
  });

  it("has a default free theme", () => {
    const defaultTheme = getThemeById("default");
    expect(defaultTheme).toBeDefined();
    expect(defaultTheme!.cost).toBe(0);
  });

  it("returns undefined for unknown ids", () => {
    expect(getBadgeById("not-real")).toBeUndefined();
    expect(getThemeById("not-real")).toBeUndefined();
  });

  it("scales level rewards", () => {
    expect(getLevelReward(1).coins).toBeLessThan(getLevelReward(5).coins);
  });

  it("defines streak freeze cost", () => {
    expect(STREAK_FREEZE_COST).toBeGreaterThan(0);
  });
});
