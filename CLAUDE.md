# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Typing Speed Racer** — a single-file browser game that teaches faster typing by racing the player against three AI bots. Words advance only when typed perfectly; bots advance at a fixed chars/sec tuned per difficulty.

## Running

There is no build step, no package manager, no test runner. The entire app is `index.html`.

- **Play:** open `index.html` directly in a modern browser (Chrome/Edge/Firefox). No server needed.
- **Iterate:** edit `index.html` and hard-reload the browser. No HMR.
- **Reset persistent state during development:** in DevTools → Application → Local Storage, delete the `typingRacer.v1` key (or `localStorage.clear()` in the console).

## Architecture

Everything lives in `index.html`: one `<style>` block, three `<section>` screens, one `<script>` block. No dependencies, no modules.

### Screen state machine
A single `<main data-screen="...">` attribute switches between `start` and `race`. The results view is a **modal overlay** (`#results-modal`) rendered on top of the start screen — finishing a race always returns the player to the dashboard with refreshed stats behind the popup. There is no `data-screen="results"` state.

### Game loop (`tick`)
- Driven by `requestAnimationFrame`.
- Each frame: advance bot character counts by `cps * dt * jitter`, reposition all four cars via `setCarPositions`, update HUD via `updateRaceStats`, then check if anyone crossed `TOTAL_CHARS_TARGET`.
- Player progress is **only** mutated by the keyboard handler — never the tick. The tick is read-only against `game.correctChars`.

### Input model — strict typing discipline
The keydown handler on `#hidden` enforces the pedagogy:
- Accuracy is measured **per keystroke** (`totalKeys` vs `correctChars`), not per word.
- Words advance to the next only when `game.typed === word` and Space is pressed. Partial credit is intentionally not supported.
- Backspace lets you fix mistakes but **does not refund** the accuracy hit.
- When `typed.length >= word.length`, further character keys are rejected (counted as miskeys with shake/sound) — this prevents wrong characters piling up invisibly past the word and locking the player when they mistype a 1-character word like `I`. The cursor at the trailing position (`.cursor-tail`) tells the player to backspace.

### Finish line is dynamic
`TOTAL_CHARS_TARGET` is **recomputed in `buildWords`** as the sum of all word lengths in the race. It is not a fixed constant — short word pools (Easy) would otherwise have a finish line the player could never reach. Any code that compares against `TOTAL_CHARS_TARGET` assumes `buildWords` has run.

### Persistence (`Storage`)
- Single `localStorage` key: `typingRacer.v1` (versioned — bump the suffix if the shape changes).
- `Storage.load()` merges saved data over defaults, so adding a new field is backward-compatible.
- `Storage.recordRun` is the **only** writer. It updates bests, appends to a rolling 20-run history (used for both the sparkline and the avg WPM/accuracy cards), unlocks Insane difficulty on a Hard win, and bumps the daily streak using ISO date comparison.
- The dashboard's "Average WPM/Accuracy" cards are computed from `d.history` at render time — they are not stored fields.

### Audio
Pure WebAudio oscillators — no audio assets. Wrapped in try/catch so a denied AudioContext (autoplay policies) never breaks gameplay. The context is lazy-created on first sound.

### Confetti
Single full-viewport `<canvas id="confetti">` overlaid via `position: fixed`. Particles share one global array and a self-rescheduling RAF loop guarded by `fireConfetti.running` so multiple wins don't spawn parallel loops.

## Conventions worth preserving

- **No dependencies.** Stay vanilla JS / vanilla CSS. The whole appeal is double-click-to-play.
- **No build pipeline.** Don't introduce bundlers, npm, or external CSS frameworks.
- **Theme colors live in `:root` CSS variables** (`--cyan`, `--magenta`, `--lime`, `--amber`, `--red`). Reuse them instead of hard-coding hex values.
- **Bump `Storage.KEY` (e.g. `v1` → `v2`) on breaking shape changes** so old saves don't crash the loader.
- **WPM uses the standard formula:** `(correctChars / 5) / (elapsed_minutes)`. Don't switch to a per-word definition — it would inflate scores against accepted typing benchmarks.
