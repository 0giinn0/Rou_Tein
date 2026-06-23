import { getDailyQuiz, quizQuestions } from "../quizData";

describe("daily quiz", () => {
  it("returns 5 questions by default", () => {
    const quiz = getDailyQuiz("2024-06-23");
    expect(quiz).toHaveLength(5);
  });

  it("is deterministic for the same seed", () => {
    const seed = "deterministic-seed";
    const a = getDailyQuiz(seed);
    const b = getDailyQuiz(seed);
    expect(a).toEqual(b);
  });

  it("can produce different quizzes for different seeds", () => {
    const seeds = Array.from({ length: 20 }, (_, i) => `seed-${i}`);
    const quizzes = seeds.map((s) => getDailyQuiz(s));
    const unique = new Set(quizzes.map((q) => JSON.stringify(q.map((x) => x.id))));
    expect(unique.size).toBeGreaterThan(1);
  });

  it("contains valid questions", () => {
    const quiz = getDailyQuiz();
    quiz.forEach((q) => {
      expect(q.question).toBeTruthy();
      expect(q.options).toHaveLength(4);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(4);
    });
  });

  it("has at least 5 questions available", () => {
    expect(quizQuestions.length).toBeGreaterThanOrEqual(5);
  });
});
