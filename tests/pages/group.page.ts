class GroupPage {
  constructor(page) {
    this.page = page;
    this.addButton          = page.locator('button.mud-icon-button.mud-button-outlined-secondary');
    this.searchInput        = page.getByRole('textbox').first();
    this.table              = page.getByRole('table');
    this.popup              = page.getByRole('dialog');
    this.popupGroupName     = this.popup.locator('input[type="text"]').nth(0);
    this.popupDescription   = this.popup.locator('input[type="text"]').nth(1);
    this.popupManager       = this.popup.locator('input.mud-select-input').nth(0);
    this.popupWorker        = this.popup.locator('input.mud-select-input').nth(1);
    this.popupConfirmButton = this.popup.locator('button.mud-button-filled-primary');
    this.popupCancelButton  = this.popup.getByRole('button', { name: '취소' });
  }

  async goto() {
    await this.page.goto('/group');
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

  async selectDropdownItem(input, keyword) {
    await input.fill(keyword);
    await this.page.waitForTimeout(500);
    await this.page.locator('.mud-list-item-clickable').filter({ hasText: keyword }).first().click();
    await this.page.waitForTimeout(300);
  }

  async fillAddForm(data) {
    await this.popupGroupName.fill(data.name);
    await this.popupDescription.fill(data.description);
    await this.selectDropdownItem(this.popupManager, data.manager);
    await this.selectDropdownItem(this.popupWorker, data.worker);
  }

  async submitAddForm() {
    await this.popupConfirmButton.click();
    await this.popup.waitFor({ state: 'hidden', timeout: 5_000 });
  }

  async createGroup(data) {
    await this.openAddPopup();
    await this.fillAddForm(data);
    await this.submitAddForm();
  }

  getRowByName(groupName) {
    return this.table.getByRole('row').filter({ hasText: groupName });
  }

  async clickDeleteButton(groupName) {
    const row = this.getRowByName(groupName);
    await row.locator('button').nth(1).click();
    await this.page.waitForTimeout(500);
  }
}

module.exports = { GroupPage };