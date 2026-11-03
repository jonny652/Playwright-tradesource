// Creates the Given/When/Then functions used by every step file.
// Built from our shared `test`, so steps get the same fixtures as normal specs (page, basePage, ctx, ...).
import { createBdd } from 'playwright-bdd';
import { test } from '../../fixture/test-options';

export const { Given, When, Then } = createBdd(test);
export { test };
