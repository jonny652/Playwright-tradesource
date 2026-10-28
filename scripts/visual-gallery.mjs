// Builds tests/__screenshots__/gallery.html from manifest.json: every baseline with a caption
// (page, name, resolution, real pixel size, capture date/time, commit) for easy review.
// The gallery is a review aid only. It is git-ignored; the update workflow uploads it as an artifact
// next to the images, so open it from the downloaded folder.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const ROOT = 'tests/__screenshots__';
const MANIFEST = `${ROOT}/manifest.json`;

if (!existsSync(MANIFEST)) {
  console.error('No manifest.json found. Run scripts/visual-manifest.mjs first.');
  process.exit(1);
}

const { generatedAt, entries } = JSON.parse(readFileSync(MANIFEST, 'utf8'));
const escape = (value) =>
  String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

const byPage = {};
for (const [file, entry] of Object.entries(entries)) (byPage[entry.page] ??= []).push([file, entry]);

const sections = Object.entries(byPage)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(
    ([page, items]) => `
  <section>
    <h2>${escape(page)}</h2>
    <div class="grid">${items
      .map(
        ([file, entry]) => `
      <figure>
        <a href="${escape(file)}"><img src="${escape(file)}" alt="${escape(entry.page)} ${escape(entry.name)}" loading="lazy"></a>
        <figcaption>
          <strong>${escape(entry.page)} / ${escape(entry.name)}</strong><br>
          Viewport ${escape(entry.viewport)} &middot; image ${escape(entry.imagePixels)} px<br>
          Captured ${escape(entry.capturedAt)}<br>
          Commit ${escape(entry.sourceCommit)} &middot; Playwright ${escape(entry.playwright)} &middot; Chromium ${escape(entry.chromium)}
        </figcaption>
      </figure>`,
      )
      .join('')}
    </div>
  </section>`,
  )
  .join('');

writeFileSync(
  `${ROOT}/gallery.html`,
  `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Visual baselines</title>
<style>
  body { font-family: system-ui, sans-serif; margin: 2rem; background: #f6f7f9; color: #1a1a1a; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1rem; }
  figure { margin: 0; background: #fff; border: 1px solid #d0d4da; border-radius: 6px; padding: 0.75rem; }
  img { width: 100%; height: auto; max-height: 360px; object-fit: contain; object-position: top; border: 1px solid #e3e5e8; }
  figcaption { font-size: 0.8rem; line-height: 1.5; margin-top: 0.5rem; }
</style></head>
<body>
<h1>Visual regression baselines</h1>
<p>${Object.keys(entries).length} baselines &middot; manifest generated ${escape(generatedAt)}</p>${sections}
</body></html>
`,
);
console.log(`Gallery written: ${ROOT}/gallery.html`);
