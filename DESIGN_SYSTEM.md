# LifeOS Design System

A lightweight design system for the LifeOS mobile-first personal dashboard application.

## Design Principles

- **Mobile-First**: Optimized for iPhone Safari with one-handed use
- **Minimal & Calm**: Neutral aesthetic, reduced visual noise
- **Clear Hierarchy**: Typography and spacing over borders and lines
- **Touch-Optimized**: All interactive elements ≥ 44px touch targets
- **Accessible**: Semantic HTML, proper labels, adequate contrast

## Design Tokens

Design tokens are the single source of truth for design decisions. They use CSS variables as the foundation and integrate seamlessly with Tailwind CSS.

### Token Philosophy

- **Semantic over Literal**: Tokens use semantic names (e.g., `--color-background`) rather than literal values (e.g., `--blue-500`)
- **CSS Variables as Source of Truth**: All tokens are defined as CSS variables in `app/globals.css`
- **Minimal & Pragmatic**: Only tokens that are actually used or needed for theming
- **Theme-Ready**: Structure supports future dark mode via `:root[data-theme="dark"]` selectors
- **Tailwind Integration**: Tokens are mapped to Tailwind's theme system for convenient class usage

### Naming Conventions

Tokens follow a consistent naming pattern:

```
--{category}-{property}-{variant?}
```

Examples:
- `--color-background` - Background color
- `--color-text-primary` - Primary text color
- `--color-primary-600` - Primary brand color at 600 shade
- `--spacing-md` - Medium spacing value
- `--font-size-base` - Base font size
- `--radius-lg` - Large border radius
- `--shadow-md` - Medium shadow

### Token Categories

#### Colors

**Background & Surface**
- `--color-background` - Main app background
- `--color-surface` - Card/container background
- `--color-surface-hover` - Hover state for surfaces

**Text**
- `--color-text-primary` - Main text color
- `--color-text-secondary` - Secondary text (descriptions)
- `--color-text-tertiary` - Tertiary text (metadata)
- `--color-text-disabled` - Disabled text

**Primary (Brand)**
- `--color-primary-50` through `--color-primary-900` - Brand color scale

**Semantic (Status)**
- `--color-success-*` - Success states (bg, border, text, light, dark)
- `--color-warning-*` - Warning states
- `--color-error-*` - Error states
- `--color-info-*` - Info states

**Neutral (Gray)**
- `--color-neutral-50` through `--color-neutral-900` - Gray scale

#### Spacing

- `--spacing-xs` (4px) - Extra small spacing
- `--spacing-sm` (8px) - Small spacing
- `--spacing-md` (16px) - Medium spacing
- `--spacing-lg` (24px) - Large spacing
- `--spacing-xl` (32px) - Extra large spacing
- `--spacing-2xl` (48px) - 2X large spacing
- `--spacing-3xl` (64px) - 3X large spacing

#### Typography

**Font Sizes**
- `--font-size-xs` (12px)
- `--font-size-sm` (14px)
- `--font-size-base` (16px)
- `--font-size-lg` (18px)
- `--font-size-xl` (20px)
- `--font-size-2xl` (24px)

**Font Weights**
- `--font-weight-normal` (400)
- `--font-weight-medium` (500)
- `--font-weight-semibold` (600)
- `--font-weight-bold` (700)

**Line Heights**
- `--line-height-tight` (1.25)
- `--line-height-normal` (1.5)
- `--line-height-relaxed` (1.75)

#### Border Radius

- `--radius-sm` (6px)
- `--radius-md` (8px)
- `--radius-lg` (12px)
- `--radius-xl` (16px)
- `--radius-full` (9999px)

#### Shadows

- `--shadow-sm` - Small shadow
- `--shadow-md` - Medium shadow
- `--shadow-lg` - Large shadow

### Using Tokens

#### In CSS

Use CSS variables directly:

```css
.my-component {
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
}
```

#### In Tailwind Classes

Tokens are mapped to Tailwind's theme system. Use semantic class names:

```tsx
// Background colors
<div className="bg-background">...</div>
<div className="bg-surface">...</div>

// Text colors
<p className="text-text-primary">...</p>
<p className="text-text-secondary">...</p>

// Semantic colors
<div className="bg-success-bg text-success-text">...</div>
<div className="bg-error-bg border-error-border">...</div>

// Spacing (via Tailwind's spacing scale)
<div className="p-md">...</div>  // Uses --spacing-md

// Border radius
<div className="rounded-lg">...</div>  // Uses --radius-lg

// Shadows
<div className="shadow-md">...</div>  // Uses --shadow-md
```

#### In Components

Prefer semantic tokens over raw values:

```tsx
// ✅ Good - Uses semantic token
<Card className="bg-surface border-neutral-200" />

// ❌ Avoid - Raw color value
<Card className="bg-white border-gray-200" />
```

### Adding New Tokens

