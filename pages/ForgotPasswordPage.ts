import { Page, expect } from '@playwright/test';

export class ForgotPasswordPage {
  constructor(private page: Page) {}

  async open(url: string) {
    await this.page.goto(url, {
      waitUntil: 'networkidle',
    });

    const acceptBtn = this.page.getByRole('button', {
      name: 'Accept',
    });

    try {
      await acceptBtn.waitFor({
        state: 'visible',
        timeout: 10000,
      });

      await acceptBtn.click();
      await this.page.waitForTimeout(1000);
    } catch {
      console.log('Cookie banner not shown');
    }

    await expect(this.page).toHaveURL(/login/i);
  }

  async openForgotPassword() {
    await this.page
      .getByRole('button', {
        name: 'Forgot your password?',
      })
      .click();

    const emailInput = this.page.locator('#email');

    await expect(emailInput).toBeVisible();
    await expect(emailInput).toBeEditable();

    // đợi form render xong
    await this.page.waitForTimeout(500);
  }

  async submitEmail(email: string) {
    const emailInput = this.page.locator('#email');

    await expect(emailInput).toBeVisible();
    await expect(emailInput).toBeEditable();

    await emailInput.click();
    await emailInput.clear();

    // nhập như người dùng
    await emailInput.pressSequentially(email);

    // trigger validation
    await emailInput.blur();

    await expect(emailInput).toHaveValue(email);

    const submitBtn = this.page.getByRole('button', {
      name: 'Submit',
    });

    await expect(submitBtn).toBeEnabled({
      timeout: 10000,
    });

    await submitBtn.click();
  }

  async enterNewPassword(password: string) {
    await this.page.locator('#password').fill(password);

    await this.page
      .locator('#confirmPassword')
      .fill(password);

    await this.page
      .getByRole('button', {
        name: 'Continue',
      })
      .click();
  }

  async enterOtp(otp: string) {
    await this.page
      .getByRole('textbox', {
        name: /OTP digit 1/i,
      })
      .fill(otp);
  }

  async verifyOtp() {
    await this.page
      .getByRole('button', {
        name: 'Verify',
      })
      .click();
  }

  async finish() {
    await this.page
      .getByRole('button', {
        name: 'Continue',
      })
      .click();
  }
}