export function isMatchLocked(kickoff, now = new Date()) {
  if (!kickoff) return false;
  return now >= new Date(kickoff);
}
