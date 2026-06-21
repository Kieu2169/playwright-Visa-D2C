import { Page, expect } from '@playwright/test';

export class ContactUsPage {
  constructor(private page: Page) {}

  // ========================
  // USER SIDE (D2C)
  // ========================

  async openContactUs() {
    await this.page.getByRole('link', { name: 'Contact us' }).click();
  }

  async selectCategory() {
    await this.page.getByRole('button', { name: 'Select a category' }).click();
    await this.page.getByRole('button', { name: 'Account Related' }).click();
  }

  async selectIssue() {
    await this.page.getByRole('button', { name: 'Specific issue' }).click();
    await this.page.getByRole('button', { name: 'Login issues' }).click();
  }

  async fillDescription(text: string) {
    await this.page
      .getByRole('textbox', { name: /Please describe your issue/i })
      .fill(text);
  }

  async selectVisaTier() {
    await this.page.getByRole('button', { name: 'Select a Visa card tier' }).click();
    await this.page.getByRole('button', { name: 'Visa Classic' }).click();
  }

  async submitForm() {
    await this.page.getByRole('button', { name: 'Submit' }).click();
  }

  async continue() {
    await this.page.getByRole('button', { name: 'Continue' }).click();
  }

  // ========================
  // ADMIN SIDE
  // ========================

  async openAdminPortal() {
    await this.page.goto(
      'https://visa-d2c-portal.urbox.dev/login?redirectUrl=%2Fticket-management'
    );
  }

  async adminLogin(username: string, password: string) {
    await this.page.getByRole('textbox', { name: 'Username' }).fill(username);
    await this.page.getByRole('textbox', { name: 'Password' }).fill(password);
    await this.page.getByRole('button', { name: 'Sign In' }).click();
  }

  async openTicketManagement() {
    await this.page.getByRole('link', { name: 'Ticket Management' }).click();
  }

  async openLatestTicket() {
    await this.page.getByRole('cell').first().click();
  }

  async submitTicket() {
    await this.page.getByRole('button', { name: 'Submit' }).click();
  }

  async expectSuccess() {
    await expect(
      this.page.getByText('Ticket updated successfully')
    ).toBeVisible({ timeout: 10000 });
  }
}