const { test, expect } = require('@playwright/test');
const { GroupPage } = require('../pages/group.page');

function randomStr(prefix) {
  return prefix + '_' + Math.random().toString(36).slice(2, 7);
}

let createdGroupName;

test.describe('그룹 관리 CRUD', () => {

  test.beforeEach(async ({ page }) => {
    const groupPage = new GroupPage(page);
    await groupPage.goto();
  });

  test('그룹 생성 — 팝업 열기', async ({ page }) => {
    const groupPage = new GroupPage(page);
    await groupPage.openAddPopup();
    await expect(groupPage.popup).toBeVisible();
    await expect(groupPage.popupGroupName).toBeVisible();
    await expect(groupPage.popupConfirmButton).toBeVisible();
    await expect(groupPage.popupCancelButton).toBeVisible();
  });

  test('그룹 생성 — 취소 버튼', async ({ page }) => {
    const groupPage = new GroupPage(page);
    await groupPage.openAddPopup();
    await groupPage.cancelAddForm();
    await expect(groupPage.popup).not.toBeVisible();
  });

  test('그룹 생성 — 성공', async ({ page }) => {
    const groupPage = new GroupPage(page);
    const data = {
      name: randomStr('qa_group'),
      description: randomStr('qa_desc'),
      manager: 'yukorea',
      worker: 'yukorea',
    };
    await groupPage.createGroup(data);
    await expect(groupPage.table.getByRole('row').filter({ hasText: data.name })).toHaveCount(1);
    createdGroupName = data.name;
    console.log(`✅ 생성된 그룹명: ${createdGroupName}`);
  });

  test('그룹 생성 — 그룹명 필수값 검증', async ({ page }) => {
    const groupPage = new GroupPage(page);
    await groupPage.openAddPopup();
    await groupPage.popupConfirmButton.click();
    await expect(groupPage.popup).toBeVisible();
  });

  test('그룹 검색 — 존재하는 키워드', async ({ page }) => {
    const groupPage = new GroupPage(page);
    await groupPage.searchInput.fill('yukorea');
    await page.waitForTimeout(500);
    await expect(groupPage.table.getByRole('row').filter({ hasText: 'yukorea' }).first()).toBeVisible();
  });

  test('그룹 검색 — 없는 키워드', async ({ page }) => {
    const groupPage = new GroupPage(page);
    await groupPage.searchInput.fill('zzz_not_exist_xyz');
    await page.waitForTimeout(500);
    await expect(groupPage.table.getByRole('row').filter({ hasText: 'zzz_not_exist_xyz' })).toHaveCount(0);
  });

  test('그룹 삭제 — 생성된 그룹 삭제', async ({ page }) => {
    const groupPage = new GroupPage(page);
    if (!createdGroupName) {
      test.skip(true, '생성 테스트 선행 필요');
      return;
    }
    await groupPage.clickDeleteButton(createdGroupName);
    await page.waitForTimeout(500);

    const confirmDialog = page.getByRole('dialog');
    if (await confirmDialog.isVisible()) {
      await confirmDialog.getByRole('button', { name: '확인' }).last().click();
      await page.waitForTimeout(1000);
    }

    await expect(groupPage.table.getByRole('row').filter({ hasText: createdGroupName })).toHaveCount(0);
    console.log(`✅ 삭제 확인: ${createdGroupName}`);
  });

});