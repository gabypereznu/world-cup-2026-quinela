# How to submit your quiniela picks

## Quick start

1. Copy `data/participants/_template.json` to a new file, e.g. `data/participants/ana-rodriguez.json`
2. Open the file in **TextEdit** (Format → Make Plain Text), **VS Code**, or **Cursor**
3. Fill in your `id`, `name`, and `slack` handle
4. Change only the **numbers** for each match — keep country names and flag emojis as they are
5. Send the file to @gaby.perez on Slack (or push to `main` if you have GitHub access)

## Example (first matches)

```json
"M1": {
  "🇲🇽 Mexico": 2,
  "🇿🇦 South Africa": 1
}
```

## Field guide

| Field | Example | Notes |
|-------|---------|-------|
| `id` | `ana-rodriguez` | Lowercase, no spaces — same as the filename |
| `name` | `Ana` | Shown on the leaderboard |
| `slack` | `@ana.rodriguez` | Your Slack handle |
| `predictions` | | One block per match (`M1` … `M104`) |

## Rules

- Predict goals for **both teams** in every match (integers ≥ 0)
- Picks lock at **kickoff** — submit before the match starts
- Knockout slots (M73+) use placeholder labels until real teams are known; update those picks when the bracket is set
- Do **not** rename countries or remove emoji prefixes

## Scoring

| Result | Points |
|--------|--------|
| Exact score | 5 |
| Correct goal difference | 3 |
| Correct winner or draw | 2 |
| One team exact goals | +1 bonus |
| Wrong winner | 0 |

## Regenerate the blank template

If fixtures change, run from the repo root:

```bash
npm run generate-template
```
