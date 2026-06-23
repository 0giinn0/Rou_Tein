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
- **Shared Logic** — Streak state, quiz data, and types live in `packages/shared` and are consumed by both mobile and web

## Project Structure

```
Habit Tracking Application/
├── apps/
│   ├── mobile/          # Expo Router React Native app (primary)
│   └── web/             # Next.js web app
├── packages/
│   ├── shared/          # Shared types, quiz data, and streak utilities
│   └── ui/              # Shared React UI components (web)
├── package.json         # Workspace root
└── README.md
```

## Tech Stack

- **Mobile:** React Native, Expo Router, TypeScript, Zustand, `@react-three/fiber/native`, `expo-gl`, Three.js
- **Web:** Next.js 14, React, TypeScript, Tailwind CSS, Zustand, `@react-three/fiber`, Framer Motion
- **Shared:** TypeScript utilities consumed by both apps

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Expo Go app (for mobile development)

### Install Dependencies

From the repository root:

```bash
npm install --legacy-peer-deps --ignore-scripts
```

> `--ignore-scripts` is currently used because `react-native-screens` has a postinstall script that fails in this environment. Skipping it does not affect running the app through Expo, since Metro bundles code at runtime.

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

### Build for Production

**Mobile:**

```bash
cd apps/mobile
npx expo export --platform ios
npx expo export --platform android
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

## Notes

- The mobile app is the primary target and uses Expo SDK 51.
- The web app is maintained alongside mobile and shares streak/quiz logic through `packages/shared`.
- Streak progress is persisted on mobile using `@react-native-async-storage/async-storage` and on web using `localStorage` via Zustand persist.
