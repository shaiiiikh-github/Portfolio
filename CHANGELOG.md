# Portfolio Redesign & Architecture Audit - CHANGELOG

## Overview
This redesign transforms Shabbir's portfolio into a native **Apple HIG (iOS 18 / visionOS)** experience while fixing all bugs identified during the initial code audit. The stack remains pure HTML5, CSS3, and vanilla ES6+ JavaScript with zero build steps or external frameworks, fully compatible with GitHub Pages and Linux hosting.

---

## 1. Audit Bug Fixes Implemented

1. **Resume File Name Case Sensitivity (404 Prevention):**
   - Corrected resume link to exact file casing: `files/Shabbir_resume.pdf` with `target="_blank" rel="noopener noreferrer"`.
2. **Duplicate ID Cleanup:**
   - Removed duplicate `<p id="form-status">` element outside the form.
3. **Missing CSS Classes Resolved:**
   - Defined `.btn-outline` with iOS translucent glass styling and distinct accent border.
   - Restyled section headings and removed defunct empty `.underline` element.
4. **CSS Selector Alignment:**
   - Unified `.contact` class across HTML and CSS; eliminated dead media query rules.
5. **Link Target & Security Attributes:**
   - Added `target="_blank" rel="noopener noreferrer"` across all 9 project action links and footer links.
   - Added accessible `aria-label` tags to icon-only links.
6. **Formspree Submissions & Toast:**
   - Implemented `try/catch/finally` async handler in `script.js`.
   - Prevented double submission by disabling the submit button and rendering a native iOS-style loading spinner.
   - Added floating iOS capsule Toast notification for feedback.
7. **Sheet & Dialog Accessibility:**
   - Added Escape key and outside-tap / swipe-down gesture dismissal for project sheets.
8. **Session-Cached Visitor Counter:**
   - Modified counter logic to count only once per browser session using `sessionStorage`. Subsequent loads read from session or cache.
9. **Accessibility & Reduced Motion:**
   - Wrapped animations (glow pulse, typing effect, transitions) in `@media (prefers-reduced-motion: reduce)`.
10. **Refined Copywriting:**
    - Hackout'24: *"Attended Hackout'24 and built <strong>CropRec</strong>, an ML model that recommends optimal crops based on soil and weather data."*
    - CVMU Hackathon 2.0: *"Selected for <strong>CVMU Hackathon 2.0</strong> and contributed to a security tool that detects and deletes emails containing malicious links."*
    - Footer: *"Thank you for visiting! Suggestions and feedback are always welcome."*

---

## 2. Image Optimization & Assets

All original images were preserved in `/assets/original/`. Images were cropped, converted to modern WebP format, and complemented with optimized PNG/JPG fallbacks.

| Asset Name | Original Size | Optimized WebP | Optimized Fallback | Reduction | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `shabbir.jpg` | 3,666.7 KB | **96.9 KB** | 98.9 KB (jpg) | **97.3%** | Face-centered square crop (600x600) |
| `clipboard_logger.png` | 1,650.1 KB | **15.7 KB** | 341.2 KB (png) | **99.0%** | Resized to 800x533 max width |
| `SURAKSHA (1).png` | 530.8 KB | **13.4 KB** | 151.3 KB (png) | **97.5%** | Renamed to `suraksha.*` (no spaces/brackets) |
| `Intellu.png` | 363.8 KB | **15.1 KB** | 135.0 KB (png) | **95.8%** | Resized to 800x390 max width |
| `SmartAgro.png` | 330.6 KB | **18.1 KB** | 139.2 KB (png) | **94.5%** | Resized to 800x412 max width |
| `Fake.png` | 298.2 KB | **14.2 KB** | 150.7 KB (png) | **95.2%** | Resized to 800x535 max width |
| `crop.png` | 71.9 KB | **12.8 KB** | 59.9 KB (png) | **82.2%** | Resized to 800x417 max width |
| `game.png` | 36.3 KB | **6.6 KB** | 29.3 KB (png) | **81.8%** | Resized to 800x469 max width |
| `qr.png` | 35.3 KB | **4.2 KB** | 20.3 KB (png) | **88.1%** | Resized to 800x400 max width |
| `pixel_np.png` | 8.4 KB | **4.8 KB** | 16.3 KB (png) | **42.8%** | Resized to 800x360 max width |
| `favicon.png` | — | — | **10.1 KB** | New | Generated 64x64 favicon |
| `apple-touch-icon.png` | — | — | **73.4 KB** | New | Generated 180x180 iOS home icon |
| **TOTAL** | **~7,000 KB** | **~201.8 KB** | — | **> 97%** | Massive speed & bandwidth improvement |

---

## 3. iOS Design Language & Component Features

1. **Colors & Materials:**
   - Authentic Apple system palettes for dark (`#000000`, `#1C1C1E`, `#2C2C2E`) and light (`#F2F2F7`, `#FFFFFF`, `#E5E5EA`).
   - True glassmorphism with `backdrop-filter: blur(24px) saturate(180%)`, 0.5px hairline borders, and elevation shadows.
   - iOS `systemBlue` (`#0A84FF` / `#007AFF`) with subtle Apple-style gradient highlights.
