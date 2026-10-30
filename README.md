# Mini Game Arcade 🕹️🍉

**Mini Game Arcade** is a modern, high-performance, browser-based gaming platform engineered with **React, Vite, HTML5 Canvas, and the Web Audio API**. 

The flagship game of the platform is **Fruit Slicing**, an action-packed arcade experience with realistic parabolic physics, angle-accurate fruit cleaving, juicy particle splatters, combo multipliers, bomb obstacles, countdown timers, responsive touch controls, and synthesized procedural audio.

---

## 🌟 Key Features

### 1. Advanced Fruit Mechanics & Physics
- **8 Distinct Fruit Types**: Watermelon, Orange, Strawberry, Banana, Apple, Pineapple, Coconut, and the rare golden bonus Dragon Fruit.
- **Procedural Canvas Rendering**: Clean vector rendering with rich layers (outer rind, inner pith, seeds, pulp, citrus segments, and highlights) without external image dependencies.
- **Angle-Accurate Cleaving**: When sliced, fruits split dynamically into two distinct halves along the angle of the blade slash, flinging outward with opposing angular momentum and gravity.
- **Parabolic Trajectory**: Fruits launch upward in natural ballistic arcs with randomized angles and rotational speeds.

### 2. High-Octane Visuals & Particle Engine
- **Neon Blade Trail**: Responsive glowing katana slash trail that smoothly tracks pointer and touch coordinates with gradient glow.
- **Juice Splatter System**: Juicy burst of 20+ droplets per slice, plus persistent semi-transparent splat marks that linger on the wooden dojo cutting board before gradually fading.
- **Screen Shake & Shockwaves**: Detonating a bomb triggers expanding explosive shockwaves and intense screen vibration.
- **Floating Score Popups**: Dynamic animated arcade popups (`+1`, `+3`, `3x COMBO! +15`, `BOMB! -10s`).

### 3. Procedural Web Audio API Synthesizer
- **100% Client-Side & Offline Ready**: No external MP3/WAV files, eliminating 404 errors, network lag, and copyright restrictions.
- **Swoosh Sound**: White noise modulated with resonant bandpass filter and pitch drops.
- **Fruit Splat Sound**: Frequency-modulated organic squishy plops customized for each fruit type.
- **Combo Chimes**: Harmonious pentatonic chords that rise in pitch as combo chains increase.
- **Bomb Hiss & Explosion**: Active spark sizzle and deep sub-bass explosive detonations.
- **Timer Tick & Game Over Fanfare**: Low-time audio warnings and round-end melodies.
- **Mute / Unmute Toggle**: Persisted across browser sessions in `localStorage`.

### 4. Game Modes
1. **Arcade Frenzy (60s Countdown)**:
   - High-intensity 60-second timer challenge.
   - Slice fruits to build score and combos.
   - Slicing a bomb detonates an explosion with a **-10 second penalty** and **-20 points**.
   - Ticking urgency sound activates when time is under 10 seconds.
2. **Zen Sanctuary (90s Tranquility)**:
   - 90 seconds of pure, relaxing fruit slicing with **zero bombs**.
   - Ideal for perfecting combos and setting high scores.
3. **Classic Dojo (3 Lives / Strikes)**:
   - 3 strikes permitted.
   - Dropping an unsliced fruit or slicing a bomb costs a life.
   - 3 strikes ends the match.

### 5. Multi-Device & Mobile-First Design
- **Desktop & Laptop**: Mouse drag/click swipe, keyboard shortcuts (`Space` or `Escape` / `P` to pause/resume).
- **Mobile & Tablet (Android / iOS)**: Fluid touch gestures with `touch-action: none` to completely prevent page scrolling or pull-to-refresh while swiping inside the game arena.
- **Retina / HiDPI Display Scaling**: Automatically adjusts canvas resolution based on `window.devicePixelRatio`.

---

## 📁 Project Structure

