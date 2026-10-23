// Pulls public LeetCode stats and writes data/leetcode.json when they change.
import { readFileSync, writeFileSync } from 'node:fs';

const USER = process.env.LC_USER || 'Elvya', OUT = 'data/leetcode.json';
const query = `query($u: String!) {
  allQuestionsCount { difficulty count }
  matchedUser(username: $u) {
    submitStatsGlobal { acSubmissionNum { difficulty count } }
    userCalendar { streak totalActiveDays }
  }
}`;

const res = await fetch('https://leetcode.com/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Referer': `https://leetcode.com/u/${USER}/`, 'User-Agent': 'Mozilla/5.0 (portfolio stats bot)' },
  body: JSON.stringify({ query, variables: { u: USER } }),
});
if (!res.ok) throw new Error(`LeetCode answered ${res.status}`);
const { data, errors } = await res.json();
if (errors || !data?.matchedUser) throw new Error('Bad response: ' + JSON.stringify(errors || data));

const by = (list, k) => list.find(x => x.difficulty === k)?.count ?? 0;
const ac = data.matchedUser.submitStatsGlobal.acSubmissionNum, cal = data.matchedUser.userCalendar || {};
const stats = {
  easy: by(ac, 'Easy'), medium: by(ac, 'Medium'), hard: by(ac, 'Hard'),
  all: by(data.allQuestionsCount, 'All'),
  maxStreak: cal.streak ?? 0, activeDays: cal.totalActiveDays ?? 0,
};
if (stats.easy + stats.medium + stats.hard <= 0) throw new Error('Got zero solves, refusing to overwrite');

let old = {};
try { old = JSON.parse(readFileSync(OUT, 'utf8')); } catch {}
// Keep the previous best streak if the calendar window (past year) drops it.
stats.maxStreak = Math.max(stats.maxStreak, +old.maxStreak || 0);
if (Object.keys(stats).every(k => stats[k] === old[k])) { console.log('No change'); process.exit(0); }

stats.updated = new Date().toISOString().slice(0, 10);
writeFileSync(OUT, JSON.stringify(stats, null, 2) + '\n');
console.log('Updated', stats);
