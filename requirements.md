# UI Enhancement Requirements - CureBot

## Context
CureBot is a healthcare chatbot for Lahore, Pakistan with a mobile-app style frontend (480px max-width). The current UI is functional but needs polish to feel more professional, modern, and engaging.

## Requirements

### REQ-1: Smooth Animations & Micro-interactions
**User Story:** As a user, I want smooth transitions and subtle animations so the app feels alive and responsive.
- Cards should have hover lift effects with smooth transitions
- Page sections should fade in on scroll (staggered entrance)
- Buttons should have press/ripple feedback
- Chat messages should slide in smoothly
- Loading states should have skeleton shimmer effects

### REQ-2: Improved Color System & Visual Hierarchy
**User Story:** As a user, I want a clean, consistent color palette that guides my attention to important elements.
- Primary green (#16a34a) with proper light/dark variants
- Gradient accents on key CTAs (emergency button, send button)
- Better contrast between sections (alternating backgrounds)
- Subtle shadows and depth for card elevation
- Consistent border-radius system (8px, 12px, 16px, 20px)

### REQ-3: Enhanced Typography & Spacing
**User Story:** As a user, I want text that is easy to read with proper visual rhythm.
- Consistent type scale (12px, 14px, 16px, 20px, 24px, 32px)
- Proper line-height (1.4 for body, 1.2 for headings)
- Better letter-spacing on headings
- Consistent padding/margin system (multiples of 4px)
- Adequate whitespace between sections

### REQ-4: Interactive Chat Experience
**User Story:** As a user, I want the chat to feel like a real conversation with visual feedback.
- Typing indicator with animated dots
- Message timestamps
- Read receipts (✓✓) on sent messages
- Quick reply chips below bot messages
- Smooth auto-scroll to latest message
- Chat container with proper max-height and scroll

### REQ-5: Polished Card Components
**User Story:** As a user, I want service cards and hospital cards to look premium and clickable.
- Subtle gradient backgrounds on service icons
- Hospital cards with image overlay gradient for text readability
- Star ratings with half-star support visually
- Distance/location badges
- Hover state with border glow effect

### REQ-6: Mobile-First Responsive Polish
**User Story:** As a user on mobile, I want the app to feel native with proper touch targets.
- Minimum 44px touch targets on all interactive elements
- Safe area padding for notched phones
- Smooth horizontal scroll with snap points on carousels
- Pull-to-refresh visual hint at top
- Bottom safe area for input bar

### REQ-7: Dark Mode Support (Optional)
**User Story:** As a user, I want to use the app comfortably at night.
- CSS custom properties for easy theme switching
- Proper dark backgrounds (#1a1a2e, #16213e)
- Adjusted text colors for dark mode readability
- Toggle in header

## Acceptance Criteria
- All animations run at 60fps (no jank)
- Lighthouse accessibility score > 90
- Works on Chrome, Safari, Firefox mobile
- No layout shifts on load
- All interactive elements have focus states
