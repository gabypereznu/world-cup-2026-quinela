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
- **Picks lock at kickoff** — each match locks individually when it starts (see below)
- Knockout matches (M73+) are in the same file — update those picks before each match kicks off as teams are confirmed
- Do **not** rename countries or remove emoji prefixes

### How pick locking works

- Locking is **per match**, not one deadline for the whole file.
- If Mexico vs South Africa (M1) already kicked off, you **cannot change M1** — but you can still edit M73 or any match that has not started.
- On push to `main`, CI compares your changes to the previous version and **fails the deploy** if you changed picks for a match that already kicked off.
- Updating `results.json` (real scores) does not trigger pick validation.
- Run `npm run validate` locally before pushing to catch late picks early.

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
