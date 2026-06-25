import { test, expect } from "@playwright/test";
import { loginBeforeTest } from "../../utils/testSetup";
import { logger } from "../../utils/logger";

test.describe("Lifestyle Page UI Verification", () => {
  const STEP_1 = "Login";
  const STEP_2 = "Open Lifestyle Page";
  const STEP_3 = "Verify Content";
  const STEP_4 = "View More Navigation";

  test("should verify Lifestyle page UI and View More navigation", async ({ page }) => {
    test.setTimeout(60000);

    logger.section("TEST: Lifestyle Page UI");

    // =========================
    // STEP 1: LOGIN
    // =========================
    logger.step(1, STEP_1);

    await page.goto("https://visa-d2c.urbox.dev");
    await loginBeforeTest(page);

    await test.info().attach("Step 1 - Login", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });

    logger.success("Login completed");

    // =========================
    // STEP 2: OPEN LIFESTYLE PAGE
    // =========================
    logger.step(2, STEP_2);

    await page.goto("https://visa-d2c.urbox.dev/sg_en/category/lifestyle");

    await expect(page).toHaveURL(/lifestyle/);

    // stable anchor
    await expect(page.locator("body")).toBeVisible();

    await test.info().attach("Step 2 - Lifestyle Page", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });

    logger.success("Lifestyle page loaded");

    // =========================
    // STEP 3: VERIFY VIEW MORE EXISTS
    // =========================
    logger.step(3, STEP_3);

    const viewMore = page.getByText("View More", { exact: true });

    const count = await viewMore.count();

    logger.info(`View More count: ${count}`);

    expect(count).toBeGreaterThan(0);

    await test.info().attach("Step 3 - Content", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });

    logger.success("Content verified");

    // =========================
    // STEP 4: CLICK ALL VIEW MORE
    // =========================
    logger.step(4, STEP_4);

    const sections = [
      "Featured",
      "Attractions & Activities",
      "Sports & Wellness",
    ];

    for (const section of sections) {
      logger.info(`Opening section: ${section}`);

      const sectionBlock = page
        .locator("section, article, div")
        .filter({ hasText: section })
        .first();

      await expect(sectionBlock).toBeVisible({ timeout: 10000 });

      const viewMoreBtn = sectionBlock
        .getByText("View More", { exact: true })
        .first();

      await expect(viewMoreBtn).toBeVisible({ timeout: 10000 });

      await viewMoreBtn.click();

      await test.info().attach(`ViewMore - ${section}`, {
        body: await page.screenshot({ fullPage: true }),
        contentType: "image/png",
      });

      // reset state
      await page.goto("https://visa-d2c.urbox.dev/sg_en/category/lifestyle");
      await expect(page).toHaveURL(/lifestyle/);
    }

    // =========================
    // FINAL VERIFY
    // =========================
    logger.step(99, "Final Verification");

    await expect(page).not.toHaveURL(/login/);

    await test.info().attach("Final State", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });

    logger.success("Lifestyle flow completed");
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (!page.isClosed()) {
      await testInfo.attach("AfterEach", {
        body: await page.screenshot({ fullPage: true }),
        contentType: "image/png",
      });
    }

    logger.info(`Status: ${testInfo.status}`);

    if (testInfo.status !== testInfo.expectedStatus) {
      logger.error(`Error: ${testInfo.error}`);
    }
  });
});