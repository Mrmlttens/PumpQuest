# PumpQuest — Illustrated Anatomy Edition v1.2

A cinematic, Android-first workout tracker built around a **full-screen illustrated champion with real training-recency highlights directly on the body**. The underlying workout engine remains the same offline-first engine from Champion Edition 1.0.

### New home screen

- One-screen hero with radial Workout, Splits, History, Gear, Muscles and Progress controls.
- Tap painted anatomy regions to see how many days since you logged that muscle.
- Flip the illustration front/back. 19 regions are mapped across both orientations.
- Red = 0–1 days, amber = 2–6, neutral = 7–13, cyan = 14+ days since logged training. Never-trained areas show no data, not cold.
- An explicit DEMO mode previews hot/cold effects without creating workout records or XP.
- Stormhorn now has illustrated front/back art with subtle glimmers and particles. The other two original 3D heroes stay available from Gear while their cinematic 2D artwork is produced.

### Try it

Web test build: https://mrmlttens.github.io/the-oddsfathers/pumpquest/ (existing dedicated hosting route)

On Chrome Android, visit the live URL, then use the browser's **Add to Home screen** option. Download an APK from GitHub Actions only after a successful Android run; export JSON first if already using an older debug APK.

The 1.2 build uses the original local save schema so logged sessions, splits, levels, history and XP carry over in the same browser origin.

See [RELEASE_NOTES.md](RELEASE_NOTES.md) for exact changes and known limitations.

---

# PumpQuest — Cinematic Engine 1.1 preview

This is a *visual-engine preview*, not a promise that its procedural characters now match the approved cinematic concept art. The art production gap is documented in `ART_PIPELINE.md`.

**New in v1.1:** Continuous sculpted-body mesh (7,070 vertices / 14,136 triangles), filmic shading and procedural material detail, enhanced sky atmosphere, selectable Cinematic/Balanced rendering modes, 3D muscle hot/cold overlays, existing three selectable creatures, equipable 3D cosmetics, small idle movement, rest timers, saved splits, Hevy CSV import, and fully local data export.

**Do not uninstall an existing debug APK before exporting a JSON backup.** APK debug builds from different GitHub Actions runners may be signed with different keys, so an upgrade can require uninstalling the existing app and restoring exported data. For art reviews, use the web build instead of changing the installed APK.

# PumpQuest — Champion Edition 1.0

**Train in real life. See it on your character.**

A free, offline-first workout tracker with a full-screen, touch-rotatable fantasy champion. Built for Android. No account, advertising, subscriptions or external analytics.

## What works

- Three original interactive WebGL 3D champions: **Stormhorn** (storm titan), **Abyss Warden** (turtle tank), **Cinder Drake** (kaiju); switch without losing progress.
- Low-motion breathing, eye glows and character-specific elemental particles; drag to rotate, pinch to zoom. Low-power rendering and reduced-motion support. A cinematic static fallback appears on devices without WebGL.
- Actual 3D equipment: level-unlocked wrist wraps, gold gloves, shades and iron crown appear on the active model. Aura cosmetics adjust elemental color.
- 80 bundled searchable exercises plus unlimited custom movements; Push, Pull, Legs, Upper starter split; create/edit/reorder routines with rep ranges and rest durations.
- Active workouts with per-set weight, reps, set types (working, warm-up, dropset, failure), notes, rest countdown and autosave; previous-set reference, easy add/remove, restart/repeat completed session.
- 19-region front/back anatomy map: recent muscle activity (0–1d hot, 2–6d warm, 7–13d neutral, **14+ days cold**, never-trained untracked). 3D anatomical highlights and temporary 24h pump effect, including slight muscle fullness and glow. **This is activity tracking, not a recovery diagnosis.**
- XP/level rewards, earned gear, current streak and session-complete reveal.
- Progress view: recent sessions, sets and volume, 7-day chart, estimated 1RM, workout details and the editable weekly goal.
- **Hevy workout-history CSV import**: preserves existing PumpQuest logs, recognizes common exercise names, creates custom exercises for unknown names, handles kg/lb and duplicate sessions. Imported records do not award XP.
- JSON save/restore, CSV export, history deletion, real weight unit conversions.
- Offline PWA install via Chrome, plus Android WebView app build (APK from GitHub Actions). Saved data stays on the device/browser; import/exports are user-initiated.

## Play

- Live preview (hosted under an isolated folder on an existing working Pages site): **https://mrmlttens.github.io/the-oddsfathers/pumpquest/**
- Open `index.html` via a local HTTPS/HTTP server or GitHub Pages, or use the self-contained `PumpQuest-PLAY-Release.html` backup.
- Android debug APK: open **Actions → Android APK build → successful run → PumpQuest-Android-debug**, download and install the APK. It is for sideload testing, not a signed Play Store release.

## Hevy migration

In Hevy: Profile → Settings → Export & Import Data → Export Data → Export Workouts. Open PumpQuest → Settings → Import Hevy History, select `workout_data.csv`, review the confirmation and import. Only the workout history imports; your Hevy routines must be built in PumpQuest. Export PumpQuest JSON before importing a large file.

## Reliability and data

- Data key `pumpquest.save.v1` is retained for compatibility with earlier builds.
- **Critical:** Browser storage is not cloud synced, and clearing browser data may delete workouts. Use **Settings → Export JSON** regularly. The installable Android build uses a separate local storage location from the web preview; move history between them by exporting/importing JSON.
- No user tracking or remote services. Android build denies WebView navigation outside the local asset origin. The only input from outside is user-selected import files.
- The app supports a full workout workflow but is not yet a signed Play Store app or independently audited production release. Browser/Android GPU capabilities and real-device visual performance vary. Android APK CI provides a compile check, not a substitute for device QA.

## Tests

```bash
node tests/smoke.js
node tests/anatomy.js
node tests/characters.js
node tests/importer.js
```

GitHub Actions runs all tests. The Android workflow builds a sideloadable debug APK on supported pushes.

## Code map

- `scene3d.js` — original low-dependency WebGL2/WebGL1 scene and touch camera
- `app.js` — single-screen UI, workout ledger, routine editor, XP, lockers and save/export
- `data.js` — exercise library, routines, cosmetic inventory
- `anatomy.js` — training recency across 19 muscle zones
- `insights.js` — workout-volume analytics, estimated 1RM and recent trends
- `importer.js` — local CSV parser and Hevy migrator
- `styles.css` — cinematic styling, animation and Android sizing
- `manifest.webmanifest` / `sw.js` — offline installability
- `android/` — native Java WebView wrapper and Android Gradle project
- `.github/workflows/` — tests and Android APK build

## Artistic direction

A mobile-friendly **original fantasy character RPG**, not a copy of existing cartoon or game characters. The models remain optimized procedural geometry rather than custom sculpted photorealistic assets. Cinematic compositing, materials and individual model variation are a deliberate improvement, but fully sculpted and rigged character art remains a separate specialist production milestone.

## License

MIT — original source code and art; no third-party characters/models bundled.