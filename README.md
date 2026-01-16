# DYELE

A Wordle-style deduction game for synthetic food dyes. Guess the daily mystery dye in six tries by comparing attribute tiles.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Data disclaimer
The dye dataset is intentionally small and simplified for gameplay. Attributes are meant to be consistent and defensible, not a scientific or regulatory reference. Always consult official sources when making health or safety decisions.

## Admin console helpers
In the browser DevTools console, you can reset progress while testing:

```js
window.__dyeleAdmin.resetDaily()
window.__dyeleAdmin.resetPractice()
window.__dyeleAdmin.seedHistory(7)
```
