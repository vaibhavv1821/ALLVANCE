# ALLVANCE

> **Your Personal Growth Ecosystem**  
> *Personal All-in-One Android Productivity, Placement, and Learning Application*

---

## 📱 Application Identity & Philosophy

- **Application Name**: ALLVANCE
- **Tagline**: Your Personal Growth Ecosystem
- **Target Platform**: Android (Cross-platform compatible via React Native & Expo)
- **Use Case**: Personal productivity, placement mastery, and engineering growth
- **Architecture**: **100% Offline-First**. Zero cloud backend dependencies, zero telemetry, zero mandatory accounts or paid subscriptions.
- **Design System**: Premium Dark and Light modes with centralized design tokens and system preference detection.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Runtime & Framework** | React Native (0.88+) & Expo (SDK 58) | High-performance mobile runtime on Android |
| **Language** | TypeScript (Strict mode) | 100% type-safe codebase |
| **Routing & Navigation** | Expo Router (v4, File-based) | Tab and stack navigation with native animations |
| **Local Database** | SQLite (`expo-sqlite`) | High-speed local relational database with WAL mode & foreign key enforcement |
| **ORM** | Drizzle ORM (`drizzle-orm`) | Type-safe schema definitions, relationships, and queries |
| **State Management** | Zustand (v5) with AsyncStorage persist | Theme preferences, developer demo mode, and offline state |
| **Forms & Validation** | React Hook Form & Zod | Form handling with schema-driven validation |
| **Icons & Design Tokens** | Lucide React Native & Custom Tokens | Cohesive, minimal design language |

---

## 📂 Project Structure

