# PumpQuest — Art / Muscle Map Production Contract v1

**Non-negotiable:** New character art never defines its own muscle map. The map belongs to the shared, versioned anatomy rig `pq-19-region-art-v1` in `skin-contract.js` / `artmap.js`. Every illustrated skin reuses the exact same 19 regions and interactive click targets.

## Canonical composition

- Render each orientation on **941 × 1672 pixels** (not an arbitrarily cropped screen image).
- Deliver exactly two assets for each character: `skin-id-front.webp` and `skin-id-back.webp`. Both images have the same canvas, full head, hands, calves, and feet, no cutoff or camera tilt, straight-on, neutral bodybuilder stance with arms away from torso.
- Do not move, rescale, distort or regenerate the underlying anatomy shapes. Keep the center line at `x=470.5`; follow the *separate, locked* FRONT and BACK shoulder/waist/leg reference poses contained in the master guides.
- In the final app, the SVG hit regions and the artwork are siblings inside the **same SVG `viewBox="0 0 941 1672"`**. The whole composition scales uniformly to fit mobile. This avoids the `object-fit: cover` mismatch that cropped the earlier image.
- Build backgrounds/FX as separate, non-interactive layers outside the master body coordinate system. Idle breathing and particles cannot move the clickable map independently of the picture. If art is animated, the body and map must share the exact same transform.

## Standard skin creation workflow

1. Start with **`art/MASTER_FRONT.svg` and `art/MASTER_BACK.svg`** as locked top layers. Do not start a new pose from a text prompt. These are the only editable guides for muscle registration.
2. Draw or render character in this fixed stance, registering head/shoulder/elbow/wrist/navel/hip/knee/ankle landmarks against the guide. Keep anatomical muscle boundaries under the corresponding colored regions. **This matters more than visual decoration.**
3. For monster skins (titan, reptile, turtle, pixel arcade lifter), adapt *costumes, texture, shell, scales, face, aura and surrounding scenery* to the same body pose. Tail, wings or shell can extend outside mapped regions but never conceal the entire back. An 8-bit character keeps the shared silhouette proportions; nearest-neighbor pixel edges are aesthetic only.
4. Export full **front and back WebP** at exactly 941 × 1672, without embedded UI controls. Supply the source project or layered file for revisions.
5. Run `python3 art/build_guides.py` and `python3 tests/skin_contract.py`, then open the game with `?artQA=1` to see fixed anatomy regions, center line, and landmark points directly over the illustration. Test *both* orientations at 360×780, 390×844, and 412×915. Verify tap hit targets for the chest, shoulders, arms, back, quadriceps, hamstrings and calves.
6. Two gates must pass: **technical** (both assets exist, correct resolution, rig version, map and runtime tests) and **visual** (a human confirms muscle highlighting actually lines up). Only then mark the skin `approval: 'approved'` in the skin registry and expose it for selection.

## How to use the calibration tools

- `art/MASTER_FRONT.svg`: fixed front pose/body zones and registration landmarks.
- `art/MASTER_BACK.svg`: fixed rear pose/body zones and registration landmarks.
- `art/QA_FRONT_stormhorn.jpg` / `art/QA_BACK_stormhorn.jpg`: overlay previews exposing alignment defects in the **existing v1.2 art**; these are review images, not approved assets.
- `?artQA=1`: live app overlay with landmarks and paths. No completed workouts are generated.
- `skin-contract.js`: unique rig ID, reference dimensions, landmarks, and skin registry; unknown/unapproved skin IDs resolve to baseline.
- `artmap.js`: single source of truth for heatmap/click polygons for both orientations.

## Existing art status (important)

The current Stormhorn front/back paintings were produced before this contract. Their relative body proportions are not consistent, particularly shoulder span and scale in the rear view. **Same pixels ≠ aligned body.** Both can still be used in the prototype, but they are `approval: reference` and must be re-rendered or manually registered to the locked guides before production release. Do not describe them as fully validated. Future skins must not repeat this mistake.

## Skins without duplicating the map

Changing skins switches only the referenced `front.webp` / `back.webp` layers and character-specific VFX. All 19 paths, history, warm/cold logic, and touch regions stay identical. A separate `3D` rig might be supported in a future release but would require a distinct documented UV/body-mask system; do not mix 3D mapping with these 2D pixel coordinates.