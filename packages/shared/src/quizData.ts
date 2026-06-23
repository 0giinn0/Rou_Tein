import type { QuizQuestion } from "./streak";

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "Which vitamin is primarily produced when skin is exposed to sunlight?",
    options: ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin E"],
    correctIndex: 2,
    explanation: "Sunlight triggers Vitamin D synthesis in your skin, essential for bone health and mood.",
    category: "health",
  },
  {
    id: "q2",
    question: "What is the recommended daily water intake for most adults?",
    options: ["1 liter", "2-3 liters", "5 liters", "500 ml"],
    correctIndex: 1,
    explanation: "Most adults need about 2-3 liters of water daily, more with exercise or heat.",
    category: "health",
  },
  {
    id: "q3",
    question: "Which cloud type typically brings steady rain?",
    options: ["Cirrus", "Cumulus", "Nimbostratus", "Stratus"],
    correctIndex: 2,
    explanation: "Nimbostratus clouds are dark, low clouds that bring continuous precipitation.",
    category: "weather",
  },
  {
    id: "q4",
    question: "What does a barometer measure?",
    options: ["Temperature", "Air pressure", "Humidity", "Wind speed"],
    correctIndex: 1,
    explanation: "A barometer measures atmospheric pressure, helping predict weather changes.",
    category: "weather",
  },
  {
    id: "q5",
    question: "Which technique is best for breaking a large task into manageable pieces?",
    options: ["Multitasking", "The Pomodoro Technique", "Procrastination", "Skipping breaks"],
    correctIndex: 1,
    explanation: "The Pomodoro Technique uses focused 25-minute work intervals with short breaks.",
    category: "productivity",
  },
  {
    id: "q6",
    question: "How many hours of sleep do adults generally need per night?",
    options: ["4-5 hours", "7-9 hours", "10-12 hours", "2-3 hours"],
    correctIndex: 1,
    explanation: "Adults typically need 7-9 hours of quality sleep for optimal health and focus.",
    category: "health",
  },
  {
    id: "q7",
    question: "What causes a rainbow to form?",
    options: ["Reflection of moonlight", "Refraction of sunlight through water droplets", "Lightning in clouds", "Pollution in air"],
    correctIndex: 1,
    explanation: "Rainbows form when sunlight refracts, reflects, and disperses through water droplets.",
    category: "weather",
  },
  {
    id: "q8",
    question: "Which macronutrient is most important for muscle repair?",
    options: ["Carbohydrates", "Fats", "Protein", "Fiber"],
    correctIndex: 2,
    explanation: "Protein provides amino acids that repair and build muscle tissue after exercise.",
    category: "health",
  },
  {
    id: "q9",
    question: "What is the hottest planet in our solar system?",
    options: ["Mercury", "Venus", "Mars", "Jupiter"],
    correctIndex: 1,
    explanation: "Venus is hotter than Mercury due to its thick atmosphere trapping heat.",
    category: "nature",
  },
  {
    id: "q10",
    question: "Which habit-forming strategy involves linking a new habit to an existing one?",
    options: ["Habit stacking", "Cold turkey", "Binge working", "Random scheduling"],
    correctIndex: 0,
    explanation: "Habit stacking attaches a new behavior to an existing routine, making it easier to remember.",
    category: "productivity",
  },
  {
    id: "q11",
    question: "What weather phenomenon is measured by the Beaufort scale?",
    options: ["Rainfall", "Wind speed", "Temperature", "Humidity"],
    correctIndex: 1,
    explanation: "The Beaufort scale measures wind speed based on observed conditions at sea or land.",
    category: "weather",
  },
  {
    id: "q12",
    question: "Which organ is primarily responsible for filtering blood?",
    options: ["Heart", "Liver", "Kidneys", "Lungs"],
    correctIndex: 2,
    explanation: "Kidneys filter waste products from blood and regulate fluid balance.",
    category: "health",
  },
];

function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
  }
  return Math.abs(hash);
}

export function getDailyQuiz(seed?: string): QuizQuestion[] {
  const today = seed || new Date().toISOString().split("T")[0];
  const shuffled = [...quizQuestions].sort((a, b) => {
    const hashA = hashString(a.id + today);
    const hashB = hashString(b.id + today);
    return hashA - hashB;
  });
  return shuffled.slice(0, 5);
}
