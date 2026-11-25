# Shabbir's Portfolio - Comprehensive Project & Architecture Specification

> **Purpose of this document:**  
> This file is the single source of truth for AI assistants, engineers, and maintainers. It explains the entire architecture, design system, component hierarchy, file layout, and engineering constraints so any AI can understand, debug, extend, or review the project with zero prior context.

---

## 1. Executive Summary & Identity

* **Owner:** Shabbir (Software Developer & Machine Learning Enthusiast)
* **Project Type:** Modern, responsive personal developer portfolio website
* **Core Design Philosophy:** Native **Apple Human Interface Guidelines (HIG)** inspired by **iOS 18 / visionOS**
* **Technical Paradigm:** Pure standard web technologies (**HTML5**, **CSS3**, **vanilla ES6+ JavaScript**). No frameworks (no React, Vue, Angular), no bundlers (no Webpack, Vite), no preprocessors (no Sass, Tailwind), and zero build steps.
* **Deployment Target:** Static hosting platforms such as **GitHub Pages**, **Vercel**, or **Netlify** (runs on Linux environments where file paths are **strictly case-sensitive**).

---

## 2. Directory Structure & File Inventory

```text
Portfolio/
├── index.html                 # Main entry point: semantic HTML5 markup, accessibility, meta tags
├── style.css                  # Complete design system: mobile-first CSS3, design tokens, HIG glassmorphism
├── script.js                  # Vanilla interaction engine: theme, nav indicator, modal sheet, form, counter
├── files/
│   └── Shabbir_resume.pdf     # Resume PDF (IMPORTANT: capital 'S' - must match case in Linux hosting)
├── assets/
│   ├── favicon.png            # 64x64 PNG browser favicon
│   ├── apple-touch-icon.png   # 180x180 PNG iOS home screen icon
│   ├── shabbir.webp           # Optimized square profile image (< 100 KB, 600x600)
│   ├── shabbir.jpg            # Optimized JPG fallback (< 100 KB, 600x600)
│   ├── crop.webp / .png       # Crop Recommendation System preview (< 15 KB WebP, 800x417)
│   ├── qr.webp / .png         # QR Code Generator preview (< 5 KB WebP, 800x400)
│   ├── pixel_np.webp / .png   # Pixel Cloud Notepad preview (< 5 KB WebP, 800x360)
│   ├── clipboard_logger.webp  # Clipboard Logger preview (< 16 KB WebP, 800x533)
│   ├── game.webp / .png       # Memory Matching Game preview (< 7 KB WebP, 800x469)
│   ├── Fake.webp / .png       # Fake Instagram Account Detection preview (< 15 KB WebP, 800x535)
│   ├── SmartAgro.webp / .png  # Smart Agro-Solar System preview (< 19 KB WebP, 800x412)
│   ├── Intellu.webp / .png    # IntelliHelp AI preview (< 16 KB WebP, 800x390)
│   ├── suraksha.webp / .png   # Suraksha Yatra preview (< 14 KB WebP, 800x390)
│   ├── github.png             # Social icon (GitHub)
│   ├── linkedin.png           # Social icon (LinkedIn)
│   ├── gmail.png              # Social icon (Email)
│   ├── insta.png              # Social icon (Instagram)
│   └── original/              # Backup of original uncompressed heavy assets (> 7 MB)
├── backup-original/           # Backup of pre-redesign index.html, style.css, and script.js
├── screenshots/               # Verified multi-viewport test screenshots (375px, 430px, 768px, 1440px)
├── CHANGELOG.md               # Detailed log of design migrations, bug fixes, and verification results
└── PROJECT_OVERVIEW.md        # This specification document for AI & developers
```

---

## 3. Design System & Apple HIG Aesthetics

### 3.1 Color Tokens & Theming
The site features dynamic theme switching between **iOS Dark Mode** (default) and **iOS Light Mode** using CSS Custom Properties:

