import { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  LayoutAnimation,
  UIManager,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useStreakStore } from "../store/streakStore";
import { getDailyQuiz } from "@ticktick/shared";
import { useThemeColors } from "../theme/useThemeColors";
import { hapticLight, hapticSuccess, hapticError } from "../lib/haptics";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export function DailyQuiz() {
  const colors = useThemeColors();
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

  const handleSelect = (index: number) => {
    if (showExplanation || finished) return;
    hapticLight();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedOption(index);
    setShowExplanation(true);
    if (index === currentQuestion.correctIndex) {
      hapticSuccess();
      setScore((s) => s + 1);
    } else {
      hapticError();
    }
  };

  const handleNext = () => {
    hapticLight();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedOption(null);
    setShowExplanation(false);
    if (currentIndex + 1 >= questions.length) {
      const finalScore = score + (isCorrect ? 1 : 0);
      setFinished(true);
      completeQuiz(finalScore, questions.length);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  if (quizCompleted && !finished) {
    return (
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: 24,
          padding: 20,
          borderWidth: 1,
          borderColor: colors.border,
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: `${colors.emerald}15`,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
          }}
        >
          <Ionicons name="checkmark-circle" size={24} color={colors.emerald} />
        </View>
        <Text style={{ fontSize: 18, fontWeight: "700", color: colors.cream }}>
          Quiz Completed!
        </Text>
        <Text style={{ fontSize: 13, color: colors.muted, marginTop: 4, textAlign: "center" }}>
          You scored {quizScore}/{questions.length}. Come back tomorrow.
        </Text>
      </View>
    );
  }

  if (!started) {
    return (
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: 24,
          padding: 20,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 16,
              backgroundColor: `${colors.violet}15`,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name={"brain-outline" as any} size={22} color={colors.violet} />
          </View>
          <View>
            <Text style={{ fontSize: 16, fontWeight: "700", color: colors.cream }}>Daily Quiz</Text>
            <Text style={{ fontSize: 12, color: colors.muted }}>5 questions • +40 XP max</Text>
          </View>
        </View>
        <Text style={{ fontSize: 13, color: colors.muted, marginBottom: 16 }}>
          Test your knowledge and earn rewards. A new quiz is available every day.
        </Text>
        <TouchableOpacity
          onPress={() => setStarted(true)}
          style={{
            backgroundColor: colors.cream,
            borderRadius: 16,
            paddingVertical: 14,
            alignItems: "center",
          }}
        >
          <Text style={{ color: colors.bg, fontWeight: "700", fontSize: 14 }}>Start Quiz</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (finished) {
    const finalScore = score;
    const perfect = finalScore === questions.length;
    return (
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: 24,
          padding: 24,
          borderWidth: 1,
          borderColor: colors.border,
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: perfect ? `${colors.emerald}15` : `${colors.coral}15`,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
            <Ionicons name={(perfect ? "sparkles" : "brain-outline") as any} size={32} color={perfect ? colors.emerald : colors.coral} />
        </View>
        <Text style={{ fontSize: 32, fontWeight: "800", color: colors.cream }}>
          {finalScore}/{questions.length}
        </Text>
        <Text style={{ fontSize: 13, color: colors.muted, marginBottom: 20, textAlign: "center" }}>
          {perfect ? "Perfect score! You're on fire today." : "Great effort! Try again tomorrow."}
        </Text>
        <View style={{ flexDirection: "row", gap: 24 }}>
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: colors.violet }}>
              +{Math.round(40 * (finalScore / questions.length))}
            </Text>
            <Text style={{ fontSize: 11, color: colors.muted }}>XP</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: colors.amber }}>
              +{Math.round(15 * (finalScore / questions.length))}
            </Text>
            <Text style={{ fontSize: 11, color: colors.muted }}>Coins</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <Text style={{ fontSize: 11, color: colors.muted, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 }}>
          Question {currentIndex + 1}/{questions.length}
        </Text>
        <View style={{ width: 80, height: 6, backgroundColor: colors.surfaceVariant, borderRadius: 3 }}>
          <View
            style={{
              width: `${((currentIndex + 1) / questions.length) * 100}%`,
              height: 6,
              backgroundColor: colors.violet,
              borderRadius: 3,
            }}
          />
        </View>
      </View>

      <Text style={{ fontSize: 16, fontWeight: "600", color: colors.cream, marginBottom: 16, minHeight: 48 }}>
        {currentQuestion.question}
      </Text>

      <View style={{ gap: 8, marginBottom: 16 }}>
        {currentQuestion.options.map((option, idx) => {
          const isSelected = selectedOption === idx;
          const isCorrectOption = currentQuestion.correctIndex === idx;
          let bg = colors.surfaceVariant;
          let border = colors.border;
          let textColor = colors.cream;

          if (showExplanation) {
            if (isCorrectOption) {
              bg = `${colors.emerald}15`;
              border = `${colors.emerald}40`;
              textColor = colors.emerald;
            } else if (isSelected) {
              bg = `${colors.coral}15`;
              border = `${colors.coral}40`;
              textColor = colors.coral;
            } else {
              textColor = colors.muted;
            }
          } else if (isSelected) {
            bg = `${colors.cream}15`;
            border = `${colors.cream}40`;
          }

          return (
            <TouchableOpacity
              key={idx}
              onPress={() => handleSelect(idx)}
              disabled={showExplanation}
              style={{
                padding: 14,
                borderRadius: 16,
                backgroundColor: bg,
                borderWidth: 1,
                borderColor: border,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontSize: 14, color: textColor, flex: 1 }}>{option}</Text>
              {showExplanation && isCorrectOption && (
                <Ionicons name="checkmark-circle" size={18} color={colors.emerald} />
              )}
              {showExplanation && isSelected && !isCorrectOption && (
                <Ionicons name="close-circle" size={18} color={colors.coral} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {showExplanation && (
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 12, color: colors.muted, lineHeight: 18, backgroundColor: colors.surfaceVariant, padding: 12, borderRadius: 16 }}>
            <Text style={{ color: isCorrect ? colors.emerald : colors.coral }}>
              {isCorrect ? "Correct! " : "Not quite. "}
            </Text>
            {currentQuestion.explanation}
          </Text>
        </View>
      )}

      {showExplanation && (
        <TouchableOpacity
          onPress={handleNext}
          style={{
            backgroundColor: colors.cream,
            borderRadius: 16,
            paddingVertical: 14,
            alignItems: "center",
          }}
        >
          <Text style={{ color: colors.bg, fontWeight: "700", fontSize: 14 }}>
            {currentIndex + 1 >= questions.length ? "Finish Quiz" : "Next Question"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