```
mini-game-arcade/
├── public/
│   ├── favicon.svg                     # Arcade watermelon slice SVG icon
│   └── site.webmanifest                # Mobile web app manifest
│
├── src/
│   ├── components/
│   │   ├── ArcadeNavbar.jsx            # Platform header with branding, sound toggle & rules
│   │   ├── ArcadeFooter.jsx            # Platform footer with upcoming arcade catalog preview
│   │   └── InstructionsModal.jsx       # Dojo guide modal (controls, combos, fruit values, bombs)
│   │
│   ├── games/
│   │   └── FruitSlicing/
│   │       ├── engine/
│   │       │   ├── BladeTrail.js        # Neon katana trail rendering & velocity calculations
│   │       │   ├── CollisionDetector.js # Line segment to circle intersection detection
│   │       │   ├── FruitEntity.js       # Fruit physics, split halves & procedural vector art
│   │       │   ├── FruitTypes.js        # Fruit configurations, point values, spawn weights
│   │       │   ├── ParticleSystem.js    # Juice sprays, splatters, bomb shockwaves, floating text
│   │       │   └── SoundManager.js      # Web Audio API procedural sound synthesizer
│   │       │
│   │       ├── FruitCanvas.jsx          # 60 FPS HTML5 Canvas lifecycle & pointer gesture handlers
│   │       └── FruitSlicingGame.jsx     # Game coordinator: HUD, timer, scoring, pause & gameover
│   │
│   ├── styles/
│   │   └── main.css                     # Premium dark arcade glassmorphism theme & responsive styles
│   │
│   ├── utils/
│   │   └── storage.js                   # LocalStorage helpers for high scores & sound preferences
│   │
│   ├── App.jsx                          # Main arcade shell component
│   └── main.jsx                         # React 18 DOM mount point
│
├── index.html                           # Optimized HTML shell with arcade typography
├── package.json                         # Project dependencies and build scripts
├── vite.config.js                       # Vite bundler configuration
├── vercel.json                          # Vercel deployment configuration & caching headers
└── README.md                            # Complete documentation
```

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | React 18 |
| **Bundler** | Vite 6 |
| **Rendering** | HTML5 Canvas (Hardware-accelerated 2D Context) |
| **Audio** | Web Audio API (100% Procedural synthesis) |
| **Styling** | Vanilla CSS3 (Custom properties, Glassmorphism, Responsive Grid/Flexbox) |
| **Icons** | Lucide React |
| **VFX** | Canvas Confetti (High-score celebration) |
| **Storage** | LocalStorage API |
| **Deployment Target** | Vercel (Static Site Generation / SPA) |

---

## 🚀 Local Development & Testing Instructions

### Prerequisites
- Node.js (v18 or higher recommended; tested on v26)
- npm (v9 or higher)

### Installation
1. Open a terminal in the project root:
   ```bash
   cd mini-game-arcade
   ```
2. Install project dependencies:
   ```bash
   npm install
   ```

### Running Development Server
Start the local Vite development server:
```bash
npm run dev
```
Open `http://localhost:3000` (or the port displayed in your terminal) in your browser.

### Verifying Production Build
Test the production build locally:
```bash
npm run build
npm run preview
```
Open `http://localhost:4173` to verify the minified, production-ready bundle.

---

## 🚢 Vercel Deployment Instructions

The project is structured to deploy to **Vercel** as a static site without requiring environment variables, serverless functions, or databases.

### Method 1: Deploy via GitHub / GitLab / Bitbucket (Recommended)
1. Push your repository to your Git provider:
   ```bash
   git add .
   git commit -m "feat: complete Fruit Slicing game for Mini Game Arcade"
   git push origin main
   ```
2. Go to [vercel.com](https://vercel.com) and log in.
3. Click **"Add New..."** > **"Project"**.
4. Import the `mini-game-arcade` repository.
5. Vercel automatically detects the **Vite** framework preset with the following defaults:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
6. Click **Deploy**. Your game will be live within seconds!

### Method 2: Deploy via Vercel CLI
If you have the Vercel CLI installed globally:
```bash
npm install -g vercel
vercel
```
Follow the interactive prompts (select default settings). To deploy to production:
```bash
vercel --prod
```

### Vercel Configuration Included (`vercel.json`)
The project includes a pre-configured `vercel.json` file providing:
- **Clean URLs**: Automatically rewrites routes to `index.html`.
- **Immutable Asset Caching**: 1-year public cache-control headers for `/assets/*` bundles to ensure lightning-fast subsequent page loads.

---

## 🧪 QA Testing Checklist

| Feature | Test Case | Status |
|---|---|---|
| **Canvas Slicing** | Swipe across flying fruits with mouse or touch | Passed ✅ |
| **Fruit Splitting** | Fruits split cleanly into 2 halves along the slice angle | Passed ✅ |
| **Combos** | Slicing 3+ fruits in one swipe triggers combo bonus and floating notification | Passed ✅ |
| **Bombs** | Slicing bomb detonates explosion, -10s penalty, -20 pts, and screen shake | Passed ✅ |
| **Countdown Timer** | Accurately counts down from 60s; triggers Game Over at 0s | Passed ✅ |
| **Sound Synthesizer** | Web Audio API swoosh, splat, combo, explosion, tick, and game over sounds | Passed ✅ |
| **Sound Mute Toggle** | Mute button toggles all audio; state persisted in `localStorage` | Passed ✅ |
| **High Score Persistence** | Personal best score tracks in `localStorage` across restarts and page reloads | Passed ✅ |
| **Mobile Gestures** | Swiping inside game arena prevents accidental page scrolling or pull-to-refresh | Passed ✅ |
| **Pause & Resume** | Pauses fruit physics, timers, and spawner; resumes cleanly | Passed ✅ |
| **Restart Game** | Resets score, timer, strikes, canvas entities, and begins new round | Passed ✅ |
| **Production Build** | `npm run build` compiles with 0 errors, 0 warnings, minified output | Passed ✅ |

---

## 📄 License
MIT License. Created for the **Mini Game Arcade** platform.
