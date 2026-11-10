# Vali Basha Shaik Portfolio

A personal portfolio built with React, Vite, and Three.js. The browser-based 3D scene is an original procedural WebGL environment; it is **not** an Unreal Engine 5 project and does not claim UE5 rendering quality.

## Requirements
- Node.js 18 or newer
- npm
- A modern browser with WebGL support for the 3D environment

## Run locally
```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Create a production bundle with:

```bash
npm run build
npm run preview
```

## Controls
- Start Exploring: enter pointer-lock mode on desktop.
- W/A/S/D or arrow keys: move.
- Mouse: look around.
- E: open the nearest room display when within interaction range.
- Escape: release mouse control.
- Use the on-screen section navigation as a conventional accessible alternative.
- Low / Medium / High control rendering pixel ratio and shadow quality.

On mobile, use the section navigation; pointer-lock mouse exploration is desktop-only.

## Project structure
- `src/App.jsx` — Three.js scene, environment, mansion, movement/collision, interactions, and portfolio data/UI.
- `src/styles.css` — application styles and responsive layouts.
- `src/main.jsx` — React entry point.
- `index.html` — Vite document and metadata.

## Content maintenance
Portfolio details and links are defined in `src/App.jsx`. Update these from verified information only. The contact phone and email are shown publicly by design; remove or change them if you do not want them published.

## Visual and asset limitations
The environment uses procedural geometry and physically based Three.js materials. It does not include licensed photogrammetry, scanned landscape assets, custom mansion models, or high-resolution material texture sets. It is therefore an optimized stylized architectural visualization, not photorealistic UE5 rendering. No external model or texture assets are bundled in this repository.

## Future Unreal Engine deployment
Any future Unreal Engine 5 + Pixel Streaming system would be a separate project. No UE5 build, cloud GPU service, session broker, or Pixel Streaming deployment is included here.
