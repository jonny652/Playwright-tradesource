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

## product.json

One entry per product. Used to drive `tests/product.spec.ts` (one `describe` block per entry).
Only `name` and `urlPath` are required - every other field is optional and its corresponding
test is skipped when the field is absent, same convention as `manufacturers.json`.

| Field              | Meaning                                                                      |
|--------------------|-------------------------------------------------------------------------------|
| `name`             | Product name, expected as the page's `h1` heading text (and image alt text) |
| `urlPath`          | Path (appended to the base URL) of the product's detail page                |
| `manufacturerName` | Expected text of the "By &lt;Manufacturer&gt;" link                         |
| `manufacturerHref` | Expected `href` of the manufacturer link                                    |
| `description`      | Expected text of the product description paragraph                          |
| `imageSrc`         | Expected `src` attribute of the product image                               |
| `specs`            | Array of `[label, value]` pairs, one per specification table row            |
| `breadcrumbs`      | Ordered array of `{ text, href }`, one per breadcrumb link - on a product page the last entry is also a real link, unlike on category pages |

`slug`, `id` and `listingId` are also present per entry (they make up `urlPath`) but aren't
asserted directly by any test.
