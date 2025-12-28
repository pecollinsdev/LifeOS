# LifeOS - Personal Life Dashboard

A mobile-first, all-in-one personal life dashboard web application optimized for iPhone Safari. Built with modern web technologies and designed for future conversion to a native iOS app.

## 🎯 Purpose

LifeOS helps you track and manage multiple aspects of your personal life in one unified dashboard:

- **Tasks** - Manage your to-dos and get things done
- **Habits** - Build and track daily habits with streak tracking
- **Finance** - Track expenses, income, and budget
- **Fitness** - Log workouts and track fitness goals
- **Nutrition** - Record meals and track nutritional intake

## 🏗️ Architecture

### Tech Stack

- **Frontend Framework**: Next.js 14 (App Router) with React 18 and TypeScript
- **Styling**: Tailwind CSS (mobile-first approach)
- **State Management**: Zustand (lightweight, scalable)
- **Data Persistence**: IndexedDB via `idb` library (local-first approach)
- **Build Tool**: Next.js built-in bundler

### Project Structure

```
LifeOS/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Home dashboard
│   ├── tasks/              # Tasks feature route
│   └── [other features]/   # Other feature routes
│
├── features/               # Feature modules (domain-driven)
│   ├── tasks/              # Tasks feature (fully implemented)
│   │   ├── models/         # Domain models
│   │   ├── services/       # Business logic layer
│   │   ├── store/          # Zustand state management
│   │   ├── components/     # Feature-specific components
│   │   └── pages/          # Feature page components
│   │
│   ├── habits/             # Habits feature (scaffolded)
│   ├── finance/            # Finance feature (scaffolded)
│   ├── fitness/            # Fitness feature (scaffolded)
│   └── nutrition/          # Nutrition feature (scaffolded)
│
├── shared/                 # Shared UI components and utilities
│   └── components/         # Reusable UI components
│
├── lib/                    # Core libraries and abstractions
│   ├── storage/            # Storage abstraction layer
│   └── utils/              # Utility functions
│
└── public/                 # Static assets and PWA files
```

### Architecture Principles

1. **Clean Architecture**: Clear separation of concerns with distinct layers (models, services, store, components)
2. **SOLID Principles**: Single responsibility, dependency inversion, and composition over inheritance
3. **Feature-Based Organization**: Each domain is self-contained and can be easily added/removed
4. **Storage Abstraction**: Storage layer can be swapped (IndexedDB → API → Cloud) without changing feature code
5. **Mobile-First Design**: Optimized for iPhone screen sizes with touch-friendly interactions

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Modern web browser (Safari on iOS recommended for testing)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd LifeOS
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## 📱 Mobile Optimization

### iPhone Safari Specific

- **Viewport Configuration**: Optimized for iPhone screen sizes with safe area support
- **Touch Interactions**: Large touch targets (minimum 44x44px), tap highlight removal
- **PWA Ready**: Can be installed on iOS home screen via Safari's "Add to Home Screen"
- **Safe Area Insets**: Proper handling of iPhone notch and home indicator

### Progressive Web App (PWA)

The app is configured as a PWA with:
- Web App Manifest (`/manifest.json`)
- Theme color and display mode
- Icon support for iOS home screen
- Standalone display mode (no browser UI)

To install on iOS:
1. Open the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. The app will launch in standalone mode

## 🔄 iOS Conversion Readiness

The app is structured for easy conversion to a native iOS app using **Capacitor** or similar tools.

### Key Design Decisions for iOS Conversion

1. **No Browser-Only APIs**: Avoided APIs that don't work in native wrappers
2. **Responsive Units**: Used relative units (rem, %, vw/vh) instead of fixed pixels
3. **Safe Area Support**: Already handles iOS safe areas via CSS env() variables
4. **Storage Abstraction**: Can easily swap IndexedDB for native storage (Core Data, SQLite)
5. **Component Architecture**: React components can be reused or converted to SwiftUI/UIKit

