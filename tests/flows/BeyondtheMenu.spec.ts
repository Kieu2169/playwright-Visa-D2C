import { test, expect } from "@playwright/test";
import { logger } from "../../utils/logger";
import { loginBeforeTest } from "../../utils/testSetup";

test.describe("Beyond The Menu Flow", { tag: ["@beyond-menu", "@p1"] }, () => {
  const STEP_1_INPUT = process.env.COUNTRY || "Taiwan";
  const STEP_2_INPUT = process.env.BRAND_NAME || "NOBUO";

  test("should interact with Beyond The Menu successfully", async ({ browser }) => {
    test.setTimeout(120000);

    const page = await browser.newPage();

    logger.section("TEST: Beyond The Menu Flow");

    // =========================
    // STEP 1: LOGIN REUSE
    // =========================
    logger.step(1, "Login before test (reuse login flow)");

    await loginBeforeTest(page);

    await expect(page).toHaveURL(/visa-d2c|urbox/i);

    logger.success("Login completed successfully");

    await test.info().attach("Step 1 - Login", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });

    // =========================
    // STEP 2: OPEN MENU
    // =========================
    logger.step(2, "Open menu icon");

    const menuIcon = page
      .locator("button, svg")
      .filter({ has: page.locator("svg") })
      .first();

    await expect(menuIcon).toBeVisible({ timeout: 15000 });
    await menuIcon.click();

    logger.success("Menu opened");

    await test.info().attach("Step 2 - Open Menu", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });

    // =========================
    // STEP 3: SELECT COUNTRY
    // =========================
    logger.step(3, `Select country: ${STEP_1_INPUT}`);

    const countryBtn = page.getByRole("button", { name: STEP_1_INPUT });

    await expect(countryBtn).toBeVisible();
    await countryBtn.click();

    logger.success(`Country selected: ${STEP_1_INPUT}`);

    await test.info().attach("Step 3 - Select Country", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });

    // =========================
    // STEP 4: CLICK BRAND
    // =========================
    logger.step(4, `Click brand: ${STEP_2_INPUT}`);

    const brandImg = page.getByRole("img", { name: STEP_2_INPUT });

    await expect(brandImg).toBeVisible();
    await brandImg.click();

    logger.success(`Brand clicked: ${STEP_2_INPUT}`);

    await test.info().attach("Step 4 - Click Brand", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });

    // =========================
    // STEP 5: OPEN MENU → POPUP
    // =========================
    logger.step(5, "Open Menu → handle popup");

    const popupPromise = page.waitForEvent("popup");

    const openMenuBtn = page.getByRole("button", { name: "Open Menu" });

    await expect(openMenuBtn).toBeVisible();
    await openMenuBtn.click();

    const popupPage = await popupPromise;

    await popupPage.waitForLoadState("domcontentloaded");

    logger.success("Popup opened");

    await test.info().attach("Step 5 - Popup", {
      body: await popupPage.screenshot({ fullPage: true }),
      contentType: "image/png",
    });

    // =========================
    // FINAL ASSERTION
    // =========================
    logger.info("Verifying result...");

    await expect(popupPage).toBeDefined();

    logger.success("Beyond The Menu flow completed successfully");
  });

  // =========================
  // AFTER EACH
  // =========================
  test.afterEach(async ({ page }, testInfo) => {
    if (!page.isClosed()) {
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
});