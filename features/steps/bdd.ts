// Wires playwright-bdd's Given/When/Then up to this project's own `test` (fixture/test-options.ts),
// so step definitions get the same page-object fixtures as the hand-written specs.
import { createBdd } from 'playwright-bdd';
import { test } from '../../fixture/test-options';

export const { Given, When, Then } = createBdd(test);
export { test };