1. **Define the CSS variable** in `app/globals.css` within `:root`:
   ```css
   :root {
     --color-new-token: rgb(255 0 0);
   }
   ```

2. **Map to Tailwind** in `tailwind.config.ts` if you want to use it via classes:
   ```ts
   colors: {
     'new-token': 'var(--color-new-token)',
   }
   ```

3. **Use in components** via Tailwind classes or CSS variables

### Future Theming

The token system is structured to support dark mode. When ready, add:

```css
:root[data-theme="dark"] {
  --color-background: rgb(17 24 39);
  --color-surface: rgb(31 41 55);
  --color-text-primary: rgb(249 250 251);
  /* ... other dark mode overrides */
}
```

Then toggle themes by adding/removing `data-theme="dark"` on the root element.

## Dark Mode

Dark mode is fully implemented with system preference detection, manual override, and persistent storage.

### Theme Behavior

**Three Theme Modes:**
1. **System** (default) - Follows OS preference (`prefers-color-scheme`)
2. **Light** - Manual light mode override
3. **Dark** - Manual dark mode override

**Theme Detection Priority:**
1. Manual user preference (stored in localStorage)
2. System preference (if no manual preference set)
3. Light mode (fallback)

### Color Palette - Dark Mode

Dark mode uses a neutral, calm palette optimized for low-light viewing:

- **Background**: `rgb(17 24 39)` - Dark gray-900 (not pure black for comfort)
- **Surface**: `rgb(31 41 55)` - Elevated surfaces (gray-800)
- **Text Primary**: `rgb(249 250 251)` - High contrast light text (gray-50)
- **Text Secondary**: `rgb(209 213 219)` - Secondary text (gray-300)
- **Text Tertiary**: `rgb(156 163 175)` - Tertiary text (gray-400)

**Design Philosophy:**
- Avoids pure black (`#000000`) and pure white (`#ffffff`) extremes
- Maintains visual hierarchy from light mode
- Comfortable for extended low-light use
- Preserves brand colors (primary remains consistent)

### Theme Toggle

The `ThemeToggle` component cycles through theme modes:
- System → Light → Dark → System

**Placement:**
- Typically in `PageHeader` `rightAction` slot
- Visible but unobtrusive
- Mobile-optimized touch target (44px minimum)

**Usage:**
```tsx
import { ThemeToggle } from '@/shared/components';

<PageHeader
  title="Page Title"
  rightAction={<ThemeToggle />}
/>
```

### Implementation Details

**Theme Provider:**
- Manages theme state via React Context
- Persists preference to localStorage (`lifeos-theme`)
- Listens to system preference changes
- Prevents flash of wrong theme on load

**CSS Variables:**
- All design tokens automatically adapt via CSS variable overrides
- Smooth transitions (0.2s ease) between themes
- No layout shifts when toggling

**Accessibility:**
- Maintains WCAG AA contrast ratios in both modes
- Focus states remain visible
- Semantic color tokens ensure proper contrast

### Using Dark Mode in Components

Components automatically adapt via design tokens. Use semantic tokens:

```tsx
// ✅ Good - Uses semantic tokens
<div className="bg-surface text-neutral-900 dark:text-neutral-50">
  Content
</div>

// ❌ Avoid - Hardcoded colors won't adapt
<div className="bg-white text-black">
  Content
</div>
```

**Dark Mode Classes:**
Tailwind's `dark:` prefix works with our token system:

```tsx
<div className="bg-surface border-neutral-200 dark:border-neutral-700">
  Card content
</div>
```

### Theme State Management

Access theme state via the `useTheme` hook:

```tsx
import { useTheme } from '@/lib/theme';

const { theme, resolvedTheme, setTheme } = useTheme();
// theme: 'light' | 'dark' | 'system'
// resolvedTheme: 'light' | 'dark' (actual applied theme)
```

## Spacing Scale

Consistent spacing using Tailwind's default scale with safe area support:

- **Container padding**: `px-4` (16px) - consistent horizontal padding
- **Section spacing**: `py-6` (24px) - main content vertical padding
- **Component gaps**: `gap-3` (12px) or `gap-4` (16px) - between related elements
- **Card spacing**: `space-y-6` (24px) - between card groups
- **Item spacing**: `space-y-3` (12px) - between list items
- **Safe areas**: `pt-safe-top`, `pb-safe-bottom` - iOS safe area support

## Typography Scale

### Headings

- **Page Title (H1)**: `text-2xl font-bold` - Used in PageHeader
- **Section Heading (H2)**: `text-lg font-semibold` - Used for grouped content
- **Card Title (H3)**: `text-lg font-semibold` - Used in feature cards and task items

### Body Text

- **Primary**: `text-base` - Default body text
- **Secondary**: `text-sm text-gray-600` - Descriptions, helper text
- **Tertiary**: `text-xs text-gray-500` - Metadata, timestamps

