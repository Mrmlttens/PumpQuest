# PumpQuest

**Train in real life. See it on your character.**

PumpQuest is a free, mobile-first, offline-capable workout logger with a playful, original cartoon RPG character. Your completed workout lights up the muscles you trained, activates a temporary 24-hour *pump*, awards XP, and unlocks cosmetic equipment.

![PumpQuest](./assets/icon-192.png)

## Version 0.1 (playable prototype)

- Animated original **Blob Bruiser**, **Shell Titan**, and **Kaiju Brute** character archetypes.
- Glowing muscle hotspots based on completed sets in the last 24 hours; preview mode is visual only.
- Starter four-day **Push / Pull / Legs / Upper** routine templates.
- Create, edit, delete and save custom splits, including set count, rep range and rest intervals.
- Offline exercise library with 80 movements, muscle search/filter and custom exercises.
- Active workout screen: sets, weight, reps, previous set reference, completed-set control and rest timer.
- XP, progression, 24-hour pump, session history, weekly activity and level-based cosmetic unlocks.
- Full data export as **JSON** and set-by-set **CSV**; restore from JSON.
- No login, no ads, no paid APIs, no tracking, no external JavaScript libraries.

## Try it locally

Open `index.html` in a browser. For installability/service worker, serve the folder over HTTP:

```bash
python3 -m http.server 8000
```

Go to `http://localhost:8000/`. On Android, visit the HTTPS GitHub Pages site in Chrome and use the browser menu **Add to Home screen** / **Install app** if available.

## Publish it on GitHub Pages (free)

1. Create a **public** repository named `PumpQuest` on GitHub, with no initial README, `.gitignore` or license.
2. Upload or push the contents of this folder to the repository's `main` branch, **including** `.github/workflows/pages.yml` and `.nojekyll`.
3. In the repository go to **Settings → Pages → Build and deployment → GitHub Actions** (once the repository has the files).
4. GitHub Actions deploys to `https://YOUR_USERNAME.github.io/PumpQuest/`.

Run `node tests/smoke.js` to check the basic workout, XP, and character flows.

No billing, database or server configuration is needed. GitHub Actions/Pages availability depends on the repository and account settings.

## Data and privacy

**Local-only storage:** Workout logs, routines, character options, and XP live in the browser's `localStorage` on the device. They **do not sync** across devices. Clearing browser/site data or switching browsers can erase them. Use **Stats → JSON Backup** regularly. JSON import replaces the current local data after confirmation. Do not store medical information in this prototype.

A session must have at least one checked set with a valid weight and rep value to earn XP. The pump is a visual approximation from logged muscle-group sets, not a physiological measurement or recovery recommendation. Progression is not tied to lifting extremely heavy weights.

## Next iterations

1. Improve set UX: warm-ups, dropsets, supersets, set deletion, per-exercise defaults and full rest-timer controls.
2. PR detail, per-exercise charts, weekly body balance heat map, true progressive-overload statistics.
3. More original 2D animated characters, more dramatic daily muscle swelling, rarity gear, themes and effects.
4. Optional passwordless multi-device sync (would require a backend or paid/free hosted quota).
5. Accessibility, localization, automated tests and cross-browser behavior.

## Repo layout

- `index.html` — app shell
- `styles.css` — responsive UI, animations and neon character stage
- `data.js` — offline exercise database, starter routines and loot
- `app.js` — workouts, routines, local saves, XP, character SVG and navigation
- `manifest.webmanifest`, `sw.js` — installable offline PWA support
- `assets/` — app icon assets
- `.github/workflows/pages.yml` — GitHub Pages deployment

## License

MIT — see [LICENSE](LICENSE). Original character designs; no third-party game character artwork or assets included.