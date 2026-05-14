class CommonCodePage {
  constructor(page) {
    this.page = page;
    this.addButton          = page.locator('button.mud-icon-button.mud-button-outlined-secondary');
    this.searchInput        = page.getByRole('textbox').first();
    this.table              = page.getByRole('table');
    this.popup              = page.getByRole('dialog');
    // :not([readonly]) — 상위코드 필드는 readonly라 제외
    // nth(0) 코드, nth(2) 이름 (nth(1)은 hidden input)
    this.popupCode          = this.popup.locator('input[type="text"]:not([readonly])').nth(0);
    this.popupName          = this.popup.locator('input[type="text"]:not([readonly])').nth(2);
    this.popupConfirmButton = this.popup.getByRole('button', { name: '확인' });
    this.popupCancelButton  = this.popup.getByRole('button', { name: '취소' });
  }

  async goto() {
    await this.page.goto('/commoncode');
    await this.page.waitForTimeout(1000);

    const passwordInput = this.page.locator('input[type="password"]');
    if (await passwordInput.isVisible()) {
      const { TEST_ACCOUNTS } = require('../fixtures/test-data');
      await this.page.locator('input[type="text"]').first().fill(TEST_ACCOUNTS.admin.id);
      await passwordInput.fill(TEST_ACCOUNTS.admin.password);
      await this.page.getByRole('button', { name: '로그인' }).click();
      await this.page.waitForTimeout(2000);
    }

    await this.table.waitFor({ state: 'visible', timeout: 15_000 });
  }

  async openAddPopup() {
    await this.addButton.click();
    await this.popup.waitFor({ state: 'visible', timeout: 5_000 });
  }

  async cancelAddForm() {
    await this.popupCancelButton.click();
    await this.popup.waitFor({ state: 'hidden', timeout: 5_000 });
  }

  async fillAddForm(data) {
    await this.popupCode.fill(data.code);
    await this.popupName.fill(data.name);
  }

  async submitAddForm() {
    await this.popupConfirmButton.click();
    await this.popup.waitFor({ state: 'hidden', timeout: 5_000 });
  }

  async createCode(data) {
    await this.openAddPopup();
    await this.fillAddForm(data);
    await this.submitAddForm();
  }

  getRowByCode(code) {
    return this.table.getByRole('row').filter({ hasText: code });
  }

  async clickDeleteButton(code) {
    const row = this.getRowByCode(code);
    await row.locator('button').last().click();
    await this.page.waitForTimeout(500);
  }
}

module.exports = { CommonCodePage };