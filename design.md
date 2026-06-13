# UI Enhancement Design - CureBot

## Technical Approach

Single-file implementation in `frontend/index.html`. All CSS enhancements use modern CSS (custom properties, animations, scroll-snap, backdrop-filter). No build tools or external JS libraries needed.

## Design Tokens (CSS Custom Properties)

```css
:root {
  /* Colors */
  --primary: #16a34a;
  --primary-light: #dcfce7;
  --primary-dark: #15803d;
  --accent: #0ea5e9;
  --danger: #ef4444;
  --danger-light: #fef2f2;
  --bg: #f9fafb;
  --surface: #ffffff;
  --border: #e5e7eb;
  --text: #111827;
  --text-secondary: #6b7280;
  --text-muted: #9ca3af;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.07);
  --shadow-lg: 0 10px 25px -5px rgba(0,0,0,0.1);
  --shadow-glow: 0 0 20px rgba(22,163,74,0.15);

  /* Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-full: 9999px;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;

  /* Transitions */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 400ms;
}
```

## Component Enhancements

### 1. Animations System
- **Entrance animations:** `@keyframes fadeInUp` with staggered `animation-delay` per section
- **Hover effects:** `transform: translateY(-3px)` + `box-shadow` increase on cards
- **Button press:** `transform: scale(0.96)` on `:active`
- **Scroll-triggered:** Use `IntersectionObserver` to add `.visible` class as sections enter viewport

### 2. Card Improvements
- Service cards: gradient icon backgrounds (each service gets unique gradient)
- Hospital cards: bottom gradient overlay on images for text contrast
- Hover: border-color transition + glow shadow
- Active/pressed state for touch feedback

### 3. Chat Enhancements
- Fixed-height chat container (max-height: 400px) with overflow-y scroll
- Message entrance: `slideInLeft` for bot, `slideInRight` for user
- Timestamp below each message (small, muted text)
- Quick reply chips: horizontal scrollable row below bot messages
- Typing indicator: 3 bouncing dots in a pill shape

### 4. Carousel Polish
- `scroll-snap-type: x mandatory` on hospital scroll
- `scroll-snap-align: start` on each card
- Scroll padding for peek effect (shows next card edge)
- Optional dot indicators below

### 5. Input Bar Enhancement
- Sticky at bottom when chat is active
- Subtle top border with blur backdrop
- Input focus: green border + subtle glow
- Send button: gradient background with pulse animation when message typed

### 6. Mobile Touch
- All buttons/cards: `min-height: 44px`
- `-webkit-tap-highlight-color: transparent`
- `touch-action: manipulation` on interactive elements
- `overscroll-behavior: contain` on scroll containers

## File Changes

| File | Change |
|------|--------|
| `frontend/index.html` | Update `<style>` block with design tokens, animations, enhanced component styles. Add `IntersectionObserver` script for scroll animations. |

## Implementation Order
1. Add design tokens (CSS variables)
2. Add animation keyframes
3. Enhance card styles (service, hospital)
4. Polish chat section (container, messages, input)
5. Add carousel scroll-snap
6. Add entrance animations with IntersectionObserver
7. Mobile touch improvements
