const { test, expect } = require('@playwright/test');
const { WorkerPage } = require('../pages/worker.page');
const { WORKER_DATA } = require('../fixtures/test-data');

let createdWorkerId;

test.describe('작업자 관리 CRUD', () => {

  test.beforeEach(async ({ page }) => {
    const workerPage = new WorkerPage(page);
    await workerPage.goto();
  });

  // ── 작업자 생성 ──
  test('작업자 생성 — 팝업 열기', async ({ page }) => {
    const workerPage = new WorkerPage(page);
    await workerPage.openAddPopup();
    await expect(workerPage.popup).toBeVisible();
    await expect(workerPage.popupConfirmButton).toBeVisible();
    await expect(workerPage.popupCancelButton).toBeVisible();
  });

  test('작업자 생성 — 취소 버튼', async ({ page }) => {
    const workerPage = new WorkerPage(page);
    await workerPage.openAddPopup();
    await workerPage.cancelAddForm();
    await expect(workerPage.popup).not.toBeVisible();
  });

  test('작업자 생성 — 성공', async ({ page }) => {
    const workerPage = new WorkerPage(page);
    const data = WORKER_DATA.create;
    await workerPage.createWorker(data);
    await expect(workerPage.table.getByRole('row').filter({ hasText: data.id })).toHaveCount(1);
    createdWorkerId = data.id;
    console.log(`✅ 생성된 작업자 ID: ${createdWorkerId}`);
  });

  test('작업자 생성 — 아이디 필수값 검증', async ({ page }) => {
    const workerPage = new WorkerPage(page);
    await workerPage.openAddPopup();
    await workerPage.popupConfirmButton.click();
    await expect(workerPage.popup).toBeVisible();
  });

  // ── 검색 ──
  test('작업자 검색 — 존재하는 키워드', async ({ page }) => {
    const workerPage = new WorkerPage(page);
    await workerPage.search('cslee01');
    await expect(workerPage.table.getByRole('row').filter({ hasText: 'cslee01' })).toHaveCount(1);
  });

  test('작업자 검색 — 없는 키워드', async ({ page }) => {
    const workerPage = new WorkerPage(page);
    await workerPage.search(WORKER_DATA.search.notExist);
    await expect(workerPage.table.getByRole('row').filter({ hasText: WORKER_DATA.search.notExist })).toHaveCount(0);
  });

  test('작업자 검색 — 초기화', async ({ page }) => {
    const workerPage = new WorkerPage(page);
    await workerPage.search('cslee01');
    await workerPage.clearSearch();
    await expect(workerPage.table.getByRole('row').filter({ hasText: 'cslee01' })).toHaveCount(1);
  });

  // ── 수정 ──
  test('작업자 수정 — 팝업 열림 확인', async ({ page }) => {
    const workerPage = new WorkerPage(page);
    await workerPage.clickEditButton('cslee01');
    await expect(workerPage.popup).toBeVisible();
    await expect(workerPage.popup.locator('input').first()).toBeVisible();
  });

  // ── 삭제 ──
  test('작업자 삭제 — 생성된 작업자 삭제', async ({ page }) => {
    const workerPage = new WorkerPage(page);
    if (!createdWorkerId) {
      test.skip(true, '생성 테스트 선행 필요');
      return;
    }
    await workerPage.clickDeleteButton(createdWorkerId);
    const confirmDialog = page.getByRole('dialog');
    if (await confirmDialog.isVisible()) {
      await confirmDialog.locator('button.mud-button-filled-primary').click();
      await page.waitForTimeout(1000);
    }
    await expect(workerPage.table.getByRole('row').filter({ hasText: createdWorkerId })).toHaveCount(0);
  });

  // ── 승인상태 ──
  test('승인상태 — yukorea 승인완료 확인', async ({ page }) => {
    const workerPage = new WorkerPage(page);
    const status = await workerPage.getApprovalStatus('yukorea');
    expect(status).toBe('승인완료');
  });

});