# Theme Implementation Guide

## Overview

The LifeOS PWA now has a complete, professional dark/light mode implementation that:
- Automatically detects iOS system preference using `prefers-color-scheme` media query
- Provides a manual toggle switch in the dashboard header
- Uses CSS variables for all colors (no hardcoded dark: prefixes)
- Persists user preference in localStorage
- Works seamlessly across all components

## Architecture

### ThemeProvider (`lib/theme/ThemeProvider.tsx`)

The `ThemeProvider` component manages theme state and applies it to the document:

- **System Preference Detection**: Automatically detects iOS system preference on first load
- **Manual Override**: User can toggle between light and dark modes
- **Persistence**: Saves preference to localStorage
- **Dynamic Updates**: Listens to system preference changes when no manual override is set
- **Implementation**: Uses `data-theme` attribute on `<html>` element to trigger CSS variable changes

**Key Features:**
- Defaults to system preference on first load
- Stores 'light' or 'dark' in localStorage (null = use system)
- Applies theme immediately on mount to prevent FOUC (Flash of Unstyled Content)
- Updates iOS status bar style for PWA

### CSS Variables (`app/globals.css`)

All colors are defined as CSS variables in `:root` and overridden in `:root[data-theme="dark"]`:

**Light Mode Variables:**
- `--color-background`: Light gray background
- `--color-surface`: White surface
- `--color-text-primary`: Dark text
- `--color-text-secondary`: Medium gray text
- `--color-text-tertiary`: Light gray text

**Dark Mode Variables:**
- `--color-background`: Dark gray background
- `--color-surface`: Darker gray surface
- `--color-text-primary`: Light text
- `--color-text-secondary`: Medium light text
- `--color-text-tertiary`: Light gray text

### ThemeToggle Component (`shared/components/ThemeToggle/ThemeToggle.tsx`)

Simple light/dark toggle button:
- Shows sun icon for light mode, moon icon for dark mode
- Toggles between 'light' and 'dark' themes
- Accessible with proper ARIA attributes
- Mobile-optimized (44x44px minimum touch target)

### Component Updates

All components have been refactored to use CSS variables instead of `dark:` prefixes:

**Before:**
```tsx
<div className="text-neutral-900 dark:text-neutral-50">
```

**After:**
```tsx
<div className="text-text-primary">
```

**Color Token Mapping:**
- `text-text-primary` → `var(--color-text-primary)`
- `text-text-secondary` → `var(--color-text-secondary)`
- `text-text-tertiary` → `var(--color-text-tertiary)`
- `bg-surface` → `var(--color-surface)`
- `bg-background` → `var(--color-background)`
- `gray-*` → `var(--color-neutral-*)`

## Testing Instructions

### 1. Test System Preference Detection

**On iPhone/iPad:**
1. Open Settings → Display & Brightness
2. Toggle between Light and Dark mode
3. Open the LifeOS PWA
4. The app should automatically match your system preference

**On Desktop (Safari/Chrome):**
1. Open System Preferences → General → Appearance (macOS)
2. Toggle between Light and Dark mode
3. Refresh the LifeOS app
4. The app should automatically match your system preference

### 2. Test Manual Toggle

1. Open the LifeOS dashboard
2. Click the sun/moon icon in the top-right header
3. The theme should switch immediately
4. Refresh the page - your preference should persist
5. Toggle again - should switch back and persist

### 3. Test Component Consistency

Navigate through all features and verify:
- **Home Dashboard**: Cards, text, icons all switch correctly
- **Tasks**: Task items, forms, buttons switch correctly
- **Habits**: Habit items, completion checkboxes switch correctly
- **Finance**: Transaction items, balance display switch correctly
- **Fitness**: Workout items, forms switch correctly
- **Nutrition**: Meal items, macro display switch correctly

### 4. Test iOS PWA Status Bar

1. Add LifeOS to Home Screen (iOS)
2. Open the PWA
3. Toggle between light and dark mode
4. The status bar should update:
   - Light mode: Default (black text)
   - Dark mode: Black-translucent (white text)

### 5. Test No Flash of Wrong Theme

1. Clear localStorage: `localStorage.removeItem('lifeos-theme')`
2. Set system to dark mode
3. Hard refresh the page (Cmd+Shift+R / Ctrl+Shift+R)
4. The page should load in dark mode immediately (no flash of light mode)

## Implementation Details

### Theme State Management

```typescript
type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;           // Current effective theme
  setTheme: (theme: Theme) => void;  // Set manual theme
  toggleTheme: () => void;  // Toggle between light/dark
}
```

### CSS Variable System

All colors use semantic naming:
- `--color-background`: Main background color
- `--color-surface`: Card/surface background
- `--color-text-primary`: Primary text color
- `--color-text-secondary`: Secondary text color
- `--color-text-tertiary`: Tertiary text color

These variables automatically switch based on `[data-theme]` attribute.

### Tailwind Integration

Tailwind config maps CSS variables to utility classes:
- `bg-background` → `var(--color-background)`
- `text-text-primary` → `var(--color-text-primary)`
- `gray-600` → `var(--color-neutral-600)`

## Browser Support

- ✅ Safari 14+ (iOS 14+)
- ✅ Chrome 106+
- ✅ Firefox 101+
- ✅ Edge 106+

Older browsers fall back to light mode if `prefers-color-scheme` is not supported.

## Performance

- Theme is applied immediately on mount (prevents FOUC)
- CSS variables are hardware-accelerated
- No JavaScript required for theme switching (CSS handles it)
- Minimal re-renders (only ThemeProvider updates)

## Accessibility

- Theme toggle has proper ARIA labels
- `aria-pressed` indicates current state
- Keyboard accessible (Tab + Enter/Space)
- Minimum 44x44px touch target (iOS guidelines)

## Future Enhancements

Potential improvements:
- Add transition animations for theme changes
- Support for custom theme colors
- High contrast mode option
- Reduced motion support

