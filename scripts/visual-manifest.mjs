// Builds tests/__screenshots__/manifest.json: one entry per baseline image with its page, resolution,
// real pixel size and capture date/time.
//
// Run it after `playwright test --update-snapshots=all` (the update workflow / docker service does this).
// Capture times cannot live in file names (Playwright finds a baseline by exact name) or file timestamps
// (a CI checkout resets them), so an image only gets a new `capturedAt` when its content hash changes.
// Unchanged baselines keep the date they were originally captured.
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative, sep } from 'node:path';

const ROOT = 'tests/__screenshots__';
const MANIFEST = join(ROOT, 'manifest.json');

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? walk(join(dir, entry.name)) : entry.name.endsWith('.png') ? [join(dir, entry.name)] : [],
  );

const git = (command) => {
  try {
    return execSync(command, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return 'unknown';
  }
};

//PNG header: width and height are big-endian 32-bit integers at byte 16 and 20
const pngSize = (buffer) => `${buffer.readUInt32BE(16)}x${buffer.readUInt32BE(20)}`;

if (!existsSync(ROOT)) {
  console.error(`No ${ROOT} folder found. Run the visual tests with --update-snapshots=all first.`);
  process.exit(1);
}

const previous = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')).entries ?? {} : {};
const now = new Date().toISOString();

const playwright = JSON.parse(readFileSync('node_modules/@playwright/test/package.json', 'utf8')).version;
const chromium = JSON.parse(readFileSync('node_modules/playwright-core/browsers.json', 'utf8')).browsers.find(
  (browser) => browser.name === 'chromium',
)?.browserVersion;
const capturedWith = {
  sourceCommit: (process.env.GITHUB_SHA ?? git('git rev-parse HEAD')).slice(0, 7),
  runId: process.env.GITHUB_RUN_ID ?? 'local',
  playwright,
  chromium: chromium ?? 'unknown',
  image: process.env.PLAYWRIGHT_IMAGE ?? 'unknown',
};

const entries = {};
let refreshed = 0;
for (const file of walk(ROOT).sort()) {
  const key = relative(ROOT, file).split(sep).join('/');
  const buffer = readFileSync(file);
  const sha256 = createHash('sha256').update(buffer).digest('hex');
  const before = previous[key];

  //File name is <name>-<project>.png, project is e.g. visual-desktop-1280x720
  const match = basename(key, '.png').match(/^(.*)-(visual-[a-z]+-(\d+x\d+))$/);

  if (before && before.sha256 === sha256) {
    entries[key] = before; //unchanged image: keep its original capture date and environment
    continue;
  }
  refreshed += 1;
  entries[key] = {
    page: dirname(key),
    name: match ? match[1] : basename(key, '.png'),
    project: match ? match[2] : 'unknown',
    viewport: match ? match[3] : 'unknown', //CSS pixels of the browser window
    imagePixels: pngSize(buffer), //real size of the image (full-page shots are taller than the viewport)
    capturedAt: now,
    ...capturedWith,
    sha256,
  };
}

writeFileSync(MANIFEST, JSON.stringify({ generatedAt: now, entries }, null, 2) + '\n');
console.log(`Manifest written: ${Object.keys(entries).length} baselines, ${refreshed} new or changed.`);
