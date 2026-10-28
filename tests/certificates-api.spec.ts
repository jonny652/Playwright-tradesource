import { test, expect } from '../fixture/test-options';

const originalTitle = 'Commercial Cleaning Equipment Safety Certificate';
const renamedTitle = 'Renamed Test Certificate';

//Navigate to the Vortix manufacturer page, each test intercepts the API before clicking the certificates tab.
//Overlays are switched off because these tests are about the API, not the pop-ups
test.beforeEach('navigate to the Vortix manufacturer page', async ({ manufacturerHomepage }) => {
  await manufacturerHomepage.disableOverlays();
  await manufacturerHomepage.gotoManufacturerHomepage();
});

//01 verify a renamed certificate title from the API is displayed
test('verify a renamed certificate title is displayed', async ({ certificatesPage }) => {
  await certificatesPage.interceptCertificates(async (route) => {
    const response = await route.fetch();
    const json = await response.json();
    json[0].data.certifications.byBrandId.paginatedResponse.items[0].name = renamedTitle;
    await route.fulfill({ response, json });
  });
  await certificatesPage.clickCertificatesTab();

  await expect(certificatesPage.certificateTitles.first()).toHaveText(renamedTitle);
  await expect(certificatesPage.certificateTitles.filter({ hasText: originalTitle })).toHaveCount(0);
});

//02 verify the no results message is displayed when the API returns no certificates
test('verify no results message is displayed when there are no certificates', async ({ certificatesPage }) => {
  await certificatesPage.interceptCertificates(async (route) => {
    const response = await route.fetch();
    const json = await response.json();
    json[0].data.certifications.byBrandId.paginatedResponse.items = [];
    json[0].data.certifications.byBrandId.paginatedResponse.totalItems = 0;
    await route.fulfill({ response, json });
  });
  await certificatesPage.clickCertificatesTab();

  await expect(certificatesPage.noResultsMessage).toBeVisible();
  await expect(certificatesPage.noResultsMessage).toContainText('Sorry, no results were found');
  await expect(certificatesPage.certificateTitles).toHaveCount(0);
});

//03 verify nothing is displayed when the API returns a 500 error
test('verify nothing is displayed when the API returns a 500 error', async ({ certificatesPage }) => {
  await certificatesPage.interceptCertificates(async (route) => {
    await route.fulfill({ status: 500 });
  });
  await certificatesPage.clickCertificatesTab();
  await certificatesPage.waitForCertificatesToLoad();

  await expect(certificatesPage.resultWrapper).toHaveCount(0);
  await expect(certificatesPage.certificateTitles).toHaveCount(0);
  await expect(certificatesPage.noResultsMessage).toHaveCount(0);
});

//04 verify nothing is displayed when the API connection is dropped
test('verify nothing is displayed when the connection is dropped', async ({ certificatesPage }) => {
  await certificatesPage.interceptCertificates(async (route) => {
    await route.abort('connectionfailed');
  });
  await certificatesPage.clickCertificatesTab();
  await certificatesPage.waitForCertificatesToLoad();

  await expect(certificatesPage.resultWrapper).toHaveCount(0);
  await expect(certificatesPage.certificateTitles).toHaveCount(0);
  await expect(certificatesPage.noResultsMessage).toHaveCount(0);
});

//05 verify certificates are still displayed when the API response is slow
test('verify certificates are displayed during a slow network response', async ({ certificatesPage }) => {
  await certificatesPage.interceptCertificates(async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await route.continue();
  });
  await certificatesPage.clickCertificatesTab();

  await expect(certificatesPage.loadingMessage).toBeVisible();
  await expect(certificatesPage.certificateTitles).toHaveCount(3, { timeout: 10000 });
  await expect(certificatesPage.certificateTitles.first()).toHaveText(originalTitle);
});
