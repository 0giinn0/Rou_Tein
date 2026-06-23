export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  icon: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  suggestedSets: number;
  suggestedReps: number;
  equipment?: string;
  description: string;
}

export type ExerciseCategory =
  | "push"
  | "pull"
  | "shoulders"
  | "biceps"
  | "triceps"
  | "legs"
  | "hamstrings"
  | "core"
  | "cardio"
  | "stretching";

export const EXERCISE_CATEGORIES: { key: ExerciseCategory; label: string; emoji: string }[] = [
  { key: "push", label: "Push", emoji: "💪" },
  { key: "pull", label: "Pull", emoji: "🔄" },
  { key: "shoulders", label: "Shoulders", emoji: "🏔️" },
  { key: "biceps", label: "Biceps", emoji: "💎" },
  { key: "triceps", label: "Triceps", emoji: "⬇️" },
  { key: "legs", label: "Legs", emoji: "🦵" },
  { key: "hamstrings", label: "Hamstrings", emoji: "🦶" },
  { key: "core", label: "Core", emoji: "🫃" },
  { key: "cardio", label: "Cardio", emoji: "🏃" },
  { key: "stretching", label: "Stretching", emoji: "🧘" },
];

export const EXERCISES: Exercise[] = [
  // ── Push ──
  { id: "standard-pushups", name: "Standard Push-ups", category: "push", icon: "💪", difficulty: "beginner", suggestedSets: 3, suggestedReps: 15, description: "Classic bodyweight push-up targeting chest and triceps" },
  { id: "diamond-pushups", name: "Diamond Push-ups", category: "push", icon: "💎", difficulty: "intermediate", suggestedSets: 3, suggestedReps: 10, description: "Hands together under chest, targets triceps intensely" },
  { id: "wide-pushups", name: "Wide Push-ups", category: "push", icon: "🫲", difficulty: "beginner", suggestedSets: 3, suggestedReps: 12, description: "Wide hand placement emphasizing outer chest" },
  { id: "decline-pushups", name: "Decline Push-ups", category: "push", icon: "📉", difficulty: "intermediate", suggestedSets: 3, suggestedReps: 10, description: "Feet elevated, targets upper chest" },
  { id: "incline-pushups", name: "Incline Push-ups", category: "push", icon: "📈", difficulty: "beginner", suggestedSets: 3, suggestedReps: 15, description: "Hands elevated on surface, easier progression" },
  { id: "pike-pushups", name: "Pike Push-ups", category: "shoulders", icon: "⛰️", difficulty: "intermediate", suggestedSets: 3, suggestedReps: 10, description: "Hips high, body in inverted V, targets shoulders" },
  { id: "archer-pushups", name: "Archer Push-ups", category: "push", icon: "🏹", difficulty: "advanced", suggestedSets: 3, suggestedReps: 8, description: "Shift weight to one arm while other arm stays straight" },
  { id: "clap-pushups", name: "Clap Push-ups", category: "push", icon: "👏", difficulty: "advanced", suggestedSets: 3, suggestedReps: 8, description: "Explosive push-up with hand clap at top" },
  { id: "pseudo-planche-pushups", name: "Pseudo Planche Push-ups", category: "push", icon: "🤸", difficulty: "advanced", suggestedSets: 3, suggestedReps: 6, description: "Hands near waist, lean forward — planche prep" },

  // ── Pull ──
  { id: "pullups", name: "Pull-ups", category: "pull", icon: "🔝", difficulty: "intermediate", suggestedSets: 3, suggestedReps: 8, description: "Overhand grip, pull chin above bar" },
  { id: "chinups", name: "Chin-ups", category: "pull", icon: "⬆️", difficulty: "intermediate", suggestedSets: 3, suggestedReps: 8, description: "Underhand grip, emphasizes biceps" },
  { id: "australian-rows", name: "Australian Rows", category: "pull", icon: "🚣", difficulty: "beginner", suggestedSets: 3, suggestedReps: 12, description: "Bodyweight rows using a bar or table" },
  { id: "negative-pullups", name: "Negative Pull-ups", category: "pull", icon: "⬇️", difficulty: "beginner", suggestedSets: 3, suggestedReps: 5, description: "Jump up, lower slowly — builds pull-up strength" },
  { id: "scapular-pulls", name: "Scapular Pulls", category: "pull", icon: "🪽", difficulty: "beginner", suggestedSets: 3, suggestedReps: 10, description: "Dead hang to active hang, trains scapular engagement" },
  { id: "dead-hang", name: "Dead Hangs", category: "pull", icon: "🧗", difficulty: "beginner", suggestedSets: 2, suggestedReps: 30, description: "Simply hang from bar — grip and shoulder health" },
  { id: "towel-rows", name: "Towel Rows", category: "pull", icon: "🧻", difficulty: "intermediate", suggestedSets: 3, suggestedReps: 10, description: "Rows using a towel looped over a bar or door anchor" },
  { id: "typewriter-pullups", name: "Typewriter Pull-ups", category: "pull", icon: "📝", difficulty: "advanced", suggestedSets: 3, suggestedReps: 6, description: "Shift side-to-side at the top of each rep" },
  { id: "commando-pullups", name: "Commando Pull-ups", category: "pull", icon: "🪖", difficulty: "advanced", suggestedSets: 3, suggestedReps: 6, description: "Alternating grip, pull chin to either side of bar" },

  // ── Shoulders ──
  { id: "shoulder-taps", name: "Plank Shoulder Taps", category: "shoulders", icon: "👆", difficulty: "beginner", suggestedSets: 3, suggestedReps: 20, description: "In plank, tap opposite shoulder alternately" },
  { id: "handstand-holds", name: "Wall Handstand Holds", category: "shoulders", icon: "🔄", difficulty: "intermediate", suggestedSets: 3, suggestedReps: 30, description: "Handstand against wall — shoulder strength builder" },
  { id: "lateral-raises", name: "Lateral Raises", category: "shoulders", icon: "🦅", difficulty: "beginner", suggestedSets: 3, suggestedReps: 12, description: "Raise arms to sides — lateral deltoid isolation", equipment: "light weights or bands" },
  { id: "front-raises", name: "Front Raises", category: "shoulders", icon: "🫲", difficulty: "beginner", suggestedSets: 3, suggestedReps: 12, description: "Raise arms forward — anterior deltoid", equipment: "light weights or bands" },
  { id: "band-pull-aparts", name: "Band Pull-aparts", category: "shoulders", icon: "🔗", difficulty: "beginner", suggestedSets: 3, suggestedReps: 15, description: "Pull resistance band apart at chest height", equipment: "resistance band" },
  { id: "elevated-pike", name: "Elevated Pike Push-ups", category: "shoulders", icon: "🏗️", difficulty: "advanced", suggestedSets: 3, suggestedReps: 8, description: "Feet on elevated surface, hands on floor — harder pike" },

  // ── Biceps ──
  { id: "curls", name: "Bicep Curls", category: "biceps", icon: "💪", difficulty: "beginner", suggestedSets: 3, suggestedReps: 12, description: "Standard bicep curl", equipment: "weights or bands" },
  { id: "hammer-curls", name: "Hammer Curls", category: "biceps", icon: "🔨", difficulty: "beginner", suggestedSets: 3, suggestedReps: 12, description: "Neutral grip curl — targets brachialis", equipment: "weights" },
  { id: "band-curls", name: "Band Curls", category: "biceps", icon: "🔗", difficulty: "beginner", suggestedSets: 3, suggestedReps: 15, description: "Stand on a resistance band and curl both arms", equipment: "resistance band" },
  { id: "concentration-curls", name: "Concentration Curls", category: "biceps", icon: "🧘", difficulty: "intermediate", suggestedSets: 3, suggestedReps: 10, description: "Seated curl with elbow braced against inner thigh", equipment: "weight" },

  // ── Triceps ──
  { id: "tricep-dips", name: "Tricep Dips", category: "triceps", icon: "⬇️", difficulty: "beginner", suggestedSets: 3, suggestedReps: 12, description: "Using chair or parallel bars, lower and push up" },
  { id: "bench-dips", name: "Bench Dips", category: "triceps", icon: "🪑", difficulty: "beginner", suggestedSets: 3, suggestedReps: 12, description: "Hands behind on bench, feet on floor" },
  { id: "skull-crushers", name: "Skull Crushers", category: "triceps", icon: "💀", difficulty: "intermediate", suggestedSets: 3, suggestedReps: 10, description: "Lying tricep extension", equipment: "weights or band" },
  { id: "tricep-kickbacks", name: "Tricep Kickbacks", category: "triceps", icon: "🦶", difficulty: "beginner", suggestedSets: 3, suggestedReps: 12, description: "Bent over, extend arm straight back", equipment: "weights" },
  { id: "close-grip-pushups", name: "Close-grip Push-ups", category: "triceps", icon: "🤏", difficulty: "beginner", suggestedSets: 3, suggestedReps: 12, description: "Hands close together — tricep-focused push-up" },

  // ── Legs ──
  { id: "bodyweight-squats", name: "Bodyweight Squats", category: "legs", icon: "🪑", difficulty: "beginner", suggestedSets: 3, suggestedReps: 20, description: "Classic squat to parallel or below" },
  { id: "lunges", name: "Walking Lunges", category: "legs", icon: "🚶", difficulty: "beginner", suggestedSets: 3, suggestedReps: 12, description: "Step forward, lower back knee toward ground" },
  { id: "bulgarian-squats", name: "Bulgarian Split Squats", category: "legs", icon: "🏋️", difficulty: "intermediate", suggestedSets: 3, suggestedReps: 10, description: "Rear foot elevated, front leg does the work" },
  { id: "jump-squats", name: "Jump Squats", category: "legs", icon: "⬆️", difficulty: "intermediate", suggestedSets: 3, suggestedReps: 15, description: "Explosive squat jump — plyometric power" },
  { id: "pistol-squats", name: "Pistol Squats", category: "legs", icon: "🔫", difficulty: "advanced", suggestedSets: 3, suggestedReps: 5, description: "One-leg squat, other leg extended forward" },
  { id: "calf-raises", name: "Calf Raises", category: "legs", icon: "⬆️", difficulty: "beginner", suggestedSets: 3, suggestedReps: 25, description: "Rise onto toes — can do on a step edge for deeper range" },
  { id: "wall-sit", name: "Wall Sit", category: "legs", icon: "🧱", difficulty: "beginner", suggestedSets: 3, suggestedReps: 30, description: "Back against wall, knees at 90° — static hold" },
  { id: "step-ups", name: "Step-ups", category: "legs", icon: "🪜", difficulty: "beginner", suggestedSets: 3, suggestedReps: 12, description: "Step onto chair or box, alternating legs" },
  { id: "sissy-squats", name: "Sissy Squats", category: "legs", icon: "🤸", difficulty: "intermediate", suggestedSets: 3, suggestedReps: 10, description: "Knees forward, lean back — quad isolation" },
  { id: "cossack-squats", name: "Cossack Squats", category: "legs", icon: "💃", difficulty: "intermediate", suggestedSets: 3, suggestedReps: 10, description: "Side-to-side deep squat — hip mobility and leg strength" },

  // ── Hamstrings / Glutes ──
  { id: "glute-bridges", name: "Glute Bridges", category: "hamstrings", icon: "🌉", difficulty: "beginner", suggestedSets: 3, suggestedReps: 15, description: "Hips up, squeeze glutes at the top" },
  { id: "single-leg-bridges", name: "Single-leg Glute Bridges", category: "hamstrings", icon: "🦵", difficulty: "intermediate", suggestedSets: 3, suggestedReps: 10, description: "One leg raised — more intense glute bridge" },
  { id: "nordic-curls", name: "Nordic Curls", category: "hamstrings", icon: "🎿", difficulty: "advanced", suggestedSets: 3, suggestedReps: 5, description: "Kneeling with feet anchored, lower upper body with control" },
  { id: "donkey-kicks", name: "Donkey Kicks", category: "hamstrings", icon: "🦵", difficulty: "beginner", suggestedSets: 3, suggestedReps: 15, description: "On all fours, kick one leg straight back and up" },
  { id: "fire-hydrants", name: "Fire Hydrants", category: "hamstrings", icon: "🐕", difficulty: "beginner", suggestedSets: 3, suggestedReps: 15, description: "On all fours, lift leg out to the side" },
  { id: "hip-thrusts", name: "Hip Thrusts", category: "hamstrings", icon: "⬆️", difficulty: "intermediate", suggestedSets: 3, suggestedReps: 12, description: "Upper back on bench/sofa edge, drive hips up", equipment: "weights optional" },
  { id: "romanian-deadlifts", name: "Romanian Deadlifts", category: "hamstrings", icon: "🏋️", difficulty: "intermediate", suggestedSets: 3, suggestedReps: 10, description: "Hinge at hips, keep back straight — hamstring stretch and strength", equipment: "weights optional" },
  { id: "clamshells", name: "Clamshells", category: "hamstrings", icon: "🐚", difficulty: "beginner", suggestedSets: 3, suggestedReps: 15, description: "Side-lying, open and close top knee — glute medius" },

  // ── Core ──
  { id: "crunches", name: "Crunches", category: "core", icon: "🫃", difficulty: "beginner", suggestedSets: 3, suggestedReps: 20, description: "Classic abdominal crunch — upper abs" },
  { id: "leg-raises", name: "Leg Raises", category: "core", icon: "🦵", difficulty: "beginner", suggestedSets: 3, suggestedReps: 15, description: "Lie flat, raise straight legs — lower abs" },
  { id: "bicycle-crunches", name: "Bicycle Crunches", category: "core", icon: "🚲", difficulty: "beginner", suggestedSets: 3, suggestedReps: 20, description: "Alternating elbow to opposite knee — obliques" },
  { id: "russian-twists", name: "Russian Twists", category: "core", icon: "🔄", difficulty: "beginner", suggestedSets: 3, suggestedReps: 20, description: "Seated, lean back, twist side to side", equipment: "weight optional" },
  { id: "plank", name: "Plank", category: "core", icon: "🪵", difficulty: "beginner", suggestedSets: 3, suggestedReps: 45, description: "Forearm plank — hold position with rigid body" },
  { id: "side-plank", name: "Side Plank", category: "core", icon: "🫲", difficulty: "intermediate", suggestedSets: 3, suggestedReps: 30, description: "Stacked feet or knees — oblique focus" },
  { id: "dead-bug", name: "Dead Bug", category: "core", icon: "🪲", difficulty: "beginner", suggestedSets: 3, suggestedReps: 12, description: "On back, extend opposite arm and leg — anti-extension core" },
  { id: "hollow-body", name: "Hollow Body Hold", category: "core", icon: "🍌", difficulty: "intermediate", suggestedSets: 3, suggestedReps: 30, description: "On back, arms and legs off ground, lower back pressed to floor" },
  { id: "v-ups", name: "V-ups", category: "core", icon: "V", difficulty: "intermediate", suggestedSets: 3, suggestedReps: 12, description: "From flat, bring hands to toes forming a V" },
  { id: "dragon-flags", name: "Dragon Flags", category: "core", icon: "🐉", difficulty: "advanced", suggestedSets: 3, suggestedReps: 5, description: "Lie on bench, grip overhead, lower entire body — Bruce Lee's move" },
  { id: "mountain-climbers", name: "Mountain Climbers", category: "core", icon: "⛰️", difficulty: "beginner", suggestedSets: 3, suggestedReps: 30, description: "Plank position, alternate driving knees to chest" },
  { id: "flutter-kicks", name: "Flutter Kicks", category: "core", icon: "🏊", difficulty: "beginner", suggestedSets: 3, suggestedReps: 30, description: "On back, legs extended, alternate small kicks up and down" },
  { id: "supermans", name: "Supermans", category: "core", icon: "🦸", difficulty: "beginner", suggestedSets: 3, suggestedReps: 15, description: "On stomach, lift arms and legs — lower back" },

  // ── Cardio ──
  { id: "burpees", name: "Burpees", category: "cardio", icon: "⬆️", difficulty: "intermediate", suggestedSets: 3, suggestedReps: 12, description: "Squat, kick back, push-up, jump up" },
  { id: "jumping-jacks", name: "Jumping Jacks", category: "cardio", icon: "⭐", difficulty: "beginner", suggestedSets: 3, suggestedReps: 40, description: "Jump legs out while raising arms — classic warmup" },
  { id: "high-knees", name: "High Knees", category: "cardio", icon: "🦵", difficulty: "beginner", suggestedSets: 3, suggestedReps: 30, description: "Run in place, driving knees up" },
  { id: "butt-kickers", name: "Butt Kickers", category: "cardio", icon: "🦶", difficulty: "beginner", suggestedSets: 3, suggestedReps: 30, description: "Run in place, heels to glutes" },
  { id: "skater-hops", name: "Skater Hops", category: "cardio", icon: "⛸️", difficulty: "beginner", suggestedSets: 3, suggestedReps: 20, description: "Lateral hops side to side — skater motion" },
  { id: "tuck-jumps", name: "Tuck Jumps", category: "cardio", icon: "⬆️", difficulty: "intermediate", suggestedSets: 3, suggestedReps: 12, description: "Jump and pull knees to chest in the air" },
  { id: "bear-crawls", name: "Bear Crawls", category: "cardio", icon: "🐻", difficulty: "intermediate", suggestedSets: 3, suggestedReps: 20, description: "On hands and feet, crawl forward — full body cardio" },
  { id: "box-jumps", name: "Box Jumps", category: "cardio", icon: "📦", difficulty: "intermediate", suggestedSets: 3, suggestedReps: 10, description: "Jump onto a sturdy box or step — plyometric power", equipment: "box or step" },
  { id: "frog-jumps", name: "Frog Jumps", category: "cardio", icon: "🐸", difficulty: "beginner", suggestedSets: 3, suggestedReps: 12, description: "Deep squat position, leap forward like a frog" },
  { id: "invisible-jump-rope", name: "Invisible Jump Rope", category: "cardio", icon: "🪢", difficulty: "beginner", suggestedSets: 3, suggestedReps: 50, description: "Mimic jump rope — wrist flicks, light hops" },
  { id: "star-jumps", name: "Star Jumps", category: "cardio", icon: "🌟", difficulty: "beginner", suggestedSets: 3, suggestedReps: 15, description: "Jump and spread arms and legs like a star" },
  { id: "sprint-intervals", name: "Sprint Intervals", category: "cardio", icon: "🏃", difficulty: "intermediate", suggestedSets: 5, suggestedReps: 30, description: "Sprint 30 sec, walk 60 sec — repeat" },

  // ── Stretching / Yoga ──
  { id: "downward-dog", name: "Downward Dog", category: "stretching", icon: "🐕", difficulty: "beginner", suggestedSets: 1, suggestedReps: 30, description: "Inverted V position — hamstring, calf, and shoulder stretch" },
  { id: "childs-pose", name: "Child's Pose", category: "stretching", icon: "🧒", difficulty: "beginner", suggestedSets: 1, suggestedReps: 60, description: "Knees wide, torso forward, arms extended — resting pose" },
  { id: "cobra-pose", name: "Cobra Pose", category: "stretching", icon: "🐍", difficulty: "beginner", suggestedSets: 1, suggestedReps: 30, description: "On stomach, press up with hands — front body stretch" },
  { id: "pigeon-pose", name: "Pigeon Pose", category: "stretching", icon: "🕊️", difficulty: "intermediate", suggestedSets: 1, suggestedReps: 45, description: "One leg forward bent, other extended back — hip opener" },
  { id: "cat-cow", name: "Cat-Cow Stretch", category: "stretching", icon: "🐱", difficulty: "beginner", suggestedSets: 1, suggestedReps: 10, description: "On all fours, alternate arching and rounding spine — reps count each cycle" },
  { id: "forward-fold", name: "Standing Forward Fold", category: "stretching", icon: "📐", difficulty: "beginner", suggestedSets: 1, suggestedReps: 45, description: "Bend forward at hips, reaching for toes — hamstring stretch" },
  { id: "butterfly-stretch", name: "Butterfly Stretch", category: "stretching", icon: "🦋", difficulty: "beginner", suggestedSets: 1, suggestedReps: 45, description: "Soles of feet together, knees out — groin and hip stretch" },
  { id: "quad-stretch", name: "Standing Quad Stretch", category: "stretching", icon: "🦵", difficulty: "beginner", suggestedSets: 1, suggestedReps: 30, description: "Hold one ankle behind you — quadriceps stretch" },
  { id: "warrior-1", name: "Warrior I", category: "stretching", icon: "⚔️", difficulty: "beginner", suggestedSets: 1, suggestedReps: 30, description: "Lunge forward, arms up — hip flexor and chest opener" },
  { id: "warrior-2", name: "Warrior II", category: "stretching", icon: "🛡️", difficulty: "beginner", suggestedSets: 1, suggestedReps: 30, description: "Lunge with arms out to sides — hip and groin opener" },
  { id: "triangle-pose", name: "Triangle Pose", category: "stretching", icon: "🔺", difficulty: "intermediate", suggestedSets: 1, suggestedReps: 30, description: "Wide stance, reach forward, hand to shin or floor — full body stretch" },
  { id: "seated-forward-fold", name: "Seated Forward Fold", category: "stretching", icon: "🪑", difficulty: "beginner", suggestedSets: 1, suggestedReps: 60, description: "Sit with legs extended, reach for toes — hamstring and lower back" },
  { id: "neck-rolls", name: "Neck Rolls", category: "stretching", icon: "🌀", difficulty: "beginner", suggestedSets: 1, suggestedReps: 10, description: "Slow circular neck movements — tension release" },
  { id: "shoulder-rolls", name: "Shoulder Rolls", category: "stretching", icon: "🔄", difficulty: "beginner", suggestedSets: 1, suggestedReps: 10, description: "Roll shoulders forward and backward — upper body release" },
  { id: "spinal-twist", name: "Seated Spinal Twist", category: "stretching", icon: "🌀", difficulty: "beginner", suggestedSets: 1, suggestedReps: 30, description: "Cross one leg over, twist torso opposite direction" },
  { id: "bridge-pose", name: "Bridge Pose", category: "stretching", icon: "🌉", difficulty: "beginner", suggestedSets: 1, suggestedReps: 30, description: "On back, lift hips — chest, hip, and spine opener" },
  { id: "happy-baby", name: "Happy Baby", category: "stretching", icon: "👶", difficulty: "beginner", suggestedSets: 1, suggestedReps: 45, description: "On back, grab feet, pull knees toward armpits — hip release" },
];

export interface CustomWorkout {
  id: string;
  name: string;
  exercises: { exerciseId: string; sets: number; reps: number }[];
  createdAt: string;
  lastUsed?: string;
}
