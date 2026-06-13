# UI Enhancement Tasks

## Task 1: Add Design Tokens & Animation Keyframes
- [ ] Add CSS custom properties (colors, shadows, radius, spacing, transitions) to `:root`
- [ ] Add keyframe animations: `fadeInUp`, `slideInLeft`, `slideInRight`, `pulse`, `shimmer`
- [ ] Add utility class `.animate-in` with `opacity: 0; transform: translateY(20px)` and `.animate-in.visible` with transition

## Task 2: Enhance Service Cards
- [ ] Add unique gradient backgrounds to each service icon (blue, purple, orange, green, teal)
- [ ] Add hover state: `translateY(-3px)`, `box-shadow: var(--shadow-lg)`, border-color change
- [ ] Add active/pressed state: `transform: scale(0.97)`
- [ ] Ensure 44px minimum touch target

## Task 3: Polish Hospital Carousel
- [ ] Add `scroll-snap-type: x mandatory` to `.hospitals-scroll`
- [ ] Add `scroll-snap-align: start` to `.hospital-card`
- [ ] Add bottom gradient overlay on `.h-img` for text readability
- [ ] Add scroll padding for peek effect
- [ ] Improve card shadow and hover glow

## Task 4: Enhance Chat Section
- [ ] Add `max-height: 400px` and `overflow-y: auto` to `.chat-messages`
- [ ] Add message slide-in animations (left for bot, right for user)
- [ ] Add timestamp display below messages
- [ ] Add quick reply chips after bot messages
- [ ] Style typing indicator as a pill with bouncing dots
- [ ] Make input bar sticky with backdrop blur when chat is active

## Task 5: Button & Interaction Polish
- [ ] Add gradient to emergency button and send button
- [ ] Add ripple/press effect on all buttons (`:active` scale)
- [ ] Add focus-visible outlines for accessibility
- [ ] Add transition to all interactive elements
- [ ] Pulse animation on send button when input has text

## Task 6: Scroll Entrance Animations
- [ ] Add IntersectionObserver script to detect sections entering viewport
- [ ] Apply staggered `fadeInUp` to: trust badges, service cards, symptoms banner, specialties, hospitals
- [ ] Add `.animate-in` class to all major sections
- [ ] Ensure animations only play once (not on scroll back up)

## Task 7: Mobile & Touch Polish
- [ ] Add `-webkit-tap-highlight-color: transparent` globally
- [ ] Add `touch-action: manipulation` on buttons and cards
- [ ] Add `overscroll-behavior: contain` on scroll containers
- [ ] Add safe-area padding (`env(safe-area-inset-bottom)`) to input bar
- [ ] Ensure smooth momentum scrolling on carousels
