# Spare Me — Bowling Scoreboard 🎳

A self-contained bowling scoreboard web app for human bowling. Multiple teams,
tap in pins / strikes / spares, real 10-frame scoring, strike & spare explosions,
a winner trophy, and 8 pickable landscape scenes. Landscape-first, installable as
a home-screen app, and fully offline once loaded (service worker).

## Files
- `index.html` / `bowling.html` — the entire app (same file; `index.html` is the
  entry, `bowling.html` matches the PWA manifest `start_url`)
- `scenes.css` — the landscape background scenes (base64 art, offline)
- `bowling-sw.js` — service worker (offline cache, network-first for the page)
- `manifest.webmanifest` — PWA manifest
- `bowling-icon-*.png` — app icons

## Deploy on Render
This repo includes `render.yaml`. On Render: **New → Blueprint**, connect this
repo, and it deploys as a Static Site (publish directory `.`, no build). You get a
permanent `https://spare-me-*.onrender.com` URL. Open it on your phone → Share →
Add to Home Screen.

No build step, no dependencies — it's plain HTML/CSS/JS.
