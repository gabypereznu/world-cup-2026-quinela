# World Cup 2026 Quinela

Team quiniela for FIFA World Cup 2026 — JSON picks, automatic scoring, React leaderboard on GitHub Pages.

## For participants

See [HOW_TO_SUBMIT.md](./HOW_TO_SUBMIT.md).

Copy `data/participants/_template.json`, fill in your predictions, DM @gaby.perez or push to `main`.

## For the commissioner (Gaby)

1. **Add picks** — create/update `data/participants/<id>.json`
2. **Add results** — after each matchday, update `data/results.json`:

```json
{
  "M1": { "home": 2, "away": 1 },
  "M2": { "home": 0, "away": 0 }
}
```

3. **Push to `main`** — GitHub Actions rebuilds and deploys the site

When knockout teams are known, update `data/fixtures.json` for those matches (replace placeholder names), then run `npm run generate-template` if needed.

## Local development

```bash
# Install
cd web && npm install && cd ..

# Dev server (http://localhost:5173/world-cup-2026-quinela/)
npm run dev

# Production build
npm run build
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run score` | Compute leaderboard → `web/public/data/` |
| `npm run generate-template` | Rebuild `_template.json` from fixtures |
| `npm run build` | Score + Vite production build |

## GitHub Pages

1. Push repo to GitHub as `world-cup-2026-quinela`
2. Settings → Pages → Source: **GitHub Actions**
3. Site URL: `https://<org>.github.io/world-cup-2026-quinela/`
