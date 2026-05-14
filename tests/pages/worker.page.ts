class WorkerPage {
  constructor(page) {
    this.page = page;
    this.addButton          = page.locator('button.mud-icon-button.mud-button-outlined-secondary');
    this.searchInput        = page.getByRole('textbox').first();
    this.table              = page.getByRole('table');
    this.popup              = page.getByRole('dialog');
    this.popupIdInput       = this.popup.locator('input').nth(0);
    this.popupPasswordInput = this.popup.locator('input').nth(1);
    this.popupNameInput     = this.popup.locator('input[type="text"]').nth(1);
    this.popupConfirmButton = this.popup.locator('button.mud-button-filled-primary');
    this.popupCancelButton  = this.popup.getByRole('button', { name: '취소' });
  }

  async goto() {
    await this.page.goto('/worker');
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

  async fillAddForm(data) {
    await this.popupIdInput.fill(data.id);
    await this.popup.locator('button.mud-button-outlined-default').first().click();
    await this.page.waitForTimeout(500);
    await this.popupPasswordInput.fill(data.password);
    if (data.name) await this.popupNameInput.fill(data.name);
  }

  async submitAddForm() {
    await this.popupConfirmButton.click();
    await this.popup.waitFor({ state: 'hidden', timeout: 5_000 });
  }

  async cancelAddForm() {
    await this.popupCancelButton.click();
    await this.popup.waitFor({ state: 'hidden', timeout: 5_000 });
  }

  async createWorker(data) {
    await this.openAddPopup();
    await this.fillAddForm(data);
    await this.submitAddForm();
  }

  async search(keyword) {
    await this.searchInput.fill(keyword);
    await this.page.waitForTimeout(500);
  }

  async clearSearch() {
    await this.searchInput.clear();
    await this.page.waitForTimeout(500);
  }

  getRowById(workerId) {
    return this.table.getByRole('row').filter({ hasText: workerId });
  }

  async expectWorkerExists(workerId) {
    const { expect } = require('@playwright/test');
    await expect(this.getRowById(workerId)).toBeVisible();
  }

  async expectWorkerNotExists(workerId) {
    const { expect } = require('@playwright/test');
    await expect(this.getRowById(workerId)).not.toBeVisible();
  }

  async clickEditButton(workerId) {
    const row = this.getRowById(workerId);
    await row.getByRole('button').first().click();
    await this.popup.waitFor({ state: 'visible', timeout: 5_000 });
  }

  async clickDeleteButton(workerId) {
    const row = this.getRowById(workerId);
    await row.locator('button').nth(1).click();
    await this.page.waitForTimeout(500);
  }

  async getApprovalStatus(workerId) {
    const row = this.getRowById(workerId);
    const cell = row.getByRole('cell').nth(2);
    return await cell.innerText();
  }
}

module.exports = { WorkerPage };