### Font Family

- **Primary**: Inter (Google Fonts) - Applied globally via layout

## Color Palette

### Primary Colors

- **Primary**: Sky blue (`primary-600` = `#0284c7`)
  - Used for: Primary actions, active states, links
  - Variants: 50-900 scale available

### Neutral Colors

- **Gray Scale**: Standard Tailwind gray scale
  - `gray-50`: Backgrounds
  - `gray-200`: Borders
  - `gray-400`: Icons, disabled states
  - `gray-600`: Secondary text
  - `gray-900`: Primary text

### Semantic Colors

- **Success**: Green (`green-100`, `green-700`)
- **Warning**: Yellow (`yellow-100`, `yellow-700`)
- **Error**: Red (`red-50`, `red-200`, `red-600`, `red-800`)
- **Info**: Blue (`blue-50`, `blue-200`, `blue-800`)

### Feature Colors

- **Tasks**: Blue (`bg-blue-500`)
- **Habits**: Green (`bg-green-500`)
- **Finance**: Yellow (`bg-yellow-500`)
- **Fitness**: Red (`bg-red-500`)
- **Nutrition**: Purple (`bg-purple-500`)

## Component Variants

### Button

- **Variants**: `primary`, `secondary`, `outline`, `ghost`
- **Sizes**: `sm`, `md`, `lg`
- **Touch target**: Minimum 44px height
- **States**: Hover, active, focus, disabled

### Card

- **Padding**: `none`, `sm` (12px), `md` (16px), `lg` (24px)
- **Border radius**: `rounded-xl` (12px)
- **Shadow**: `shadow-sm` (default), `hover:shadow-md` (interactive)
- **Interactive**: `active:scale-[0.98]` for touch feedback

### Input / Select

- **Height**: `py-3` (48px total with padding) - exceeds 44px minimum
- **Border radius**: `rounded-lg` (8px)
- **Focus**: `ring-2 ring-primary-500`
- **Error state**: Red border and ring

### Badge

- **Variants**: `primary`, `secondary`, `success`, `warning`, `error`
- **Sizes**: `sm`, `md`
- **Shape**: `rounded-full`

### Alert

- **Variants**: `info`, `error`, `warning`, `success`
- **Background**: Light tinted background with matching border
- **Text**: Darker variant of the color

## Layout Patterns

### Page Structure

```
<div className="min-h-screen bg-gray-50 pb-safe-bottom">
  <PageHeader />
  <main className="max-w-2xl mx-auto px-4 py-6">
    {/* Content */}
  </main>
</div>
```

### Page Header

- **Sticky**: `sticky top-0 z-10`
- **Padding**: `px-4 py-4`
- **Safe area**: `pt-safe-top`
- **Border**: `border-b border-gray-200`

### Content Container

- **Max width**: `max-w-2xl` (672px)
- **Centered**: `mx-auto`
- **Padding**: `px-4 py-6`

## Touch Targets

All interactive elements meet or exceed 44px minimum:

- **Buttons**: Minimum `py-2` (32px) + padding = 44px+
- **Checkboxes**: `w-11 h-11` (44px)
- **Icon buttons**: `w-11 h-11` (44px)
- **Inputs**: `py-3` (48px total height)

## Interaction Patterns

### Touch Feedback

- **Active state**: `active:scale-95` or `active:scale-[0.98]`
- **Hover**: Desktop hover states (not critical for mobile)
- **Focus**: Visible ring (`focus:ring-2`)

### Transitions

- **Color changes**: `transition-colors`
- **Transforms**: `transition-all` or `transition-transform`
- **Shadows**: `transition-shadow`

## Accessibility

### Semantic HTML

- Proper heading hierarchy (H1 → H2 → H3)
- Semantic form elements with labels
- ARIA labels for icon-only buttons

### Focus States

- Visible focus rings on all interactive elements
- `focus:outline-none focus:ring-2` pattern

### Contrast

- Text meets WCAG AA standards
- Primary text: `gray-900` on `gray-50` background
- Secondary text: `gray-600` on white background

## Responsive Considerations

Currently optimized for mobile (iPhone Safari). Future considerations:

- Tablet layouts (maintain max-width, adjust grid)
- Desktop layouts (wider containers, hover states)

## Component Usage Guidelines

### When to Use Shared Components

- **PageHeader**: All pages except home (home uses custom header)
- **Card**: All content containers
- **Button**: All actions
- **Input/Select**: All form inputs
- **Badge**: Counts, status indicators
- **Alert**: Errors, empty states, notifications
- **Icon**: All iconography

### When to Create Feature Components

- Complex, feature-specific interactions
- Components that won't be reused
- Domain-specific UI patterns

## Notes

- Design system is intentionally lightweight
- Avoid over-engineering
- Prefer composition over configuration
- Document non-obvious design decisions

