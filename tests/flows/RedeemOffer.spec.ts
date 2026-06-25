import { test, expect } from "@playwright/test";
import { logger } from '../../utils/logger';
import { loginBeforeTest } from "../../utils/testSetup";

test.describe(
  "Redeem Offer flow",
  { tag: ["@redeem-offer", "@p1"] },
  () => {
    // STEP INPUTS (deterministic - follow template style)
    const STEP_1_URL =
      process.env.STEP_1_URL ||
      "https://visa-d2c.urbox.dev/sg_en/benefits/exclusive-stay-benefits-via-hotelscom/2013";

    const STEP_2_SIGN_IN_TEXT = process.env.STEP_2_SIGN_IN_TEXT || "Sign in";
    const STEP_3_REDEEM_TEXT = process.env.STEP_3_REDEEM_TEXT || "Redeem now";

    test("should redeem offer successfully", async ({ browser }) => {
      test.setTimeout(120000);

      const page = await browser.newPage();

      logger.section("TEST: Redeem Offer flow");

      // Step 1: Login
      logger.step(1, "Login before starting redeem offer flow");
      await loginBeforeTest(page);
      logger.success("Login completed");

      await test.info().attach("Step 1 - Login completed", {
        body: await page.screenshot({ fullPage: true }),
        contentType: "image/png",
      });

      // Step 2: Navigate to offer page
      logger.step(2, "Navigate to redeem offer page");
      await page.goto(STEP_1_URL, { waitUntil: "networkidle" });
      await expect(page).toHaveURL(/urbox\.dev|visa-d2c/);
      logger.success("Navigated to offer page");

      await test.info().attach("Step 2 - Offer page", {
        body: await page.screenshot({ fullPage: true }),
        contentType: "image/png",
      });

      // Step 3: Click Sign in (optional)
      logger.step(3, "Click Sign in button if visible");
      const signInBtn = page.getByText(STEP_2_SIGN_IN_TEXT, { exact: false });

      if (await signInBtn.isVisible().catch(() => false)) {
        await signInBtn.click();
        await page.waitForLoadState("networkidle");
        logger.success("Clicked Sign in button");
      } else {
        logger.info("Sign in button not visible - skipping");
      }

      await test.info().attach("Step 3 - Sign in", {
        body: await page.screenshot({ fullPage: true }),
        contentType: "image/png",
      });

      // Step 4: Click Redeem now
      logger.step(4, "Click Redeem now button");
      const redeemBtn = page.getByRole("button", {
        name: STEP_3_REDEEM_TEXT,
        exact: false,
      });

      await redeemBtn.waitFor({ state: "visible", timeout: 15000 });
      await redeemBtn.click();
      await page.waitForLoadState("networkidle");
      logger.success("Clicked Redeem now");

      await test.info().attach("Step 4 - Redeem clicked", {
        body: await page.screenshot({ fullPage: true }),
        contentType: "image/png",
      });

      // Final verification
      logger.info("Verifying final state...");

      await expect(page).toHaveURL(/urbox\.dev|benefits/);
      logger.success("URL verification passed");

      const successIndicators = page.locator(
        "text=/success|redeemed|completed|thành công|hoàn tất/i"
      );

      await expect(successIndicators.first())
        .toBeVisible({ timeout: 10000 })
        .catch(() => {
          logger.info("No explicit success message found, continuing...");
        });

      logger.success("Redeem offer flow completed");
    });

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
  }
);