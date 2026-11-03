# PumpQuest v1.2 — Illustrated Anatomy Edition

## Main change

The home screen is now a **single, portrait-format cinematic fantasy character** with a tappable anatomy map rendered on the artwork. This replaces the low-detail procedural 3D Stormhorn as the default visual experience.

- Stormhorn uses original detailed front- and rear-facing character illustrations (WebP, bundled and offline-capable).
- 19 tracked muscle regions have calibrated hit-zone overlays; tap a region to see its last logged training recency.
- Red: 0–1 days; amber: 2–6 days; neutral: 7–13 days; cyan: 14+ days; no data: barely outlined and **not** incorrectly called cold.
- **FRONT/BACK** buttons, color legend, and an explicitly labeled visual demo for new users.
- Eye glimmers and subtle floating particles, without animation of clickable anatomy coordinates.
- A compact mobile UI with six circular action shortcuts and a single large Start Workout button. All logging, routine creation, rest timers, XP, gear, history, and backups remain accessible in slide-up panels.
- The old Abyss Warden and Cinder Drake 3D characters remain selectable under Gear until dedicated cinematic illustrations are available. Their model quality differs from illustrated Stormhorn.

## Data and safety

Save key and JSON export format are unchanged (`pumpquest.save.v1`). Do not uninstall previous Android APK before exporting JSON. Browser web-app storage and Android app storage are separate, with manual export/import.

These region colors indicate **recorded exercise activity**, not medical readiness or tissue recovery. Cold means the logging system has not recorded stimulation for 14+ days, not that users should automatically train that muscle.

## Testing

- Node: `node tests/smoke.js`, `node tests/anatomy.js`, `node tests/artmap.js`, `node tests/characters.js`, `node tests/importer.js`
- Mobile Chromium viewport: 390 × 844, front/back switching, tap-target hit, demo heatmap, routine selection, set completion, XP award and on-art hot-region display passed.
- Native APK compilation is separately handled by GitHub Actions; a successful compile is **not** a substitute for Android device QA.