```
ALLVANCE/
├── assets/                  # App icons, splash screens, and adaptive Android icons
├── src/
│   ├── app/                 # Expo Router routes (Tabs + 15 Dedicated Module Screens)
│   │   ├── (tabs)/          # 5 Main Bottom Tabs:
│   │   │   ├── _layout.tsx  # Tab layout configuration with Lucide icons
│   │   │   ├── index.tsx    # Home Tab (DashboardScreen)
│   │   │   ├── placement.tsx# Placement Ecosystem Tab
│   │   │   ├── practice.tsx # Practice Arena Tab (DSA, SQL, Aptitude, Interviews)
│   │   │   ├── ai.tsx       # AI Assistant Tab
│   │   │   └── more.tsx     # More Tab (Searchable grid of all 15 modules)
│   │   ├── _layout.tsx      # Root Stack Layout & Database initialization
│   │   ├── placement.tsx    # 1. Placement Tracker
│   │   ├── dsa.tsx          # 2. DSA Practice
│   │   ├── resume.tsx       # 3. Resume Builder
│   │   ├── sql.tsx          # 4. SQL Studio
│   │   ├── interviews.tsx   # 5. Interview Preparation
│   │   ├── aptitude.tsx     # 6. Aptitude & Reasoning
│   │   ├── companies.tsx    # 7. Company Directory
│   │   ├── projects.tsx     # 8. Project Portfolio
│   │   ├── planner.tsx      # 9. Study Planner
│   │   ├── knowledge.tsx    # 10. Knowledge Vault
│   │   ├── ai.tsx           # 11. AI Assistant
│   │   ├── analytics.tsx    # 12. Analytics & Insights
│   │   ├── skills.tsx       # 13. Skills Matrix
│   │   ├── personal.tsx     # 14. Personal Manager
│   │   └── settings.tsx     # 15. Settings & Database Management
│   ├── components/          # Reusable UI component library
│   │   ├── AppHeader.tsx
│   │   ├── BottomNavigation.tsx
│   │   ├── ConfirmationDialog.tsx
│   │   ├── EmptyState.tsx
│   │   ├── LoadingIndicator.tsx
│   │   ├── ModuleCard.tsx
│   │   ├── ModuleScreenLayout.tsx
│   │   ├── PrimaryButton.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── SearchInput.tsx
│   │   ├── SectionHeader.tsx
│   │   ├── StatCard.tsx
│   │   └── index.ts
│   ├── constants/           # Module registry and app constants
│   │   ├── modules.ts
│   │   └── index.ts
│   ├── database/            # SQLite & Drizzle ORM layer
│   │   ├── client.ts        # Database connection singleton & PRAGMA configuration
│   │   ├── schema/          # Drizzle ORM table schemas
│   │   │   ├── settings.ts
│   │   │   ├── system.ts
│   │   │   ├── placement.ts
│   │   │   ├── dsa.ts
│   │   │   ├── planner.ts
│   │   │   ├── knowledge.ts
│   │   │   ├── analytics.ts
│   │   │   └── index.ts
│   │   ├── migrations/      # Versioned migration runner (PRAGMA user_version)
│   │   ├── repositories/    # BaseRepository & SettingsRepository
│   │   ├── seed/            # Default settings and seed configurations
│   │   └── index.ts         # initDatabase() entry point
│   ├── features/            # Feature-specific modules (empty foundations for Phase 0)
│   ├── hooks/               # Custom React hooks (useAppTheme)
│   ├── services/            # Storage & Analytics logging services
│   ├── store/               # Zustand stores (useThemeStore, useDemoStore)
│   ├── theme/               # Centralized design tokens (colors, typography, spacing, shadows)
│   ├── types/               # Global TypeScript definitions
│   └── utils/               # Helpers & Lucide icon mapper
├── app.json                 # Expo configuration
├── package.json             # Dependencies and build scripts
├── tsconfig.json            # Strict TypeScript configuration with `@/*` aliases
└── README.md
```

---

## 🧭 Navigation Architecture

The application implements a dual navigation pattern:
1. **5 Main Bottom Tabs**:
   - `Home` (`/`): Premium Dashboard with greeting, current date, overall progress, key stats, tasks, events, quick actions, and recent activity.
   - `Placement` (`/placement`): Dedicated career pipeline and application funnel.
   - `Practice` (`/practice`): Technical hub grouping DSA, SQL, Aptitude, and Interview Preparation.
   - `AI` (`/ai`): On-device private AI assistant.
   - `More` (`/more`): Filterable and searchable grid organizing all 15 modules into 5 categories.

2. **15 Distinct Module Routes**:
   Every section has its own dedicated, strongly-typed route accessible via direct deep-link or in-app tap:
   1. `/placement` - Placement Tracker
   2. `/dsa` - DSA Practice
   3. `/resume` - Resume Builder
   4. `/sql` - SQL Studio
   5. `/interviews` - Interview Preparation
   6. `/aptitude` - Aptitude & Reasoning
   7. `/companies` - Company Directory
   8. `/projects` - Project Portfolio
   9. `/planner` - Study Planner
   10. `/knowledge` - Knowledge Vault
   11. `/ai` - AI Assistant
   12. `/analytics` - Analytics & Insights
   13. `/skills` - Skills Matrix
   14. `/personal` - Personal Manager
   15. `/settings` - Settings & Database Tools

Each screen features its own title, subtitle, themed icon, and introductory empty state with planned capabilities.

---

## 🎨 Theme System

The design system is built around a centralized token architecture:
- **Dark Mode**: Premium deep slate background (`#090D16`), rich surface cards (`#0F172A`), and vibrant sky blue accent (`#38BDF8`).
- **Light Mode**: Crisp slate background (`#F8FAFC`), pure white surface (`#FFFFFF`), and deep ocean blue accent (`#0284C7`).
- **System Default**: Automatically reacts to device dark/light appearance changes.
- **Persistence**: Selected theme is saved instantly using Zustand and AsyncStorage.
- **Live Switcher**: Easily toggle themes via the top header bar icon or inside Settings.

---

## 🗄️ Database Foundation

- **Engine**: SQLite (`expo-sqlite`) using synchronous high-speed bindings.
- **Safety**:
  - `PRAGMA foreign_keys = ON;` enforced on connection.
  - `PRAGMA journal_mode = WAL;` (Write-Ahead Logging) enabled for concurrency and performance.
  - Transactional migrations with automatic rollback on error.
  - Schema tracking via `schema_migrations` and `PRAGMA user_version`.
- **Repository Pattern**: `BaseRepository` provides standardized error handling, and `SettingsRepository` provides get/set/object methods.
- **Pre-prepared Schemas**: Ready for future phases:
  - `settings`
  - `applications`
  - `dsa_problems`
  - `tasks`
  - `notes`
  - `activity_logs`

---

## 🧪 Developer Demo Mode

As requested in Section 5:
- **Default State (Zero Mode)**: When no real user data exists, the application shows pure zero/empty states (0 active applications, 0 problems solved, 0% readiness, friendly empty-state prompt cards).
- **Demo Mode**: A dedicated switch located on the Home header bar and in Settings allows developers or reviewers to instantly preview sample data (populated progress bar, tasks, upcoming events, and recent activity logs) without polluting the real offline SQLite database.

---

## 🚀 Instructions to Run on Android

### Prerequisites
- Node.js (v18 or higher recommended; v24 installed)
- Android device with **Expo Go** app installed, OR an Android Studio Emulator running

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start the Expo Development Server
```bash
npx expo start
```
*Or directly start targeting Android:*
```bash
npm run android
```

### Step 3: Run on Your Device
1. **Physical Android Device (Fastest)**:
   - Install **Expo Go** from the Google Play Store.
   - Ensure your phone and development computer are connected to the same Wi-Fi network.
   - Scan the QR code displayed in the terminal using the Expo Go camera/scanner.
2. **Android Studio Emulator**:
   - Start an Android Virtual Device (AVD) from Android Studio.
   - Press `a` in the terminal running `npx expo start` to launch directly onto the emulator.

### Step 4: Verification Checks
- **TypeScript Check**: Run `npx tsc --noEmit` to verify 0 type errors.
- **Bundle Verification**: The application has been verified to bundle cleanly into Hermes Android bytecode (`expo export --platform android`).

---

## 🛑 Phase Status

- **Phase 0 (Application Foundation)**: **COMPLETE**
- **Phase 1 (Placement Management Module)**: **COMPLETE**
- Next Phase: Phase 2 (DSA Tracker - To be initiated upon user instruction).
