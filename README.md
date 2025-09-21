# Branding Package Generator

Generate deterministic, WCAG-compliant brand starter kits from a single industry prompt. This project fulfills the requirements in `features.txt` by shipping a self-contained Node + React application that runs on a basic VPS.

## Stack

- **Server**: Node 20, Express 4, Zod validation, seeded palette engine, Archiver-based export pipeline.
- **Client**: React 18 with Vite, TypeScript, custom UI for form entry and live preview.
- **Utilities**: Deterministic Mulberry32 RNG, WCAG contrast + color blindness checks, PNG/SVG export helpers.

## Getting Started

```bash
# Install dependencies
npm install

# Start development server (runs API on 4000, Vite on 5173 with proxy)
npm run dev

# Run palette unit tests
npm run test --workspace server

# Build client assets into server/public
npm run build

# Launch production server
npm start
```

## Key Features

- Three deterministic palette options derived from industry + tone + seed inputs.
- WCAG 2.2 AA contrast enforcement for text, buttons, and neutral surfaces.
- Color blindness simulation safeguards primary vs accent distinguishability.
- Typeface, icon style, imagery direction, and logo prompt suggestions per palette.
- Export ZIP containing JSON tokens, CSS/SCSS variables, Tailwind snippet, SVG + PNG swatches, GPL palette, and README.
- Session persistence for export convenience (stored in `server/tmp`).
- Optional business context influence guarded behind explicit toggle.

## Testing Matrix

- `server/test/palette.test.js` validates seed determinism, context isolation, and dark theme compliance.

## Accessibility Notes

- Contrast thresholds enforced via utility functions, guaranteeing 4.5:1 for body text and buttons, 3:1 for headings.
- Preview surface toggle allows light/dark inspection without mutating generated tokens.

## Determinism

The palette engine uses a Mulberry32 RNG seeded from numeric or string seeds. Providing the same industry, tone, theme preference, and seed reproduces identical palettes and export artifacts.

## Exports

Generated archives include:

- `palette.json`
- `tokens.css`
- `tokens.scss`
- `tailwind.config.snippet.js`
- `swatches.svg`
- `swatches.png`
- `palette.gpl`
- `readme.txt`

All font references rely on Google Fonts with OFL licensing.
