class LoginPage {
  constructor(page) {
    this.page = page;
    this.idInput       = page.locator('input[type="text"]').first();
    this.passwordInput = page.locator('input[type="password"]');
    this.submitButton  = page.getByRole('button', { name: '로그인' });
  }

  async goto() {
    await this.page.goto('/worker');
    await this.idInput.waitFor({ state: 'visible', timeout: 10_000 });
  }

  async login(id, password) {
    await this.idInput.fill(id);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
    await this.page.waitForTimeout(2000);
  }
}

module.exports = { LoginPage };