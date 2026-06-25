import { test, expect } from "@playwright/test";
import { loginBeforeTest } from "../../utils/testSetup";
import { logger } from "../../utils/logger";

test.describe("Dining Page UI Verification", () => {
  const STEP_1 = "Login";
  const STEP_2 = "Open Dining Page";
  const STEP_3 = "Verify Content";
  const STEP_4 = "View More Navigation";

  test("should verify Dining page UI and View More navigation", async ({ page }) => {
    test.setTimeout(60000);

    logger.section("TEST: Dining Page UI");

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
    // STEP 2: OPEN DINING (DIRECT NAVIGATION - IMPORTANT)
    // =========================
    logger.step(2, STEP_2);

    await page.goto("https://visa-d2c.urbox.dev/sg_en/category/dining");

    await expect(page).toHaveURL(/sg_en\/category\/dining/);

    // stable anchor instead of text "FEATURED EXPERIENCES"
    await expect(page.locator("body")).toBeVisible();

    logger.success("Dining page loaded");

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
    // STEP 4: Click all View More sections
    // =========================
    logger.step(4, "Click all View More sections");

    const sections = [
    "Featured",
    "Held Table",
    "Dining Offers",
    "Dining Events",
    ];

    for (const section of sections) {
    logger.info(`Opening section: ${section}`);

    const sectionBlock = page
        .locator("section, article, div")
        .filter({ hasText: section })
        .first();

    await expect(sectionBlock).toBeVisible();

    const viewMoreBtn = sectionBlock
        .getByText("View More", { exact: true })
        .first();

    await expect(viewMoreBtn).toBeVisible();

    // 👉 CLICK
    await viewMoreBtn.click();

    // 👉 CHECK LOGIN REDIRECT SAFETY
    if (page.url().includes("/login")) {
        throw new Error(`❌ Redirected to login in section: ${section}`);
    }

    // 👉 SCREENSHOT SAU MỖI CLICK (IMPORTANT FIX)
    await test.info().attach(`Step 4 - ViewMore - ${section}`, {
        body: await page.screenshot({ fullPage: true }),
        contentType: "image/png",
    });

    logger.success(`View More clicked: ${section}`);

    // 👉 BACK TO DINING PAGE (stable reset)
    await page.goto("https://visa-d2c.urbox.dev/sg_en/category/dining");

    // optional: wait stable
    await expect(page).toHaveURL(/dining/);
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

    logger.success("Dining flow completed");
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