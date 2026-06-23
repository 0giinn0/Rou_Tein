export interface WorkoutExercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  icon: string;
}

export interface WorkoutDay {
  id: string;
  label: string;
  description: string;
  exercises: WorkoutExercise[];
  completed: boolean;
  completedAt?: string;
}

export const WEEKLY_WORKOUT: WorkoutDay[] = [
  {
    id: "day-1",
    label: "Day 1 - Push",
    description: "Chest, shoulders, triceps",
    completed: false,
    exercises: [
      { id: "push-1", name: "Push-ups", sets: 3, reps: 15, icon: "💪" },
      { id: "push-2", name: "Diamond Push-ups", sets: 3, reps: 10, icon: "💎" },
      { id: "push-3", name: "Pike Push-ups", sets: 3, reps: 12, icon: "🏔️" },
      { id: "push-4", name: "Tricep Dips", sets: 3, reps: 12, icon: "⬇️" },
      { id: "push-5", name: "Plank Shoulder Taps", sets: 3, reps: 20, icon: "👆" },
    ],
  },
  {
    id: "day-2",
    label: "Day 2 - Pull",
    description: "Back, biceps, forearms",
    completed: false,
    exercises: [
      { id: "pull-1", name: "Pull-ups", sets: 3, reps: 8, icon: "🔄" },
      { id: "pull-2", name: "Chin-ups", sets: 3, reps: 8, icon: "⬆️" },
      { id: "pull-3", name: "Australian Rows", sets: 3, reps: 12, icon: "🚣" },
      { id: "pull-4", name: "Reverse Flys", sets: 3, reps: 12, icon: "🦅" },
      { id: "pull-5", name: "Dead Hangs", sets: 2, reps: 30, icon: "🧗" },
    ],
  },
  {
    id: "day-3",
    label: "Day 3 - Legs",
    description: "Quads, hamstrings, glutes",
    completed: false,
    exercises: [
      { id: "legs-1", name: "Bodyweight Squats", sets: 3, reps: 20, icon: "🪑" },
      { id: "legs-2", name: "Lunges", sets: 3, reps: 12, icon: "🚶" },
      { id: "legs-3", name: "Glute Bridges", sets: 3, reps: 15, icon: "🌉" },
      { id: "legs-4", name: "Calf Raises", sets: 3, reps: 25, icon: "🦵" },
      { id: "legs-5", name: "Bulgarian Split Squats", sets: 3, reps: 10, icon: "🏋️" },
    ],
  },
  {
    id: "day-4",
    label: "Day 4 - Core",
    description: "Abs, obliques, lower back",
    completed: false,
    exercises: [
      { id: "core-1", name: "Crunches", sets: 3, reps: 20, icon: "🫃" },
      { id: "core-2", name: "Leg Raises", sets: 3, reps: 15, icon: "🦵" },
      { id: "core-3", name: "Russian Twists", sets: 3, reps: 20, icon: "🔄" },
      { id: "core-4", name: "Plank", sets: 3, reps: 45, icon: "🪵" },
      { id: "core-5", name: "Supermans", sets: 3, reps: 15, icon: "🦸" },
    ],
  },
  {
    id: "day-5",
    label: "Day 5 - Full Body",
    description: "Compound movements",
    completed: false,
    exercises: [
      { id: "full-1", name: "Burpees", sets: 3, reps: 12, icon: "🏃" },
      { id: "full-2", name: "Mountain Climbers", sets: 3, reps: 30, icon: "⛰️" },
      { id: "full-3", name: "Jump Squats", sets: 3, reps: 15, icon: "⬆️" },
      { id: "full-4", name: "Bear Crawls", sets: 3, reps: 20, icon: "🐻" },
      { id: "full-5", name: "Spiderman Push-ups", sets: 3, reps: 10, icon: "🕷️" },
    ],
  },
  {
    id: "day-6",
    label: "Day 6 - Cardio",
    description: "Endurance and heart health",
    completed: false,
    exercises: [
      { id: "cardio-1", name: "Jumping Jacks", sets: 3, reps: 40, icon: "⭐" },
      { id: "cardio-2", name: "High Knees", sets: 3, reps: 30, icon: "🦵" },
      { id: "cardio-3", name: "Butt Kickers", sets: 3, reps: 30, icon: "🦶" },
      { id: "cardio-4", name: "Skater Hops", sets: 3, reps: 20, icon: "⛸️" },
      { id: "cardio-5", name: "Tuck Jumps", sets: 3, reps: 12, icon: "⬆️" },
    ],
  },
  {
    id: "day-7",
    label: "Day 7 - Rest",
    description: "Active recovery and stretching",
    completed: false,
    exercises: [
      { id: "rest-1", name: "Yoga Flow", sets: 1, reps: 10, icon: "🧘" },
      { id: "rest-2", name: "Stretch Routine", sets: 1, reps: 10, icon: "🤸" },
      { id: "rest-3", name: "Foam Rolling", sets: 1, reps: 5, icon: "🫙" },
    ],
  },
];
