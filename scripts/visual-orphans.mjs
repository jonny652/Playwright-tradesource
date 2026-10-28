// Fails if a baseline image in tests/__screenshots__ is not used by any visual spec
// (for example after a test was renamed or deleted), so stale images do not pile up.
// Specs must name screenshots as toHaveScreenshot(['page', 'name.png'], ...), which is the project convention.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const ROOT = 'tests/__screenshots__';
const SPEC = 'tests/visual-regression.spec.ts';

const walk = (dir, extension) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? walk(join(dir, entry.name), extension) : entry.name.endsWith(extension) ? [join(dir, entry.name)] : [],
  );

if (!existsSync(ROOT)) {
  console.log('No baselines yet, nothing to check.');
  process.exit(0);
}

//Every "page/name" pair the specs ask for
const used = new Set();
const pattern = /toHaveScreenshot\(\s*\[\s*'([^']+)'\s*,\s*'([^']+)\.png'/g;
for (const match of readFileSync(SPEC, 'utf8').matchAll(pattern)) used.add(`${match[1]}/${match[2]}`);

//A baseline is <page>/<name>-<project>.png, project like visual-desktop-1280x720
const orphans = walk(ROOT, '.png')
  .map((file) => relative(ROOT, file).split(sep).join('/'))
  .filter((key) => !used.has(key.replace(/-visual-[a-z]+-\d+x\d+\.png$/, '')));

if (orphans.length) {
  console.error('Baselines not used by any visual spec:\n  ' + orphans.join('\n  '));
  console.error('Delete them (or restore the test) and commit.');
  process.exit(1);
}
console.log(`All baselines are used by a spec (${used.size} screenshot names checked).`);
