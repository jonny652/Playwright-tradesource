import { createBdd } from 'playwright-bdd';
import { test } from '../../fixture/test-options';

export const { Given, When, Then } = createBdd(test);
export { test };
