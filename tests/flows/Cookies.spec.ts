import { test, expect } from "@playwright/test";
import { logger } from "../../utils/logger";
import { loginBeforeTest } from "../../utils/testSetup";

test.describe("Cookie Policy Flow", { tag: ["@cookies", "@p1"] }, () => {
  test.setTimeout(120000);

  // =========================
  // STEP INPUTS (deterministic)
  // =========================
  const STEP_1_URL = process.env.STEP_1_INPUT || /visa-d2c|urbox/i;

  const STEP_2_COOKIE_POLICY = "Cookie Policy";
  const STEP_3_STRICT = "Strictly necessary";
  const STEP_4_SITE_EXPERIENCE = "Consent for: Site experience";
  const STEP_4_PERFORMANCE = "Consent for: Performance and";
  const STEP_4_MARKETING = "Consent for: Marketing";
  const STEP_5_COOKIE_NOTICE = "Cookie Notice";
  const STEP_5_SITE_TAB = "Site experience";
  const STEP_6_SAVE = "Save and close";

  // =========================
  // AFTER EACH
  // =========================
  test.afterEach(async ({ page }, testInfo) => {
    if (page && !page.isClosed()) {
      await testInfo.attach("Final State", {
        body: await page.screenshot({ fullPage: true }),
        contentType: "image/png",
      });
    }

    logger.info(`Test status: ${testInfo.status}`);

    if (testInfo.status !== testInfo.expectedStatus) {
      logger.error(`Test failed: ${testInfo.error}`);
    }
  });

  test("should update cookie preferences successfully", async ({ browser }) => {
    const page = await browser.newPage();

    logger.section("TEST: Cookie Policy Flow");

    // =========================
    // STEP 1 - LOGIN
    // =========================
    logger.step(1, "Login before test");
    await loginBeforeTest(page);

    await expect(page).toHaveURL(/visa-d2c|urbox/i);

    await test.info().attach("Step 1 - Login", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });

    logger.success("Login completed");

    // =========================
    // STEP 2 - OPEN COOKIE POLICY
    // =========================
    logger.step(2, "Open Cookie Policy");

    const cookiePolicyLink = page.getByRole("link", {
      name: STEP_2_COOKIE_POLICY,
    });

    await expect(cookiePolicyLink).toBeVisible();
    await cookiePolicyLink.click();

    await test.info().attach("Step 2 - Cookie Policy", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });

    logger.success("Cookie Policy opened");

    // =========================
    // STEP 3 - STRICTLY NECESSARY
    // =========================
    logger.step(3, "Select Strictly necessary");

    const strictBtn = page.getByRole("button", {
      name: STEP_3_STRICT,
    });

    await expect(strictBtn).toBeVisible();
    await strictBtn.click();

    await test.info().attach("Step 3 - Strictly necessary", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });

    logger.success("Strictly necessary selected");

    // =========================
    // STEP 4 - CONSENT OPTIONS
    // =========================
    logger.step(4, "Toggle consent options");

    const siteExperience = page.locator("label").filter({
      hasText: STEP_4_SITE_EXPERIENCE,
    });

    const performance = page.locator("label").filter({
      hasText: STEP_4_PERFORMANCE,
    });

    const marketing = page.locator("label").filter({
      hasText: STEP_4_MARKETING,
    });

    await siteExperience.click();
    await performance.click();
    await marketing.click();

    await test.info().attach("Step 4 - Consent Options", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });

    logger.success("Consent toggles updated");

    // =========================
    // STEP 5 - COOKIE NOTICE TABS
    // =========================
    logger.step(5, "Open cookie category tabs");

    await page.getByRole("button", { name: STEP_5_COOKIE_NOTICE }).click();
    await page.getByRole("button", { name: STEP_5_SITE_TAB }).click();

    await test.info().attach("Step 5 - Cookie Tabs", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });

    logger.success("Cookie tabs opened");

    // =========================
    // STEP 6 - SAVE SETTINGS
    // =========================
    logger.step(6, "Save and close");

    const saveBtn = page.getByRole("button", {
      name: STEP_6_SAVE,
    });

    await expect(saveBtn).toBeVisible();
    await saveBtn.click();

    await test.info().attach("Step 6 - Save", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });

    logger.success("Cookie settings saved");

    // =========================
    // FINAL ASSERTION
    // =========================
    logger.info("Verifying cookie flow completed...");

    await expect(page).toHaveURL(/visa-d2c|urbox/i);

    logger.success("Cookie Policy flow completed successfully");
  });
});