### Conversion Steps (Future)

1. Install Capacitor: `npm install @capacitor/core @capacitor/cli`
2. Initialize Capacitor: `npx cap init`
3. Add iOS platform: `npx cap add ios`
4. Sync web assets: `npx cap sync`
5. Open in Xcode: `npx cap open ios`
6. Replace storage layer with native storage if needed
7. Add native plugins for enhanced features (camera, notifications, etc.)

## 📦 Feature Modules

### Tasks (Implemented)

Complete task management with:
- Create, read, update, delete operations
- Task completion tracking
- Priority levels (Low, Medium, High)
- Due dates
- Status management (Todo, In Progress, Completed)

**Architecture Pattern**:
```
models/Task.ts          → Domain model
services/TaskService.ts → Business logic
store/taskStore.ts      → State management
components/             → UI components
```

### Other Features (Scaffolded)

The following features are scaffolded with models and can be implemented following the Tasks pattern:

- **Habits**: Streak tracking, frequency management
- **Finance**: Transaction tracking, categories, budgets
- **Fitness**: Workout logging, duration, calories
- **Nutrition**: Meal tracking, calories, macros

To implement a new feature:
1. Create service layer (`services/[Feature]Service.ts`)
2. Create Zustand store (`store/[feature]Store.ts`)
3. Build components (`components/`)
4. Create page component (`pages/[Feature]Page.tsx`)
5. Add route in `app/[feature]/page.tsx`

## 🗄️ Data Storage

### Current Implementation: IndexedDB

- **Library**: `idb` (IndexedDB wrapper)
- **Storage**: Client-side only, persists across sessions
- **Structure**: One object store per feature domain
- **Abstraction**: `IStorage<T>` interface allows swapping implementations

### Storage Interface

```typescript
interface IStorage<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | undefined>;
  save(item: T): Promise<T>;
  delete(id: string): Promise<boolean>;
  clear(): Promise<void>;
}
```

### Future Storage Options

The abstraction layer supports:
- **LocalStorage**: For smaller datasets
- **Backend API**: For cloud sync
- **Native Storage**: Core Data (iOS) or SQLite (via Capacitor)

## 🎨 UI Components

### Shared Components

Located in `shared/components/`:
- **Button**: Multiple variants (primary, secondary, outline, ghost)
- **Card**: Container component with padding options
- **Input**: Form input with label and error states
- **Icon**: SVG icon component

All components are:
- Mobile-optimized (touch-friendly)
- Accessible (ARIA labels, semantic HTML)
- Type-safe (TypeScript)
- Styled with Tailwind CSS

## 🧪 Development Guidelines

### Code Quality Rules

1. **Single Responsibility**: Each file/function has one clear purpose
2. **Type Safety**: Full TypeScript coverage, no `any` types
3. **Documentation**: JSDoc comments for public APIs
4. **Naming**: Descriptive names, no abbreviations
5. **Composition**: Prefer composition over inheritance
6. **Error Handling**: Proper error handling in async operations

### File Naming

- Components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- Types/Interfaces: `PascalCase.ts`
- Stores: `camelCaseStore.ts`

### Adding a New Feature

1. Create feature folder in `features/[feature-name]/`
2. Define domain model in `models/`
3. Create service layer in `services/`
4. Set up Zustand store in `store/`
5. Build UI components in `components/`
6. Create page component in `pages/`
7. Add route in `app/[feature-name]/page.tsx`
8. Export from `features/[feature-name]/index.ts`

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript type checking

## 🔒 Browser Support

- **Primary**: Safari on iOS 14+
- **Secondary**: Chrome, Firefox, Edge (latest versions)
- **Mobile-First**: Optimized for mobile, responsive on desktop

## 📄 License

[Add your license here]

## 🤝 Contributing

[Add contribution guidelines here]

## 📧 Contact

[Add contact information here]

---

**Built with ❤️ for mobile-first personal productivity**

