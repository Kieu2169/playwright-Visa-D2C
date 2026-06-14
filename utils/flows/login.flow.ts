import { LoginPage } from '../../pages/LoginPage';

export async function loginFlow(page, email, password) {
  const login = new LoginPage(page);

  await login.open();
  await login.login(email, password);
}