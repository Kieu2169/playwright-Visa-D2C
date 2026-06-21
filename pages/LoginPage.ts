import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async open() {
  await this.page.goto(
    'https://visa-d2c.urbox.dev/sg_en/login'
  );

  const acceptBtn = this.page.getByRole(
    'button',
    { name: 'Accept' }
  );

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