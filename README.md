# Rou_Tein

*or: how I learned to stop doom-scrolling and actually do stuff*

Listen. You've downloaded 47 productivity apps. You've tried bullet journals, time-blocking, and that one guy on YouTube who wakes up at 4 AM to take an ice bath. None of it stuck. That's fine. I'm not judging. (I'm totally judging.)

Rou_Tein is a habit tracker that actually tries to be fun. It bribes you with XP, fake internet coins, and pretty colors. It has a spinning 3D sphere that changes color when you do your chores, which is the dumbest motivation system ever invented and yet somehow it works. It also tracks your meals, tells you the weather, and has a seven-day workout plan so you can finally do that push-up you've been putting off since 2019.

Built with React Native for your phone, with a Next.js web app for your desktop, because I believe in cross-platform suffering.

![Build Status](https://github.com/0giinn0/Rou_Tein/actions/workflows/ci.yml/badge.svg)

---

## What This Thing Actually Does

- **Dopamine Dispenser (Streaks)** — Current streak, longest streak, level, XP, coins. It's basically a Tamagotchi for your self-worth.
- **Daily Challenges** — Four things to do every day. Complete them all and you get a Perfect Day badge. You will become insufferable about this.
- **Daily Quiz** — 5 questions. Different every day. Scored. You don't have to be smart — but it helps.
- **The Spinny Orb** — A Three.js sphere on the homepage that reacts to your touch and changes color based on your progress. It serves no practical purpose. I will not be taking questions.
- **Tasks** — A to-do list with priorities and completion tracking. You know, the thing every app has. Mine just looks better.
- **Nutrition** — Log food by meal type. Track calories, protein, carbs, fat. The macro rings will guilt you into eating a vegetable.
- **Weather** — 7-day forecast, temperature wave chart, seasonal background effects. In winter it snows on the screen. In summer the waves pulse. It's completely unnecessary. You'll love it.
- **Workouts** — A pre-built 7-day calisthenics program, plus a custom workout builder with 100+ exercises. You can finally stop watching fitness reels and actually do a Bulgarian split squat.
- **Pomodoro Timer** — 25-minute focus sessions with a satisfying animated ring. Completing sessions earns XP. Your ADHD just met its match.
- **Gamification** — Badges, unlockable color themes, streak freeze items. It's a video game where the boss fight is your crippling procrastination.
- **Dark/Light Mode** — System-aware theming, plus custom color palettes you can buy with in-app coins. Capitalism, but make it aesthetic.

## Stuff I Used

| Layer | The Tech | Why |
|-------|----------|-----|
| Mobile | React Native, Expo SDK 51, Expo Router | Because rewriting the app twice in Swift and Kotlin sounded like a bad Tuesday |
| Web | Next.js 14, Tailwind CSS | Static export, zero runtime, loads faster than your morning coffee |
| 3D | `@react-three/fiber`, Three.js | For the spinny orb. *Obviously.* |
| State | Zustand | Because Redux is a war crime |
| Animations | `react-native-reanimated`, Framer Motion | Things go *whoosh* instead of *clunk* |
| Backend | Supabase | Optional. Only if you want your streaks to survive a phone wipe. |
| CI/CD | GitHub Actions | Lints, tests, builds on every push. Also builds APKs and IPAs via EAS. Yes, *GitHub* builds your phone apps now. The future is weird. |

## The Filing Cabinet (`/project-structure`)

```
Habit Tracking Application/
├── apps/
│   ├── mobile/          # The actual app. Expo Router. The main character.
│   ├── web/             # Next.js web version. The supporting actor.
│   └── watch/           # Watch-face companion. The quirky spin-off.
├── packages/
│   ├── shared/          # Types, quiz data, streak logic. One brain, two bodies.
│   └── ui/              # Shared web components. Reusable, like Tupperware.
├── supabase/
│   └── migrations/      # Database schema. Run these if you want cloud sync.
├── .github/workflows/   # CI, APK builds, iOS builds. The robots do the work now.
└── README.md            # You are here. Congrats.
```

## How to Make It Go

### Prerequisites

- Node.js 18+ (or 20, I'm not your mom)
- npm (comes with Node, you probably have it)
- Expo Go app on your phone (free on both app stores)
- A Supabase project (only if you want cloud sync — totally optional)
- A pulse (negotiable)

### One Command, That's It

```bash
npm install --legacy-peer-deps
```

The `--legacy-peer-deps` flag is there because some dependencies haven't been updated since the Obama administration. It's fine. Everything works. Trust me. <sub><sup>(Famous last words.)</sup></sub>

### Fire It Up

**Phone:**

```bash
cd apps/mobile
npx expo start
```

Scan the QR code with Expo Go. Ta-da. You're a developer now.

**Browser:**

```bash
cd apps/web
npm run dev
```

Open `http://localhost:3000`. The web version renders server-side and then mentally checks out. (It's a static export.)

**Tests:**

```bash
npm test
```

13 tests. All passing. If they're not, something has gone terribly wrong and you should probably run `git blame`.

### Environment Variables (for cloud sync)

Create `apps/mobile/.env.local`:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-actual-project-url.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-not-a-fake-one
```

Without this, the app still works fine. Your data just stays local, like a hermit with commitment issues.

### Build for the App Stores

**Android APK:**

```bash
cd apps/mobile
eas build --platform android --profile preview
```

Or just click the shiny **Build APK** button in GitHub Actions. Either way, you get an `.apk` you can sideload onto any Android device. (Enable "Unknown sources" in Settings first. I'm not Apple.)

**iOS:**

```bash
cd apps/mobile
eas build --platform ios --profile production --auto-submit
```

Requires an Apple Developer account. The build auto-submits to TestFlight. If you don't have an Apple Developer account, this is the part where you give Apple $99/year for the privilege of installing your own app on your own phone. Don't think about it too hard.

**Web:**

```bash
cd apps/web
npm run build
```

Static HTML in `apps/web/dist/`. Deploy it anywhere. Vercel, Netlify, your cousin's Raspberry Pi. It doesn't care.

### GitHub Actions Secrets

| Secret | Used by | Why |
|--------|---------|-----|
| `EXPO_TOKEN` | APK & iOS builds | So GitHub can talk to Expo on your behalf. Generate at https://expo.dev/settings/access-tokens |
| `APPLE_APP_SPECIFIC_PASSWORD` | iOS TestFlight submit | Apple's way of saying "we don't trust you, prove it again" |

Put these in **Settings → Secrets and variables → Actions**. No, not in the code. *Never* in the code.

## The Bribery System (Daily Challenges)

| Challenge | What you do | What you get |
|-----------|------------|--------------|
| Task Master | Complete 3 tasks | 30 XP, 10 coins |
| Nutrition Log | Log one meal | 20 XP, 5 coins |
| Weather Watcher | Check the weather | 15 XP, 5 coins |
| Brain Boost | Finish the daily quiz | 40 XP, 15 coins |

Four things. That's it. If you can't do four things, you have bigger problems than this README can solve.

## The Casino Mechanics (Gamification)

- **Badges** — Unlock them for hitting streak milestones, leveling up, or just sticking around long enough. They make a satisfying pop. That's the dopamine. Don't fight it.
- **Themes** — Four color themes (Midnight, Ocean, Sunset, Forest, Royal). The first one's free. The rest cost coins. I'm basically a mobile game without the microtransactions. *For now.*
- **Streak Freeze** — 100 coins to protect your streak from a missed day. It's like cheating, but I allow it.
- **Level Rewards** — Every time you level up, you get bonus coins. The XP curve is exponential, which means level 50 is mathematically possible but I haven't seen it happen yet. Be the first.

## Known Issues (aka "Features")

- The `react-native-screens` postinstall script used to fail on some setups. I fixed it by upgrading to 3.31.1, which was three characters of change and an hour of debugging. Software development is beautiful.
- The 3D sphere uses `expo-gl`, which works on real devices but might throw shade on certain emulators. That's the emulator's problem, not mine.
- The seasonal effects (snow in winter, blossoms in spring, etc.) use your phone's clock. If you set your phone to December in July, it will snow. This is a feature, not a bug. I'm calling it "climate skepticism mode."
- Cloud sync is opt-in because some people (correctly) don't want their breakfast logs sitting on a server in Iowa.
- The workout section has 100+ exercises. If you scroll through all of them instead of working out, that's a you problem.

## The Legal Bit No One Reads

This project is private. If you're reading this and you're not supposed to be, congratulations on your investigative skills. Here's your reward: 🏆

---

*Built with caffeine, spite, and an unhealthy amount of TypeScript.*
