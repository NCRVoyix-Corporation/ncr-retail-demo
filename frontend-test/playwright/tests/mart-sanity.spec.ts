import { test } from '#testkit/functions/application/mart/testFixtures';
import { loadTestDataFile } from '#testkit/functions/application/mart/adapters/testData.adapter';
import * as mart from '#testkit/functions/application/mart/mart';
import { TestData } from '#testkit/types/TestData/test-data-mart';

test.beforeEach(async ({ page, retailSampleAppUrl }) => {
    await page.goto(retailSampleAppUrl);
});

test('Retail Sample App - Sanity', async ({ page }) => {
    const user = loadTestDataFile<TestData.User>('user', 'bruce.json');

    await mart.setStore(page);

    await mart.login(page, user);

    await mart.confirmLoggedIn(page, user);

    await mart.logout(page, user);

    await mart.confirmLoggedOut(page);
});
