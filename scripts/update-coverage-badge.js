import fs from 'fs';
import fetch from 'node-fetch'; // Optional if using Node < 18
import path from 'path';
import process from 'process';

const gistId = '0a63a4be359ffe44629be280d9a88353'; // Replace with your real Gist ID
const filename = 'coverage-summary.json';
const token = process.env.GIST_TOKEN;

const summaryPath = path.resolve('merged-coverage/coverage-summary.json');
const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
const pct = summary.total.lines.pct;

const badgeData = {
  schemaVersion: 1,
  label: 'coverage',
  message: `${pct}%`,
  color: pct >= 90 ? 'brightgreen' : pct >= 80 ? 'yellow' : 'red',
};

const response = await fetch(`https://api.github.com/gists/${gistId}`, {
  method: 'PATCH',
  headers: {
    Authorization: `Bearer ${token}`,
    'User-Agent': 'coverage-badge-updater',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    files: {
      [filename]: {
        content: JSON.stringify(badgeData, null, 2),
      },
    },
  }),
});

if (!response.ok) {
  const error = await response.text();
  console.error('Failed to update Gist:', error); // eslint-disable-line no-console
  process.exit(1);
}

console.log(`✅ Coverage badge updated: ${pct}%`); // eslint-disable-line no-console
