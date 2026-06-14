import { Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

export class Auth {
  constructor(private page: Page) {}

  async login(email: string, password: string) {
    const login = new LoginPage(this.page);

    await login.open();
    await login.login(email, password);

    await this.page.waitForLoadState('networkidle');
  }
}