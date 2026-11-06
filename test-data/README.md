# Test data

JSON doesn't support comments, so field notes for `manufacturers.json` live here instead.

## manufacturers.json

One entry per manufacturer. Used to drive `tests/functional.spec.ts` (one `describe` block per
entry) and `features/manufacturer.steps.ts` (looked up by `name`).

| Field         | Meaning                                                                 |
|---------------|--------------------------------------------------------------------------|
| `name`        | Manufacturer name, expected as the page's `h1` heading text             |
| `urlPath`     | Path (appended to the base URL) of the manufacturer's overview page     |
| `tagline`     | Expected text of the tagline paragraph under the `h1` heading           |
| `websiteHref` | Expected `href` of the manufacturer's "Website" link                    |

To add a new manufacturer, add another object with these four fields - no code changes needed.
