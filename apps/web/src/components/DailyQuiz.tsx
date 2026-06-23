"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStreakStore } from "@/store/streakStore";
import { getDailyQuiz } from "@ticktick/shared";
import { Brain, CheckCircle2, XCircle, Sparkles } from "lucide-react";

export function DailyQuiz() {
  const { quizCompleted, quizScore, completeQuiz } = useStreakStore();
  const questions = useMemo(() => getDailyQuiz(), []);

  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isCorrect = selectedOption === currentQuestion.correctIndex;

  function handleSelect(index: number) {
    if (showExplanation || finished) return;
    setSelectedOption(index);
    setShowExplanation(true);
    if (index === currentQuestion.correctIndex) {
      setScore((s) => s + 1);
    }
  }

  function handleNext() {
    setSelectedOption(null);
    setShowExplanation(false);
    if (currentIndex + 1 >= questions.length) {
      setFinished(true);
      completeQuiz(score + (isCorrect ? 1 : 0), questions.length);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }

  if (quizCompleted && !finished) {
    return (
      <div className="glass rounded-3xl p-s4 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald/10 flex items-center justify-center mx-auto mb-s3">
          <CheckCircle2 className="w-6 h-6 text-emerald" />
        </div>
        <h3 className="text-lg font-bauhaus text-cream mb-s1">Quiz Completed!</h3>
        <p className="text-sm text-muted">
          You scored {quizScore}/{questions.length}. Come back tomorrow for a new challenge.
        </p>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="glass rounded-3xl p-s4">
        <div className="flex items-center gap-s3 mb-s3">
          <div className="w-10 h-10 rounded-2xl bg-violet/10 flex items-center justify-center">
            <Brain className="w-5 h-5 text-violet" />
          </div>
          <div>
            <h3 className="text-base font-bauhaus text-cream">Daily Quiz</h3>
            <p className="text-xs text-muted">5 questions • +40 XP max</p>
          </div>
        </div>
        <p className="text-sm text-muted mb-s4">
          Test your knowledge and earn rewards. A new quiz is available every day.
        </p>
        <button
          onClick={() => setStarted(true)}
          className="w-full py-3 rounded-2xl bg-cream text-ink font-bold text-sm hover:bg-cream-bright transition-colors"
        >
          Start Quiz
        </button>
      </div>
    );
  }

  if (finished) {
    const finalScore = score;
    const perfect = finalScore === questions.length;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-3xl p-s4 text-center"
      >
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-s3 ${perfect ? "bg-emerald/10" : "bg-coral/10"}`}>
          {perfect ? <Sparkles className="w-8 h-8 text-emerald" /> : <Brain className="w-8 h-8 text-coral" />}
        </div>
        <h3 className="text-2xl font-bauhaus text-cream mb-s1">
          {finalScore}/{questions.length}
        </h3>
        <p className="text-sm text-muted mb-s4">
          {perfect
            ? "Perfect score! You're on fire today."
            : "Great effort! Try again tomorrow."}
        </p>
        <div className="flex justify-center gap-s4 text-sm">
          <div className="text-center">
            <p className="text-violet font-bold">+{Math.round(40 * (finalScore / questions.length))}</p>
            <p className="text-xs text-muted">XP</p>
          </div>
          <div className="text-center">
            <p className="text-amber font-bold">+{Math.round(15 * (finalScore / questions.length))}</p>
            <p className="text-xs text-muted">Coins</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="glass rounded-3xl p-s4">
      <div className="flex items-center justify-between mb-s4">
        <div className="flex items-center gap-s2">
          <Brain className="w-4 h-4 text-violet" />
          <span className="text-xs font-bold text-muted uppercase tracking-wider">
            Question {currentIndex + 1}/{questions.length}
          </span>
        </div>
        <div className="h-1.5 w-24 bg-surface-variant rounded-full overflow-hidden">
          <div
            className="h-full bg-violet transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <p className="text-base font-medium text-cream mb-s4 min-h-[48px]">
            {currentQuestion.question}
          </p>

          <div className="space-y-s2 mb-s4">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectOption = currentQuestion.correctIndex === idx;
              const showResult = showExplanation;

              let buttonClass = "w-full text-left p-s3 rounded-2xl border transition-all duration-200 text-sm ";
              if (showResult) {
                if (isCorrectOption) {
                  buttonClass += "bg-emerald/10 border-emerald/40 text-emerald";
                } else if (isSelected) {
                  buttonClass += "bg-coral/10 border-coral/40 text-coral";
                } else {
                  buttonClass += "bg-surface border-border text-muted";
                }
              } else {
                buttonClass += isSelected
                  ? "bg-cream/10 border-cream/30 text-cream"
                  : "bg-surface border-border text-cream hover:border-muted";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={showExplanation}
                  className={buttonClass}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showResult && isCorrectOption && <CheckCircle2 className="w-4 h-4" />}
                    {showResult && isSelected && !isCorrectOption && <XCircle className="w-4 h-4" />}
                  </div>
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-s4"
              >
                <p className="text-xs text-muted leading-relaxed bg-surface p-s3 rounded-2xl">
                  <span className={isCorrect ? "text-emerald" : "text-coral"}>
                    {isCorrect ? "Correct! " : "Not quite. "}
                  </span>
                  {currentQuestion.explanation}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {showExplanation && (
            <button
              onClick={handleNext}
              className="w-full py-3 rounded-2xl bg-cream text-ink font-bold text-sm hover:bg-cream-bright transition-colors"
            >
              {currentIndex + 1 >= questions.length ? "Finish Quiz" : "Next Question"}
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
