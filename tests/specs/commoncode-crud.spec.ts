const { test, expect } = require('@playwright/test');
const { CommonCodePage } = require('../pages/commoncode.page');

let createdCode;

test.describe('공통코드 관리 CRUD', () => {

  test.beforeEach(async ({ page }) => {
    const commonCodePage = new CommonCodePage(page);
    await commonCodePage.goto();
  });

  test('공통코드 생성 — 팝업 열기', async ({ page }) => {
    const commonCodePage = new CommonCodePage(page);
    await commonCodePage.openAddPopup();
    await expect(commonCodePage.popup).toBeVisible();
    await expect(commonCodePage.popupCode).toBeVisible();
    await expect(commonCodePage.popupName).toBeVisible();
    await expect(commonCodePage.popupConfirmButton).toBeVisible();
    await expect(commonCodePage.popupCancelButton).toBeVisible();
  });

  test('공통코드 생성 — 취소 버튼', async ({ page }) => {
    const commonCodePage = new CommonCodePage(page);
    await commonCodePage.openAddPopup();
    await commonCodePage.cancelAddForm();
    await expect(commonCodePage.popup).not.toBeVisible();
  });

  test('공통코드 생성 — 성공', async ({ page }) => {
    const commonCodePage = new CommonCodePage(page);
    const data = {
      code: 'qa' + Date.now().toString().slice(-4),
      name: 'qa_test_code',
    };
    await commonCodePage.createCode(data);
    await expect(commonCodePage.table.getByRole('row').filter({ hasText: data.code })).toHaveCount(1);
    createdCode = data.code;
    console.log(`✅ 생성된 코드: ${createdCode}`);
  });

  test('공통코드 생성 — 코드 필수값 검증', async ({ page }) => {
    const commonCodePage = new CommonCodePage(page);
    await commonCodePage.openAddPopup();
    await commonCodePage.popupConfirmButton.click();
    await expect(commonCodePage.popup).toBeVisible();
  });

  test('공통코드 검색 — 존재하는 키워드', async ({ page }) => {
    const commonCodePage = new CommonCodePage(page);
    await commonCodePage.searchInput.fill('시스템');
    await page.waitForTimeout(500);
    await expect(commonCodePage.table.getByRole('row').filter({ hasText: '시스템' }).first()).toBeVisible();
  });

  test('공통코드 검색 — 없는 키워드', async ({ page }) => {
    const commonCodePage = new CommonCodePage(page);
    await commonCodePage.searchInput.fill('zzz_not_exist_xyz');
    await page.waitForTimeout(500);
    await expect(commonCodePage.table.getByRole('row').filter({ hasText: 'zzz_not_exist_xyz' })).toHaveCount(0);
  });

  test('공통코드 삭제 — 생성된 코드 삭제', async ({ page }) => {
    const commonCodePage = new CommonCodePage(page);
    if (!createdCode) {
      test.skip(true, '생성 테스트 선행 필요');
      return;
    }
    await commonCodePage.clickDeleteButton(createdCode);
    await page.waitForTimeout(500);

    const confirmDialog = page.getByRole('dialog');
    if (await confirmDialog.isVisible()) {
      await confirmDialog.getByRole('button', { name: '확인' }).last().click();
      await page.waitForTimeout(1000);
    }

    await expect(commonCodePage.table.getByRole('row').filter({ hasText: createdCode })).toHaveCount(0);
    console.log(`✅ 삭제 확인: ${createdCode}`);
  });

});