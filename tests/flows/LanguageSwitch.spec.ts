import { test, expect } from "@playwright/test";
import { logger } from "../../utils/logger";
import { loginBeforeTest } from "../../utils/testSetup";

test.describe("Language Switch End-to-End", () => {
  test.afterEach(async ({ page }, testInfo) => {
    if (!page.isClosed()) {
      await testInfo.attach("Final Screenshot", {
        body: await page.screenshot({ fullPage: true }),
        contentType: "image/png",
      });
    }

    logger.info(`Test status: ${testInfo.status}`);

    if (testInfo.status !== testInfo.expectedStatus) {
      logger.error(`Test failed: ${testInfo.error}`);
    }
  });

  test("switch languages continuously", async ({ page }) => {
    test.setTimeout(120000);

    logger.section("Language Switch End-to-End");

    // =========================
    // LOGIN
    // =========================
    await page.goto("https://visa-d2c.urbox.dev");
    await loginBeforeTest(page);

    logger.success("Login completed");

    // ==================================================
    // FLOW 1: Singapore EN -> Vietnam VI
    // ==================================================

    logger.section("FLOW 1: Singapore EN -> Vietnam VI");

    logger.step(1, "Open menu");
    await page.locator("#menuBtn").first().click();

    await test.info().attach("Flow1-Step1", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });

    logger.step(2, "Open Language & Location");
    await page
      .locator("div")
      .filter({ hasText: /^Language & Location$/ })
      .nth(2)
      .click();

    await test.info().attach("Flow1-Step2", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });

    logger.step(3, "Select Vietnam");
    await page.getByRole("button", { name: "Singapore" }).first().click();
    await page
      .getByRole("list")
      .getByRole("button", { name: "Vietnam" })
      .click();

    await test.info().attach("Flow1-Step3", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });

    logger.step(4, "Select Vietnamese");
    await page.getByRole("button", { name: "English" }).click();
    await page.getByRole("button", { name: "Vietnamese" }).click();

    await test.info().attach("Flow1-Step4", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });

    logger.step(5, "Save");
    await page.getByRole("button", { name: "Save" }).click();

    await expect(
      page.getByText("Ngôn ngữ & Vị trí").first()
    ).toBeVisible();

    logger.success("Vietnamese UI verified");

    // ==================================================
    // FLOW 2: Vietnam VI -> Korea KO
    // ==================================================

    logger.section("FLOW 2: Vietnam VI -> Korea KO");

    logger.step(6, "Open menu");
    await page.locator(".icon-wrap").first().click();

    await test.info().attach("Flow2-Step1", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });

    logger.step(7, "Open Ngôn ngữ & Vị trí");
    await page
      .getByRole("navigation")
      .getByText("Ngôn ngữ & Vị trí")
      .click();

    await test.info().attach("Flow2-Step2", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });

    logger.step(8, "Select South Korea");
    await page
      .getByRole("button", {
        name: "Việt Nam",
        exact: true,
      })
      .click();

    await page.getByRole("button", { name: "South Korea" }).click();

    await test.info().attach("Flow2-Step3", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });

    logger.step(9, "Select Korean");
    await page.getByRole("button", { name: "Tiếng Anh" }).click();
    await page.getByRole("button", { name: "Tiếng Hàn" }).click();

    await test.info().attach("Flow2-Step4", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });

    logger.step(10, "Save");
    await page.getByRole("button", { name: "Lưu" }).click();

    await test.info().attach("Flow2-Step5", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });

    await expect(
      page.getByText("언어 및 위치").first()
    ).toBeVisible();

    logger.success("Korean UI verified");

    // ==================================================
    // FLOW 3: Korea KO -> Japan JA
    // ==================================================

    logger.section("FLOW 3: Korea KO -> Japan JA");

    logger.step(11, "Open menu");

    await page.locator(".icon-wrap").first().click();

    await test.info().attach("Flow3-Step1", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });

    logger.step(12, "Open 언어 및 위치");

    await page
      .getByRole("navigation")
      .getByText("언어 및 위치")
      .click();

    await test.info().attach("Flow3-Step2", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });

    logger.step(13, "Change country from South Korea to Japan");

    await page
      .getByRole("button", {
        name: "South Korea",
        exact: true,
      })
      .click();

    await page.getByRole("button", { name: "일본" }).click();

    await test.info().attach("Flow3-Step3", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });

    logger.success("Country changed to Japan");

    logger.step(14, "Change language from English to Japanese");

    await page.getByRole("button", { name: "English" }).click();

    await page.getByRole("button", { name: "Japanese" }).click();

    await test.info().attach("Flow3-Step4", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });

    logger.success("Language changed to Japanese");

    logger.step(15, "Save language settings");

    await page.getByRole("button", { name: "Save" }).click();

    await page.waitForTimeout(3000);

    console.log(
      await page.locator("body").innerText()
    );

    await test.info().attach("Flow3-Step5", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });

    logger.success("Language settings saved");

    logger.step(16, "Verify Japanese UI");

    await expect(
      page.getByText("言語＆地域").first()
    ).toBeVisible();

    logger.success("Japanese UI verified");

    // ==================================================
    // FLOW 4: Japan JA -> Indonesia ID
    // ==================================================

    logger.section("FLOW 4: Japan JA -> Indonesia ID");

    logger.step(17, "Open menu");

    await page.locator(".icon-wrap").first().click();

    await test.info().attach("Flow4-Step1", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });

    logger.step(18, "Open 言語＆地域");

    await page
      .locator("div")
      .filter({ hasText: /^言語＆地域$/ })
      .nth(2)
      .click();

    await test.info().attach("Flow4-Step2", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });

    logger.success("Language settings opened");

    logger.step(19, "Change country from Japan to Indonesia");

    await page
      .getByRole("button", {
        name: "日本",
        exact: true,
      })
      .click();

    await page.getByRole("button", { name: "インドネシア" }).click();

    await test.info().attach("Flow4-Step3", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });

    logger.success("Country changed to Indonesia");

    logger.step(20, "Change language from English to Indonesian");

    await page.getByRole("button", { name: "English" }).click();

    await page.getByRole("button", { name: "Indonesian" }).click();

    await test.info().attach("Flow4-Step4", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });

    logger.success("Language changed to Indonesian");

    logger.step(21, "Save language settings");

    await page.getByRole("button", { name: "Save" }).click();

    await test.info().attach("Flow4-Step5", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });

    logger.success("Language settings saved");

    logger.step(22, "Verify Indonesian locale");

    await expect(page).toHaveURL(/\/id_id\//);

    await test.info().attach("Flow4-Step6", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });

    logger.success("Indonesian locale verified");

});
});