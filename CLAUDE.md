# Project Notes

Playwright + TypeScript test suite for the Trade Source site (manufacturer pages, search, etc.). Target app runs locally at `http://localhost:4321`.

## Setup

- `npm test` — run the functional suite (chromium, firefox, webkit). Visual regression tests are NOT included, they run in their own project
- `npm run test:chromium` / `test:firefox` / `test:webkit` — single browser
- `npm run test:visual:docker` — run the visual regression tests in the Linux Playwright image (same as CI); `npm run test:visual:update` regenerates the baselines (needs Docker, and `./tradesource-site` cloned)
- `npm run test:ui` — Playwright UI mode
- `npm run report` — open last HTML report
- Dev server must be reachable at `http://localhost:4321` (config `webServer` runs `npm run start` if not already up, reusing an existing server locally)
- VS Code: `ms-playwright.playwright` extension gives per-test run arrows in the Testing sidebar (flask icon) and inline gutter icons

## Progress Log

### 2026-10-14 — Fixed locator in paragraph text test
`tests/smoketests.spec.ts` (test "verify the h1 paragraph text is as expected") was using `page.getByRole('heading', { name: 'Vortix' }).locator('p')`, assuming the tagline `<p>` was nested inside the `<h1>`. The actual markup is `<p class="manufacturer-tagline" data-testid="manufacturer-tagline">`, a sibling element, not a child of the heading.
- **Fix:** switched to `page.getByTestId('manufacturer-tagline')`.

### 2026-10-16 — Investigated "no individual run" complaint / full-suite flakiness
User wanted every test runnable individually via the VS Code green arrow. Investigation:
- Confirmed each test in `smoketests.spec.ts` is already structurally independent (every test does its own `page.goto` with a full path rather than relying on a prior test's navigation), so individual runs (`playwright test -g "<name>"`) already worked.
- Found a genuine bug unrelated to "individual vs. suite" running: the "Contact Manufacturer" button test asserted text `'Contact Manufacturer'`, but the real rendered text is `'Contact manufacturer'` (lowercase "m"). This failed in every run mode.
  - **Fix:** updated the expected string in the `toHaveText` assertion to `'Contact manufacturer'`.
- Found that running the whole file together (`fullyParallel: true`, default `workers: undefined` locally → ~half of CPU cores, × 3 browser projects) overwhelmed the local dev server, causing `page.goto` timeouts across most tests — not a spec bug, a local dev-server capacity issue under concurrent load.
  - **Fix:** set `workers: 1` unconditionally in `playwright.config.ts` (previously `isCI ? 1 : undefined`), so the suite always runs serially and doesn't hammer the dev server. CI already ran with 1 worker; this just makes local runs match.
- Confirmed with `code --list-extensions` that the Playwright Test VS Code extension was installed, and with `npx playwright test --list` that all 24 tests across both spec files were discoverable — so the "no green arrows" issue was VS Code/workspace-side (likely wrong folder open as workspace root, or Testing panel needing a manual refresh/trust prompt), not a project config problem. User confirmed it's now working after checking the workspace folder/Testing panel.

### 2026-10-16 — Wired CI to start the app under test (tradesource-site)
The GitHub Actions workflow (`.github/workflows/playwright.yml`) checked out only this repo, so on CI the `webServer` block in `playwright.config.ts` had no app to start (`npm run start` has no matching script in *this* repo — the site lives in a separate repo, https://github.com/samGreenwood2022/tradesource-site).
- Confirmed the site repo is public, served via `npm start` → `node server.js`, default port `4321` (overridable via `PORT`), and has zero npm dependencies — no `npm install` step needed for it.
- **Fix:**
  - Added a second `actions/checkout` step to the workflow that checks out `samGreenwood2022/tradesource-site` into `./tradesource-site`.
  - Added `cwd: './tradesource-site'` to the `webServer` block in `playwright.config.ts`, so when Playwright needs to start the server it runs `npm run start` inside that folder.
  - Added `/tradesource-site/` to `.gitignore` (it's checked out fresh each CI run / cloned locally, never committed).
  - Updated `README.md`'s Getting Started section to tell local devs to clone the site into `./tradesource-site`.
- Verified locally: cloned the site repo into `./tradesource-site`, ran `node server.js` directly (on a spare port, since a dev server was already running on 4321) — served HTTP 200 with no dependency install required, confirming the CI path will work.

### 2026-10-28 — Added visual regression testing
Visual tests were flaky or impossible to share between Windows and GitHub: baselines are per OS, the site's font stack renders differently on Windows and Linux, and the site's cookie banner / "Discover TradeSource Insights" popup and four lazily-loaded random homepage sections change what is on screen. The popups are not a geolocation effect (the site has no real geolocation, region is fixed to GB), they appear at random times.
- **Added** a `visual-desktop-1280x720` project (chromium only, fixed 1280x720, signed out) that runs only `tests/visual-regression.spec.ts`. The chromium/firefox/webkit projects ignore that file, and the `npm test` scripts list their projects explicitly, because `npx playwright test` runs every project.
- **Added** `fixture/visual-options.ts`: an automatic fixture calling `BasePage.disableOverlays()` before any navigation, and `settle()`, which loads the four `[data-lazy]` homepage regions (waits for their `is-loaded` class), waits for images and fonts, fails on a broken image, then scrolls back to the top. The four random regions are masked in the full-page homepage shot.
- **Added** tests for the homepage (full page, header, main navigation, footer) and the Vortix manufacturer page (full page, signed-out contact sign-in prompt).
- **Baselines** are named `tests/__screenshots__/<page>/<name>-<project>.png` (no platform in the name) and are only ever generated in the Linux Playwright image: locally via `docker-compose.visual.yml`, on GitHub via the `visual` job. `scripts/visual-manifest.mjs` records page, resolution, pixel size and capture date/time per image in `tests/__screenshots__/manifest.json`; `scripts/visual-gallery.mjs` builds a review page; `scripts/visual-orphans.mjs` fails CI if a baseline is no longer used by a test.
- **CI:** new `visual` job in the Playwright container (image tag must match `@playwright/test` in `package-lock.json`, currently 1.64.1). If no baselines are committed yet, the job generates them and uploads them as an artifact instead of comparing (first run only); from then on it compares and never writes.
- **Not yet verified at time of writing:** the Docker service and the GitHub job had not been run. Check the first runs, and confirm two compare runs in a row both pass.

### 2026-10-29 — Verified visual regression Docker service
Ran `npm run test:visual:docker` twice in a row on the `Feature/-visual-regression-tests` branch (`./tradesource-site` already cloned locally). Both runs: 6/6 passed against the committed baselines, no flakiness.
- Docker Desktop was installed and running but `docker.exe` wasn't on PATH in the shell; worked around by adding `C:\Program Files\Docker\Docker\resources\bin` to PATH for the session rather than changing global PATH.
- The GitHub Actions `visual` job itself is still unverified — only the local Docker path has been confirmed so far.

## Known Issues

- None open currently.

## Conventions

- Tests in `tests/smoketests.spec.ts` are numbered with `//01`, `//02`, ... comments reflecting intended reading order, but each test navigates independently via full-path `page.goto` calls — they do not depend on execution order and are safe to run individually.
- Prefer `data-testid` locators over structural locators (e.g. `.locator('p')` off a heading) when a `data-testid` is available on the element — more resilient to markup changes.
- Visual regression: name every screenshot `toHaveScreenshot(['page', 'name.png'])` (the orphan check relies on this form), call `settle(page)` before each one, never generate baselines on Windows, and never use fixed sleeps.
