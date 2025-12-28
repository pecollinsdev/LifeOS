# Progressive Web App (PWA) Setup

LifeOS is configured as a Progressive Web App (PWA) that can be installed on iPhone Safari and other mobile devices.

## Installation on iPhone Safari

### Steps to Install:

1. **Open LifeOS in Safari** (not Chrome or other browsers)
   - Navigate to your LifeOS URL in Safari

2. **Tap the Share Button**
   - Tap the share icon (square with arrow pointing up) at the bottom of Safari

3. **Select "Add to Home Screen"**
   - Scroll down in the share menu
   - Tap "Add to Home Screen"

4. **Customize (Optional)**
   - You can edit the app name if desired
   - Tap "Add" in the top right

5. **Launch from Home Screen**
   - The app icon will appear on your home screen
   - Tap it to launch LifeOS in standalone mode (no browser UI)

## PWA Features

### Standalone Mode
- **Full-screen experience**: No browser address bar or navigation
- **Native feel**: Looks and feels like a native iOS app
- **Safe area support**: Properly handles iPhone notches and safe areas

### Offline Support
- **Local storage**: All data is stored locally using IndexedDB
- **Works offline**: App functions without internet connection
- **Data persistence**: Your data persists across app restarts

### Performance
- **Fast loading**: Optimized for mobile performance
- **Smooth animations**: 60fps interactions
- **Battery efficient**: Optimized rendering and state management

## Required Icon Files

The PWA requires the following icon files in the `public/` directory:

### Required Icons:
- `icon-180.png` (180x180) - **Required for iOS**
- `icon-192.png` (192x192) - Standard PWA size
- `icon-512.png` (512x512) - Standard PWA size

### Optional (for better quality):
- `icon-120.png` (120x120) - iPhone retina
- `icon-152.png` (152x152) - iPad

### Icon Guidelines:
- **Format**: PNG with transparency
- **Design**: Should work on both light and dark backgrounds
- **Padding**: Leave 10-20% padding (iOS adds mask automatically)
- **No rounded corners**: iOS will add them automatically

### Creating Icons:

You can create icons using:
- Design tools (Figma, Sketch, Adobe XD)
- Online generators (PWA Asset Generator, RealFaviconGenerator)
- Export from your logo at multiple sizes

**Quick Command** (if you have a source icon):
```bash
# Using ImageMagick (if installed)
convert source-icon.png -resize 180x180 icon-180.png
convert source-icon.png -resize 192x192 icon-192.png
convert source-icon.png -resize 512x512 icon-512.png
```

## Configuration Files

### `app/manifest.ts`
- Defines PWA manifest (name, icons, theme colors)
- Next.js automatically serves this at `/manifest.json`
- Supports dark mode theme colors

### `app/layout.tsx`
- Contains iOS-specific meta tags
- Configures apple-touch-icon links
- Sets up viewport and theme colors

## Testing PWA Installation

### On iPhone Safari:

1. **Check Installation Prompt**:
   - Open Safari and navigate to your app
   - Look for the "Add to Home Screen" option in share menu
   - If missing, check that manifest is accessible at `/manifest.json`

2. **Test Standalone Mode**:
   - Install the app
   - Launch from home screen
   - Verify no browser UI appears
   - Check that safe areas are respected

3. **Test Offline**:
   - Enable Airplane Mode
   - Launch the app
   - Verify it still works (data loads from IndexedDB)

### Using Browser DevTools:

1. **Chrome DevTools** (for testing):
   - Open DevTools → Application tab
   - Check "Manifest" section for errors
   - Verify icons are loading correctly
   - Test "Add to Home Screen" simulation

2. **Safari Web Inspector** (iOS):
   - Connect iPhone to Mac
   - Enable Web Inspector in Safari settings
   - Inspect PWA installation state

## Troubleshooting

### App Won't Install:

1. **Check HTTPS**: PWA requires HTTPS (or localhost)
2. **Check Manifest**: Verify `/manifest.json` is accessible
3. **Check Icons**: Ensure icon files exist in `public/` directory
4. **Clear Cache**: Try clearing Safari cache and reloading

### Icons Not Showing:

1. **File Names**: Ensure exact filenames match manifest
2. **File Location**: Icons must be in `public/` directory
3. **File Format**: Must be PNG format
4. **File Size**: Check file sizes match manifest sizes

### Standalone Mode Issues:

1. **Viewport**: Check `viewportFit: 'cover'` in layout
2. **Safe Areas**: Verify CSS uses `env(safe-area-inset-*)`
3. **Status Bar**: Check `statusBarStyle` in metadata

## Browser Support

### Full Support:
- ✅ iOS Safari 11.3+ (iPhone/iPad)
- ✅ Chrome (Android)
- ✅ Edge (Windows)

### Partial Support:
- ⚠️ Safari (Desktop) - Limited PWA features
- ⚠️ Firefox - Basic PWA support

## Next Steps

1. **Create Icon Files**: Add icon files to `public/` directory
2. **Test Installation**: Install on iPhone and verify functionality
3. **Customize**: Adjust theme colors or app name if needed
4. **Deploy**: Deploy to production with HTTPS enabled

## Additional Resources

- [MDN: Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Apple: Configuring Web Applications](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)
- [Web.dev: PWA Checklist](https://web.dev/pwa-checklist/)

