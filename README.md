# PumpQuest v0.5 — 3D Champions / seven-day test build

**Test this build for seven days on the same phone and browser.**

Changes since v0.4:
- Three selectable, **distinct** 3D characters instead of one bull with three aura colors:
  - **Stormhorn** — horned titan, leather/steel, blue sparks and mountain smoke.
  - **Abyss Warden** — armored turtle-like fighter with a full rear shell, teal water glow and pylon fins.
  - **Cinder Drake** — reptilian kaiju with a tapering tail, dorsal plates, talons and ember particles.
- Full-screen 3D artwork remains visible behind the workout sheets. Tap the three small character selectors to switch immediately; drag to rotate, pinch to zoom.
- Selection is saved in the existing `pumpquest.save.v1` localStorage record; **all previous workouts, XP, routines and exercise customizations remain unchanged**.
- Roster also appears under Customize/Champions with descriptive cards. All three are available during this test.
- Workout logging, the 19-region anatomy map, 14+ day cold spots, data export, timer and XP engine are preserved.

## Important test checklist

1. Select each champion and rotate it to inspect the front and back.
2. Close and reopen the site: your champion should still be selected.
3. Start a routine, log at least one weighted set, finish and check for XP.
4. Open Body Map after the session to confirm recently trained muscles light up.
5. Use **Settings → Export JSON** at least once during the week to keep your test data safe.
6. Report any missing taps, glitches, slow rotation, exercise search failures or lost workout history.

**No cloud sync:** all workouts and character settings are stored locally on the same browser. Data may be lost if site storage is cleared.

**Design status:** these are original low-poly/procedural real-time models, not final sculpted high-detail glTF assets; they are intentionally lightweight for Android. No paid libraries, subscriptions, or copyrighted character models.

---

# PumpQuest 3D — interactive prototype v0.4

**Train in real life. See it on your character.**

This version is a functioning Android-first workout RPG prototype with a real-time **WebGL 3D** fantasy titan. It is NOT a static image in a rotating frame. The titan is assembled from procedural 3D geometry with real camera perspective, lights, body meshes and depth, subtle breathing, rotatable 3D orbit controls and particle effects.

## Play

**Direct live preview:** https://mrmlttens.github.io/the-oddsfathers/pumpquest/

For now the preview lives in a **separate `/pumpquest/` folder** on an existing working GitHub Pages site, because GitHub Pages setup for the independent PumpQuest repository failed. Its source stays here in `Mrmlttens/PumpQuest`. The Oddsfathers' app files are not altered.

Open on Android using Chrome. Drag the *center of the character* left/right to rotate, pinch to zoom. The surrounding circular buttons open workout tools as slide-up panels, leaving the hero behind them. If WebGL is not supported, the app remains usable with a static image fallback.

## Version 0.4

- Single-screen, full-height 3D hero with six floating circular commands.
- Actual WebGL2/WebGL1 original horned titan. No paid APIs, CDN libraries, or external model downloads.
- 3D orbit and pinch zoom, subtle breathing, small moving particles.
- Storm, Tide, Ember color variations for particles and eyes; only one 3D creature body so far (not three unique 3D character models).
- Real training logic: search 80 exercises, build/edit splits, rest timers, log sets/reps/weights, save workout history and earn XP.
- Muscle activation highlights on 3D model plus a separate interactive front/back body map with **19 regions**.
- Recency statuses: hot 0–1 days, warm 2–6, neutral 7–13, cold 14+; **untracked is not cold**. This is a visual training-frequency indicator, not a medical recovery assessment.
- Session summary, level progression, aura unlocks, JSON backup and CSV export.
- Existing `pumpquest.save.v1` data schema remains supported; hosted origin remains the same as v0.3.

## Build and tests

No compilation, account, payment, login, or server needed. This is a static HTML/JS app.

```bash
node tests/smoke.js
node tests/anatomy.js
python3 -m http.server 8000
```

Then open http://localhost:8000/ in a browser with WebGL enabled. Static files can be hosted anywhere HTTPS is supported.

Main files: `index.html`, `styles.css`, `scene3d.js` (WebGL model), `app.js` (workout system), `anatomy.js`, `data.js`, `sw.js`, and `assets/` fallback artwork and icons.

## Limitations

This is a **functional prototype**, not a production game or native Play Store Android application. The procedural 3D sculpt is deliberately lower-detail than the cinematic concept art. Cosmetic gear is tracked but not yet an independently modeled and physically wearable 3D equipment system. Workout data is stored in this browser's `localStorage` and does not sync across phones. Back it up with **Backup (JSON)** and keep the file safe; clearing site data can delete your logs.

## License

MIT. Original code and original 3D geometry. No copyrighted external creature models embedded.