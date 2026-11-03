# PumpQuest — Character Art Standard (November 2026)

## What this pass delivers

- Continuous anatomical body sculpt instead of segmented primitive spheres.
- Procedural micro surface detail for skin, hair, scales, horn, leather and forged metals.
- Filmic tonemapping and separated warm-key/cool-rim studio lights.
- Existing three species, touch rotation, character selection, visual hot/cold muscle zones and equipable gear.
- Cinematic/Balanced GPU quality setting, preserving local workout data.
- Original geometry and code; no copied trademarked characters or commercial stock art.

## Still required for *reference-level* cinematic characters

This pass is an upgraded procedural prototype, NOT a finished high-end 3D character sculpt.
For true cinematic fidelity, create original high-poly sculpted character assets in Blender/ZBrush or an asset-generation tool with mesh export, then retopologize (target 30–70k tris per champion on Android), bake PBR maps (base color, normal, roughness, metallic, ambient occlusion), rig for restrained idle motion, and export GLB with 1K–2K texture variants and LODs.
The app should load the GLBs from local assets (no external CDN) and retain the procedural version as an offline GPU fallback. Obtain independently licensed source art, preserve creator rights and file provenance, and test on a real Android device.

## Quality acceptance gates

1. Full-body 3/4 view matches approved horned-titan silhouette and proportions.
2. Face, horns, skin, fur, armor and hands remain readable at 390px wide.
3. Animation shows only subtle breathing, eye energy and species-specific smoke/water/embers.
4. Rotate 360 degrees with no intersections or texture seams.
5. 30fps+ on supported midrange Android, with Balanced fallback.
6. Muscle heat/cold overlays and equipped unlocks remain visible and correctly attached.
7. Workout data and APK backup/import remain unmodified by art changes.