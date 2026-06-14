import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async open() {
    await this.page.goto(
      'https://visa-d2c.urbox.dev/sg_en/login'
    );

    const acceptBtn = this.page.getByRole('button', { name: 'Accept' });

if (await acceptBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
  await acceptBtn.click();
}
  }

  async login(email: string, password: string) {
    await this.page
      .getByRole('textbox', { name: 'Email address' })
      .fill(email);

    await this.page.locator('#password').fill(password);

    await this.page
      .getByRole('button', { name: 'Sign in' })
      .click();

    // ✅ STABLE LOGIN SIGNAL (NOT UI ICON)
    await this.page.waitForResponse(res =>
      res.url().includes('/me') || res.url().includes('/user')
    ).catch(() => {});

    await this.page.waitForLoadState('networkidle');
  }
}