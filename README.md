# Rou_Tein

A habit-building productivity app with streaks, daily challenges, quizzes, tasks, nutrition tracking, and weather insights. Built as a cross-platform **React Native mobile app** with an accompanying **Next.js web app**, sharing core logic through a local monorepo package.

![Build Status](https://img.shields.io/badge/build-passing-success)

## Features

- **Streak Counter** — Track your current streak, longest streak, level, XP, and coins
- **Daily Challenges** — Complete tasks, log meals, check weather, and finish the daily quiz to earn rewards
- **Daily Quiz** — 5 fresh questions every day with explanations
- **Interactive Three.js Sphere** — A reactive 3D sphere on the home dashboard that responds to touch and changes color based on your daily progress
- **Tasks** — TickTick-style task list with priorities and completion tracking
- **Nutrition** — Macro rings and meal logging by breakfast, lunch, dinner, and snacks
- **Weather** — 7-day forecast, current conditions, and a gamified weather challenge
- **Gamification** — Badges, unlockable themes, level-up rewards, and streak freeze protection
- **Cloud Sync** — Back up and restore your tasks and streaks with Supabase
- **Push Notifications** — Daily reminders and streak warnings
- **Shared Logic** — Streak state, quiz data, and types live in `packages/shared` and are consumed by both mobile and web

## Project Structure

```
Habit Tracking Application/
├── apps/
│   ├── mobile/          # Expo Router React Native app (primary)
│   ├── web/             # Next.js web app
│   └── watch/           # Companion watch-face web app
├── packages/
│   ├── shared/          # Shared types, quiz data, and streak utilities
│   └── ui/              # Shared React UI components (web)
├── supabase/
│   └── migrations/      # Database schema migrations
├── package.json         # Workspace root
└── README.md
```

## Tech Stack

- **Mobile:** React Native, Expo Router, TypeScript, Zustand, `@react-three/fiber/native`, `expo-gl`, Three.js, `react-native-reanimated`, `expo-haptics`, `expo-notifications`
- **Web:** Next.js 14, React, TypeScript, Tailwind CSS, Zustand, `@react-three/fiber`, Framer Motion
- **Backend:** Supabase (Postgres + Auth)
- **Shared:** TypeScript utilities consumed by both apps

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Expo Go app (for mobile development)
- Supabase project (for cloud sync)

### Install Dependencies

From the repository root:

```bash
npm install --legacy-peer-deps
```

### Environment Variables

Create `apps/mobile/.env.local` with your Supabase credentials:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Run the Mobile App

```bash
cd apps/mobile
npx expo start
```

- Scan the QR code with **Expo Go** on iOS or Android
- Press `i` to open in an iOS simulator
- Press `a` to open in an Android emulator

### Run the Web App

```bash
cd apps/web
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

### Run Tests

```bash
npm test
```

### Build for Production

**Mobile (EAS):**

```bash
cd apps/mobile
eas build --platform ios
eas build --platform android
```

**Web:**

```bash
cd apps/web
npm run build
```

## Daily Challenges

| Challenge | Requirement | Reward |
|-----------|-------------|--------|
| Task Master | Complete 3 tasks today | 30 XP, 10 coins |
| Nutrition Log | Log one meal today | 20 XP, 5 coins |
| Weather Watcher | Check today's weather | 15 XP, 5 coins |
| Brain Boost | Complete the daily quiz | 40 XP, 15 coins |

## Gamification

- **Badges** — Unlock achievements for streaks, levels, perfect days, and more
- **Themes** — Spend coins to unlock color themes
- **Streak Freeze** — Buy protection for missed days
- **Level Rewards** — Earn bonus coins every time you level up

## Notes

- The mobile app is the primary target and uses Expo SDK 51.
- The web app is maintained alongside mobile and shares streak/quiz logic through `packages/shared`.
- Streak progress is persisted on mobile using `@react-native-async-storage/async-storage` and on web using `localStorage` via Zustand persist.
- Cloud sync is optional and requires a Supabase project. Apply the migrations in `supabase/migrations/` to your project.
