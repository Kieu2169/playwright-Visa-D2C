import { Auth } from './auth';
import { Page } from '@playwright/test';

export async function loginBeforeTest(page: Page) {
  const auth = new Auth(page);

  await auth.login(
    'vokieu060921@gmail.com',
    'Kieu@12345678'
  );
}