| Token | Dark Mode (`:root`) | Light Mode (`body.light-mode`) | Purpose |
| :--- | :--- | :--- | :--- |
| `--bg-primary` | `#000000` (Pure Black) | `#F2F2F7` (System Gray 6) | Page background |
| `--bg-secondary` | `#1C1C1E` | `#FFFFFF` | Form inputs, chips, secondary surfaces |
| `--bg-tertiary` | `#2C2C2E` | `#E5E5EA` | Icon boxes, subtle card borders |
| `--glass-bg` | `rgba(22, 22, 24, 0.76)` | `rgba(246, 246, 248, 0.82)` | Floating header, tab bar, cards |
| `--glass-sheet` | `rgba(30, 30, 32, 0.92)` | `rgba(255, 255, 255, 0.95)` | Modal bottom sheet |
| `--label-primary` | `#FFFFFF` | `#000000` | High-contrast headings and body text |
| `--label-secondary` | `rgba(235, 235, 245, 0.65)` | `rgba(60, 60, 67, 0.68)` | Subtitles, descriptions, captions |
| `--accent` | `#0A84FF` (System Blue Dark) | `#007AFF` (System Blue Light) | Primary buttons, active tabs, links |
| `--accent-gradient` | Blue &rarr; Purple &rarr; Pink | Blue &rarr; Purple &rarr; Pink | Hero name title, developer logo |
| `--nav-indicator-bg`| `rgba(255, 255, 255, 0.16)` | `#FFFFFF` | Desktop cursor highlight pill |

### 3.2 Materials & Glassmorphism
* **Translucent Blur:** `backdrop-filter: blur(24px) saturate(180%)` with `-webkit-backdrop-filter` prefix.
* **Hairline Borders:** `0.5px solid var(--hairline)` replicating Apple's retina borders.
* **Continuous Curvature:** Cards use `24px - 28px` corner radius; buttons, chips, and nav items use pill curvature (`9999px`).
* **Haptic Active Feedback:** All interactive cards, buttons, and tiles scale to `0.97` or `0.92` on `:active` press.

---

## 4. Key Sections & Architecture Breakdown

### 4.1 Header & Dual Navigation System
* **Desktop (>= 768px):**
  - Inset floating glass bar centered at top.
  - Features the animated developer logo `<Shabbir/>` on the left, an SF Symbol theme switch on the right, and the desktop nav in the center (`grid-template-columns: 1fr auto 1fr`).
  - **Sliding Highlight Pill (`#nav-indicator`):** Positioned inside `ul#nav-links`. Measured with sub-pixel precision using `getBoundingClientRect()` relative to the `<ul>` container. Glides smoothly (`300ms cubic-bezier(0.2, 0.8, 0.2, 1)`) under hovered and keyboard-focused (`:focus-visible`) links. On `mouseleave` or blur, glides back to the active section item. Initialized after `document.fonts.ready` without initial transition flash.
* **Mobile (<= 768px):**
  - Desktop nav is hidden (`display: none`).
  - Replaced by a **fixed bottom floating glass tab bar** with 5 items (Home, Skills, Projects, Timeline, Contact) styled with SF Symbols-style SVG icons and 10px labels, respecting `env(safe-area-inset-bottom)`.
* **Scroll-Spy:**
  - Powered by `IntersectionObserver` with `rootMargin: "-45% 0px -50% 0px"`.
  - Includes boundary edge detection: locks "Home" active when `window.scrollY < 80` and locks "Contact" active when scrolled to the very bottom.
  - Updates both desktop nav and mobile tab bar in sync, setting `aria-current="page"`.

### 4.2 Hero Section (`#hero`)
* Large iOS title greeting (`clamp(2.8rem, 9vw, 4.8rem)`) with gradient text.
* Typing subtitle cycle: *"Full-Stack Web Developer"*, *"Machine Learning Enthusiast"*, *"Creative Problem Solver"*, *"Tech Explorer"*.
* Respects `prefers-reduced-motion` by displaying static title text if user prefers reduced motion.
* Profile image in circular frame with non-clipped radial glow pulse. Features 3D pointer tilt on desktop fine-pointer devices.
* Rounded-square app-icon tiles for social links: GitHub, LinkedIn, Email, Instagram.
* Two pill CTA buttons: "View Resume" (`.btn-outline`) and "View My Work" (`.btn-primary`).

