# Project: DYELE (Wordle-style deduction game for food dyes)

## Goal
Build a simple daily, replayable web game where the player guesses a mystery synthetic food dye using attribute-based feedback (Wordle-style). No backend required for v0.

---

## Core Gameplay Requirements (MVP)

### Game Loop
- The game selects a single **mystery dye** from a fixed dataset.
- The player has **6 attempts** to guess the dye.
- Each guess is selected from a list of dyes (dropdown/autocomplete).
- After each guess, the app displays feedback across multiple attributes (like Wordle tiles).
- Game ends on:
  - Win: guessed dye matches mystery dye
  - Loss: player uses all attempts

### Attributes (v0)
Provide feedback for these attributes per guess:

1) **Color Family**
- Values: `red | yellow | blue | green | other`
- Feedback:
  - `match` if same family
  - `no-match` otherwise

2) **Usage Tier**
- Values: `high | medium | low`
- Feedback:
  - `match` if equal
  - `higher` if guess usage tier is lower than target
  - `lower` if guess usage tier is higher than target

3) **Risk Flag**
- Values: `none | caution | high`
- Feedback:
  - same comparison rules as usage (`match/higher/lower`)

4) **Regulatory Status**
- Values: `allowed | warning | restricted | banned`
- Feedback:
  - `match` if equal
  - `stricter` / `looser` relative direction vs target

5) **Common Food Category**
- Values: `candy | beverages | cereal | snacks | baked | dairy | mixed`
- Feedback:
  - `match` if category overlaps
  - `partial` if one is `mixed`
  - `no-match` otherwise

### Attempts UI
- Show 6 rows for guesses.
- Each row shows:
  - guessed dye name
  - 5 attribute feedback tiles

### Daily Mode + Free Play
- Default: **Daily** game.
- Optional button: **Practice** (random seed each play).

Daily requirements:
- Daily puzzle deterministic based on local date (America/Chicago).
- If the player reloads, the same day’s puzzle + progress should persist.

Persistence requirements:
- Store progress in `localStorage` keyed by `YYYY-MM-DD`.
- If the player finishes, lock the day and show results screen.

### Results Screen
- Show: Win/Loss, attempts used, the correct dye.
- Provide a "Share" button:
  - Copies a text block to clipboard with a small emoji grid representing feedback (Wordle style).
  - Example:
    - 🟩 = match
    - 🟨 = partial / direction hint
    - ⬜ = no match
- Show: "Next puzzle in: HH:MM:SS" countdown to midnight local time.

---

## Data Requirements

### Data File
- Create `src/data/dyes.json` holding dye list + attributes.
- Keep dataset small for MVP (8–12 dyes).
- Each dye object:
  - `id`: string (e.g., "red-40")
  - `displayName`: string (e.g., "Red 40")
  - `codeName`: optional string (e.g., "Allura Red AC")
  - `colorFamily`: enum
  - `usageTier`: enum
  - `riskFlag`: enum
  - `regulatoryStatus`: enum
  - `commonCategories`: array of enums
  - `facts`: array of strings (used for learn-more panel)
  - `sources`: array of strings (citation-like URLs or section notes)

NOTE: We do NOT need perfect scientific scoring; we need consistent categorization so the game is fun. Keep it defensible and documented in `facts`.

---

## Deterministic Daily Seed (No Backend)

Daily selection algorithm:
- Compute `dateKey` in America/Chicago, format `YYYY-MM-DD`.
- Derive an integer seed from `dateKey` (simple hash).
- Select dye index = `seed % dyes.length`.

Practice mode:
- Seed from `crypto.getRandomValues` or `Date.now()`.

---

## Tech Stack

### Frontend
- Vite + React + TypeScript
- Styling: Tailwind CSS (simple)
- State: local React state + localStorage persistence

### Suggested Libraries (optional)
- `clsx` or `classnames` for conditional classes
- No heavy state libraries needed
- No backend / no auth for v0

---

## Pages / Components

### Screens
1) Home/Game Screen
- Title
- Guess input (dropdown/autocomplete)
- Submit button
- Guess grid (6 rows)
- Footer: daily countdown + practice button

2) Results Modal / Screen
- Status + attempt count
- Correct dye details (facts)
- Share button
- "Play practice" button

### Core Components
- `GuessInput`
- `GuessRow`
- `AttributeTile`
- `ResultsModal`
- `Countdown`

---

## Logic / Functions

### Core types
- `Dye`
- `Guess` (dyeId + feedback)
- `Feedback` per attribute: `match | partial | no-match | higher | lower | stricter | looser`

### Required functions
- `getChicagoDateKey(): string`
- `hashStringToInt(s: string): number`
- `selectDailyDye(dyes, dateKey): Dye`
- `compareGuessToTarget(guessDye, targetDye): Feedback[]`
- `formatShareGrid(guesses): string`
- `loadGameState(dateKey): GameState | null`
- `saveGameState(dateKey, state): void`

---

## UX Requirements (Keep It Simple)
- Mobile-first layout.
- Accessible buttons.
- Clear legend for tile meanings.
- Error handling:
  - prevent duplicate guess submission in same row
  - prevent submitting empty guess
- Nice-to-have:
  - keyboard support: Enter submits

---

## Non-Goals for v0
- Multiplayer
- Accounts / backend
- Large dataset scraping
- Perfect scientific risk scoring

---

## Stretch Goals (v0.2+)
- Difficulty modes (hide 1 attribute / hard mode)
- "Learn mode": after each guess show 1 short fact
- Daily history page (calendar)
- More dyes + natural alternatives expansion pack
- Shareable URL with a seed for practice rounds

---

## Deliverables
- Vite React TS project
- Working daily mode
- Working practice mode
- LocalStorage persistence
- Share-to-clipboard summary
- `README.md` with run instructions + data disclaimers

---

## Dye categories
- risks?
- solubility?
- consumable? (once it's more than food dyes)
- toxicity
- FDA/Goc approved?
