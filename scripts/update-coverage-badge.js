import lcovParse from 'lcov-parse';
import path from 'path';
import process from 'process';

const summaryPath = path.resolve('coverage/lcov.info');

lcovParse(summaryPath, async (err, data) => {
  if (err) throw err;

  let totalLines = 0;
  let coveredLines = 0;

  for (const file of data) {
    for (const line of file.lines.details) {
      totalLines++;
      if (line.hit > 0) coveredLines++;
    }
  }

  const pct =
    totalLines === 0 ? 0 : Math.round((coveredLines / totalLines) * 100);

  const filename = 'adequate-coverage-summary.json';
  const gistId = '0a63a4be359ffe44629be280d9a88353';
  const token = process.env.GIST_TOKEN;

  if (!token) {
    console.error('Error: GIST_TOKEN environment variable is not set.'); // eslint-disable-line no-console
    process.exit(1);
  }

  let color;

  if (pct >= 90) {
    color = 'brightgreen';
  } else if (pct >= 80) {
    color = 'yellow';
  } else {
    color = 'red';
  }

  const badgeData = {
    color,
    label: 'coverage',
    message: `${pct}%`,
    schemaVersion: 1,
  };

  const response = await fetch(`https://api.github.com/gists/${gistId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'coverage-badge-updater',
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
});