2. **Navigation:**
   - **Mobile (<=768px):** Fixed floating bottom tab bar with SF Symbols-style icons, active state, and `env(safe-area-inset-bottom)` support. Slim top glass bar for logo and theme switch.
   - **Desktop (>=768px):** Centered floating glass pill navbar with active scroll-spy indicator.
3. **Skills (Bento Grid):**
   - Reorganized into an iOS Settings-style widget grid: Frontend, Backend, AI & Machine Learning, Hardware & Tools. Added Python, ML, NLP, scikit-learn, Arduino/IoT, and Git.
4. **Projects & Detail Sheet:**
   - Segmented control filter: All / Web / ML & AI / IoT / Tools.
   - App Store-style project cards with image gradient overlay and tag chips.
   - Tapping any card opens an interactive modal sheet (bottom sheet on mobile with grabber handle, centered dialog on desktop) with keyboard trap and focus restoration.
5. **Timeline:**
   - Grouped vertical timeline with sticky glass year pills and category badge icons.
6. **Form:**
   - Inset-grouped form with floating labels, 16px minimum font size (avoids iOS Safari auto-zoom), and spinner feedback.

---

## 4. Verification Results

- Tested locally across multiple viewports:
  - 375x812 (iPhone 13 / Mini)
  - 430x932 (iPhone Pro Max)
  - 768x1024 (iPad)
  - 1440x900 (Desktop)
- **Zero horizontal overflow detected** on all screen sizes.
- **Zero broken asset requests** (200 OK across all local media and fonts).
- Captured verification screenshots are available in the `/screenshots` folder.

---

## 5. Desktop Floating Navbar Sliding Highlight Pill & Scroll-Spy Fix

1. **Pixel-Perfect Alignment:**
   - Positioned `.nav-indicator` relative to `ul#nav-links` container block using `getBoundingClientRect()`.
   - Matches width, height, and position of the active/hovered link to the sub-pixel (`diffX < 0.5px`, `diffW < 0.5px`).
2. **Spring-Like Cursor Movement:**
   - Tracks mouse hover and keyboard `:focus-visible` with smooth spring easing (`300ms cubic-bezier(0.2, 0.8, 0.2, 1)`).
   - On `mouseleave` or blur, indicator glides back to the current active (scroll-spy) section link.
3. **First-Load & Dynamic Sizing:**
   - Measures after `document.fonts.ready` to ensure exact font glyph bounding boxes.
   - Initial load places pill with `transition: none` to prevent sliding in from left, enabling smooth transitions on subsequent frames.
   - Dynamically recalculates via `ResizeObserver` on window resize and theme toggling.
4. **Stable Scroll-Spy:**
   - Refined `IntersectionObserver` with `rootMargin: -45% 0px -50% 0px`.
   - Added boundary edge detection: locks "Home" at the top of the page (`scrollY < 80`) and "Contact" at the bottom of the page.
   - Synchronizes `aria-current="page"` and updates the mobile bottom tab bar in parallel.
5. **Accessibility:**
   - Disables transitions when `prefers-reduced-motion` is active.
   - Binds hover interactions only on fine pointer devices (`(hover: hover) and (pointer: fine)`).

---

## 4. GitHub Activity Contribution Graph
- Added native CSS Grid contribution graph for user `shaiiiikh-github` displaying 12-month activity.
- Integrated primary API `https://github-contributions-api.jogruber.de/v4/shaiiiikh-github?y=last` with 60-min `localStorage` cache (`portfolio_github_graph_v1`).
- Added robust fallback cascade: cached data -> live API -> SVG fallback chart (`https://ghchart.rshah.org/shaiiiikh-github`) -> calm error message.
- Implemented single delegated tooltip on the grid with boundary clamping, weekday padding, month labels, and screen reader announcements.
- Updated scroll-spy to map `#github-activity` to `projects` without adding extra navigation items.
- Styled in Liquid Glass design system with dark and light themes, reduced motion and high contrast support.

---

## 5. Minimal Liquid Glass Horizon Footer Redesign
- Streamlined bulky, oversized footer into an ultra-thin, modern Liquid Glass horizon baseboard.
- Replaced 600px vertical block stacking with an edge-to-edge 3-part micro-bar:
  - Left: Micro monospaced branding tag (`SA`) and crisp copyright label (`© 2026 Shabbir • Crafted with precision`).
  - Center: Slim liquid glass visitor counter badge with live pulsating status indicator.
  - Right: Minimalist, accessible touch targets ($\ge 44\text{px}$) for GitHub and LinkedIn.
- Reduced vertical bloat:
  - Desktop height slimmed to ~42px with 10px vertical padding.
  - Mobile padding tightened to 8px top with dedicated clearance for the floating mobile tab bar.
- Implemented specular 0.5px hairline reflection, upward gradient glow, and 24px backdrop blur across dark and light themes.
