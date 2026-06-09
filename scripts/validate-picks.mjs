/**
 * Fails if a push changes predictions for matches that already kicked off.
 *
 * Per-match locking: only match IDs that changed in this push are checked.
 * Updating M73–M88 before those kickoffs is allowed even after M1 has played.
 */
import { execSync } from "child_process";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const fixtures = JSON.parse(
  readFileSync(join(ROOT, "data", "fixtures.json"), "utf8")
);

const kickoffById = Object.fromEntries(
  fixtures.matches.map((m) => [m.id, m.kickoff])
);

const afterSha = process.env.AFTER_SHA || process.env.GITHUB_SHA || "HEAD";

function run(cmd) {
  return execSync(cmd, { encoding: "utf8", cwd: ROOT }).trim();
}

function runOptional(cmd) {
  try {
    return run(cmd);
  } catch {
    return null;
  }
}

function resolveBeforeSha() {
  const fromEnv = process.env.BEFORE_SHA || process.env.GITHUB_EVENT_BEFORE;
  if (fromEnv && fromEnv !== "0000000000000000000000000000000000000000") {
    return fromEnv;
  }
  return runOptional("git rev-parse HEAD~1");
}

function changedParticipantFiles(beforeSha) {
  if (!beforeSha) {
    return [];
  }

  const diff = runOptional(
    `git diff --name-only ${beforeSha} ${afterSha} -- data/participants/`
  );
  if (!diff) return [];

  return diff
    .split("\n")
    .filter((f) => f && !f.endsWith("_template.json"));
}

function readParticipantAt(path, sha) {
  try {
    const raw = run(`git show ${sha}:${path}`);
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function isZeroPrediction(pred) {
  if (!pred) return true;
  return Object.values(pred).every((goals) => Number(goals) === 0);
}

function changedMatchIds(oldFile, newFile) {
  const ids = new Set([
    ...Object.keys(oldFile?.predictions ?? {}),
    ...Object.keys(newFile?.predictions ?? {}),
  ]);
  const changed = [];
  for (const id of ids) {
    const a = oldFile?.predictions?.[id];
    const b = newFile?.predictions?.[id];
    if (JSON.stringify(a) === JSON.stringify(b)) continue;
    // New player file: all-zero rows for past matches are not treated as late picks
    if (!a && isZeroPrediction(b)) continue;
    changed.push(id);
  }
  return changed;
}

function isLocked(matchId, now = new Date()) {
  const kickoff = kickoffById[matchId];
  if (!kickoff) return false;
  return now >= new Date(kickoff);
}

function main() {
  const beforeSha = resolveBeforeSha();
  const files = changedParticipantFiles(beforeSha);

  if (files.length === 0) {
    console.log("No participant files changed — skip pick validation.");
    return;
  }

  const now = new Date();
  const violations = [];

  for (const file of files) {
    const newFile = readParticipantAt(file, afterSha);
    if (!newFile) continue;

    const oldFile = readParticipantAt(file, beforeSha);

    const changedIds = changedMatchIds(oldFile, newFile);

    for (const matchId of changedIds) {
      if (!isLocked(matchId, now)) continue;

      const kickoff = kickoffById[matchId];
      violations.push({
        file,
        matchId,
        kickoff,
        player: newFile.name || newFile.id,
      });
    }
  }

  if (violations.length === 0) {
    console.log("Pick validation passed.");
    return;
  }

  console.error("Late pick validation failed:\n");
  for (const v of violations) {
    console.error(
      `  • ${v.player} (${v.file}): changed ${v.matchId} after kickoff (${v.kickoff})`
    );
  }
  console.error(
    "\nPicks lock at kickoff per match. Only edit matches that have not started yet."
  );
  console.error(
    "Knockout rounds: you can still update M73+ until each of those matches kicks off."
  );
  process.exit(1);
}

main();
