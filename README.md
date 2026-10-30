# Playwright Test Automation Framework
 
## What this project is
 
This repository is a hands-on Playwright test automation framework, built step
by step as part of a 1-to-1 test automation course. It automates a locally-run
practice website, TradeSource — starting from its homepage and navigating
through to a Vortix Manufacturer page via the search field.
 
The goal isn't just to end up with a working test suite, but to build one
the way a professional automation engineer would: with proper version
control, a CI pipeline from day one, a clean architecture, and tests that
go beyond the basics into real-world scenarios like negative testing and
accessibility checks.
 
## What we'll be building
 
Across the course, this project will grow to include:
 
- A small set of real tests against the practice site, using Playwright's own
  recommended locator strategy (role-based locators first, test ids where they
  help)
- A CI pipeline (GitHub Actions), wired up early so every test from this
  point on is automatically verified, with the HTML report and traces
  attached to every run
- A Page Object Model architecture, wired together with Playwright fixtures,
  plus custom fixtures for cross-cutting actions like accepting the cookie
  banner and logging in
- Pull requests and code review, including a first pass from an AI coding
  assistant before human review
- Visual regression testing, catching unintended layout and styling changes
- Accessibility testing with axe, plus manual Lighthouse audits
- API testing and network interception, forcing the site into edge-case and
  negative scenarios that are hard to reach through the UI alone
- BDD with Cucumber/Gherkin, turning existing tests into plain-English
  feature files
 
## Why this matters
 
By the end, this repo is meant to stand on its own — a genuine,
portfolio-ready example of a professional test automation framework, not
just a course exercise. Every commit from here on should read like it was
written with that in mind.
 
## Getting started
 
- Language: (JavaScript or TypeScript — confirmed in Session 1)
- Install dependencies: npm install
- Install the Playwright browsers: npx playwright install
- Clone the practice site into `./tradesource-site` (git clone https://github.com/samGreenwood2022/tradesource-site.git tradesource-site) — `playwright.config.ts` starts it automatically from there (serves http://localhost:4321), or start it yourself in its own terminal with `npm start` from that folder and Playwright will reuse it
- Run the tests: npm test (or npm run test:ui for UI Mode)
- CI (GitHub Actions) checks out `tradesource-site` into the same path automatically, so no extra setup is needed there
 
## Visual regression

`tests/visual-regression.spec.ts` takes full-page screenshots of the Vortix and Halden Locks overview pages with Playwright's `toHaveScreenshot()`. Before each screenshot the page is scrolled to the bottom so lazy-loaded images load.

- Baselines live in `tests/visual-baselines/<os>/<browser>/<name>-baseline.png`, one per OS and browser.
- If a baseline is missing, the run writes it ("A snapshot doesn't exist ... writing actual") and the test passes. Later runs compare against it.
- To regenerate baselines on purpose: `npx playwright test tests/visual-regression.spec.ts --update-snapshots`
- When a comparison fails, `test-results/` and the HTML report contain `<name>-actual.png` (this run), `<name>-expected.png` (the baseline) and `<name>-diff.png` (the differences highlighted).
- All PNGs are gitignored except `tests/visual-baselines/linux/`, the baselines CI compares against. Windows/macOS baselines stay local.
- **Linux baselines for CI:** the first CI run generates them and uploads them as the `linux-visual-baselines` artifact. Download it, extract it into `tests/visual-baselines/linux/`, and commit. Failed comparisons on CI are uploaded as the `visual-diffs` artifact.
