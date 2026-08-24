# Vespera: The Somber

> A darkly satirical top-down action-roguelite built for [js13kGames 2026](https://js13kgames.com/2026) (Theme: *Unicorns and Rainbows*).

## Play the Game Live
🎮 **[Play Live on GitHub Pages](https://sandgraal.github.io/vespera-js13k/)**

## Premise
The *Grand Concordat of Radiant Serenity* has criminalized naps, rain, and minor melancholies. Play as **Vespera**, a grumpy obsidian unicorn with a 300-year migraine, dismantling the Solar Spire to claim 500 years of uninterrupted sleep.

## Controls

### Desktop
- **WASD / Arrows** — Move
- **Mouse** — Aim; **Left Click** — Umbral Lance
- **Right Click** — Somber Rainbow (bullet-absorbing *Grump Arc*; inflicts GRUMPY)
- **Q** — Void Scythe (AoE + knockback)
- **Space / Shift** — Phase Dash (i-frame dodge)
- **Space / Enter** — Advance dialogue & read Edict Shrines
- **P** — Pause / options · **M** — Mute · **N** — Reduced Motion

### Mobile (touch)
- **Left half** — drag to move · **Right half** — drag to aim & auto-fire
- On-screen buttons — Rainbow (◗), Scythe (Q), Dash (⇢)

*(Landscape orientation recommended.)*

## Features (v1.3)
- **Procedurally generated runs** — room order, count, and enemy composition vary each run.
- **Cynical Boons** with a shard-funded **reroll** at altars.
- **Pause / options overlay**, **mute**, and a **Reduced Motion** toggle (auto-detects `prefers-reduced-motion`).
- **Best clear-time & shard tracking** saved to `localStorage`.
- Responsive canvas that scales to any viewport.

## Technical Details
- Pure HTML5 Canvas 2D procedural rendering (zero external image assets).
- 100% procedural Web Audio API sound synthesizer.
- Ships **≤ 13,312 bytes** zipped.

## Build
The readable, playable source is the root [`index.html`](index.html) (served directly by GitHub Pages). The competition artifact is produced by minifying + [Roadroller](https://github.com/lifthrasiir/roadroller)-packing it into `dist/`:

```bash
npm install
npm run build   # → dist/index.html + dist/game.zip, asserts the 13,312-byte budget
```

The build fails (non-zero exit) if the zip exceeds the limit.

## License
MIT © sandgraal
