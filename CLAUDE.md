# Project Notes

Playwright + TypeScript test suite for the Trade Source site (manufacturer pages, search, etc.). Target app runs locally at `http://localhost:4321`.

## Setup

- `npm test` — run full suite (chromium, firefox, webkit)
- `npm run test:chromium` / `test:firefox` / `test:webkit` — single browser
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

## Known Issues

- None open currently.

## Conventions

- Tests in `tests/smoketests.spec.ts` are numbered with `//01`, `//02`, ... comments reflecting intended reading order, but each test navigates independently via full-path `page.goto` calls — they do not depend on execution order and are safe to run individually.
- Prefer `data-testid` locators over structural locators (e.g. `.locator('p')` off a heading) when a `data-testid` is available on the element — more resilient to markup changes.