### 4.3 Skills Section (`#skills`)
* Formatted as an **iOS Settings-style Bento Widget Grid** with color-coded SF Symbol badges:
  1. **Frontend Engineering** (Blue Badge): HTML5, CSS3, JavaScript (ES6+), React.
  2. **Backend & APIs** (Green Badge): Python, Node.js, Flask, MySQL.
  3. **AI & Machine Learning** (Purple Badge): Machine Learning, scikit-learn, NLP, Data Modeling.
  4. **Hardware & Tools** (Orange Badge): Arduino / IoT, Git & GitHub, REST APIs, Linux Shell.

### 4.4 Featured Projects (`#projects`)
* **Segmented Filter Control:** All, Web, ML & AI, IoT, Tools (`data-category` attribute).
* **App Store Cards:** 16:9 picture with gradient overlay, title, 3-line clamped description (`-webkit-line-clamp: 3`), pill action button, and tag chips.
* **Interactive Modal Sheet (`#project-sheet`):**
  - Tapping a project card opens an iOS sheet (bottom sheet with grabber handle on mobile, centered visionOS-style glass dialog on desktop).
  - Displays full description, technology tags, and direct launch button.
  - Supports dismissal via **Escape key**, **outside backdrop tap**, **close button**, or **touch swipe-down gesture** (touch drag threshold > 120px).
  - Locks background scroll (`document.body.style.overflow = "hidden"`) and traps keyboard focus with proper `aria-modal="true"`.
* **Projects Inventory:**
  1. *Crop Recommendation System* (ML & AI, Python, Agriculture) &rarr; GitHub
  2. *QR Code Generator* (Web, Flask, Python) &rarr; Render Live App
  3. *Pixel Cloud Notepad* (Web, Cloud Sync, JavaScript) &rarr; Render Live App
  4. *Clipboard Logger* (Tools, Python Automation) &rarr; GitHub
  5. *Memory Matching Game* (Web Game, Vanilla JS) &rarr; Render Live App
  6. *Fake Instagram Account Detection* (ML & AI, KNN, Classification) &rarr; GitHub
  7. *Smart Agro-Solar System* (IoT & Hardware, Solar Optimization) &rarr; GitHub
  8. *IntelliHelp AI* (AI & NLP, Document QA) &rarr; GitHub
  9. *Suraksha Yatra* (Web & IoT, Geolocation & Safety) &rarr; GitHub

