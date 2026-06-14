import { test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test.setTimeout(50000);

test('Login with registered email', async ({ browser }) => {
  const page = await browser.newPage();

  const login = new LoginPage(page);

  console.log('Open Login');
  await login.open();

  console.log('Login');
  await login.login(
    'vokieu060921@gmail.com',
    'Kieu@12345678'
  );
});