### 4.5 Timeline & Milestones (`#timeline`)
* Grouped vertical timeline with **sticky glass year pills** (`2025`, `2024`, `2023`, `2022`, `2019`).
* Cards feature category badge icons:
  - Gold Trophy: Hackathon participations & wins (Smart India Hackathon, Hackout'24, TicTechToe, CVMU Hackathon 2.0).
  - Orange Wrench: Hardware & IoT projects (Smart Dustbin, Bluetooth Car, Clipboard Logger).
  - Blue/Purple Code: Web apps & software tools (Talk-Edge, Pixel Notepad, QR Manager, Matching Game).

### 4.6 Contact Section (`#contact`)
* Inset-grouped form with floating labels.
* Inputs configure `type`, `inputmode="email"`, `autocomplete`, `enterkeyhint`, and a **minimum font size of 16px** to prevent iOS Safari auto-zoom on focus.
* Integrated with Formspree endpoint (`https://formspree.io/f/xgvarvzp`).
* Async submission with `try/catch/finally`: disables submit button, renders an inline spinning indicator, and displays feedback as a floating **iOS capsule Toast notification**.

### 4.7 Footer & Utilities
* Visitor Counter: Queries live visitor badge endpoint (`https://api.visitorbadge.io/api/visitors?path=shaiiiikh-github.portfolio`). Uses a single, transparent fetch without session gating or hardcoded baselines. Falls back cleanly to "Unavailable" on network/adblock failure.
* Back-to-Top Button (`#backToTopBtn`): Floating circular glass button located above the bottom tab bar on mobile (`bottom: calc(env(safe-area-inset-bottom) + 74px)`) and bottom-right on desktop. Appears after scrolling 300px.

### 4.8 Spotify Now Playing Dynamic Island Widget
* Markup: `#spotify-widget` located in the hero profile card with `#spotify-art`, `#spotify-status-label`, `#spotify-title`, `#spotify-artist`, and animated sound equalizer bars (`#spotify-eq`).
* Integration: Driven by Lanyard REST API (`https://api.lanyard.rest/v1/users/{DISCORD_USER_ID}`). Requires zero server credentials, API keys, client secrets, or refresh tokens in frontend code.
* Lifecycle & Resilience:
  - Polling interval: 20 seconds.
  - Lifecycle management: Automatically pauses polling via `document.addEventListener("visibilitychange")` when the tab is hidden or backgrounded, eliminating unnecessary background network traffic.
  - AbortController: 8-second request timeout guards against slow networks or hanging requests.
  - Fallback state: When offline or paused, displays a calm "Not listening right now" fallback with track title, artist, and album art, avoiding blank UI states or raw error messages.
  - Accessibility: Respects `prefers-reduced-motion` by disabling equalizer bouncing animations and vinyl spin, and supports screen readers with `aria-live="polite"`.

---

## 5. Critical Engineering Rules for Future AI Agents

Any AI modifying or extending this repository **MUST** adhere to these rules:

1. **NO Build Step:** Never introduce npm dependencies, package.json scripts, webpack, vite, or bundlers. The repository must run immediately by opening `index.html` in any browser.
2. **Case Sensitivity:** File names are hosted on Linux (GitHub Pages/Vercel). Never rename or change the case of links (e.g., `files/Shabbir_resume.pdf` has a capital `S`; `suraksha.webp` is lowercase).
3. **Preserve IDs:** Essential JavaScript selectors must not be broken:
   - `#theme-toggle`, `#typing-text`, `#nav-links`, `#nav-indicator`, `.desktop-nav`, `.nav-item`
   - `.contact-form`, `#form-status`, `#ios-toast`, `#project-sheet`
   - `#visit-count`, `#backToTopBtn`
4. **Mobile-First CSS Architecture:**
   - Base styles in `style.css` apply to mobile (< 768px).
   - Desktop and tablet rules are added using ascending media queries (`@media (min-width: 768px)`, `@media (min-width: 1024px)`, `@media (min-width: 1280px)`).
   - Keep exactly one definition per selector. Do not scatter media queries throughout the file.
5. **Accessibility (WCAG AA):**
   - Keep minimum tap targets >= 44x44px.
   - All icon-only buttons/links must have `aria-label`.
   - Modals must manage focus, `aria-modal="true"`, `aria-hidden`, and support `Escape`.
   - Always respect `@media (prefers-reduced-motion: reduce)`.
6. **Git Protection:**
   - Do **NOT** commit, push, tag, or alter remote Git branches unless explicitly ordered by the user. Keep changes uncommitted in the working tree for user review.

---

## 6. How to Run & Verify Locally

1. **Direct Browser Open:**  
   Open `index.html` in Chrome, Safari, Edge, or Firefox.
2. **Local HTTP Server (Optional):**  
   Run in PowerShell / Terminal:
   ```bash
   python -m http.server 8000
   ```
   Navigate to `http://localhost:8000`.
3. **Responsive Verification:**  
   Check viewports at 375×812 (iPhone), 430×932 (iPhone Max), 768×1024 (iPad), and 1440×900 (Desktop) in both Dark and Light themes.
