import { test, expect } from '@playwright/test';

test.describe('SauceDemo Checkout Test Suite', () => {

  test.beforeEach(async ({ page }) => {
    // 1. เข้าสู่ระบบ
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await page.screenshot({ path: 'saucedemotest/login.png' });

    // 2. เพิ่มสินค้าลงตะกร้า และกดไปที่หน้า Checkout
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();

    // รอการเปลี่ยนหน้าเสร็จสิ้นก่อนเริ่ม Test Case (แก้ไขปัญหา Timing บน Firefox/WebKit)
    await expect(page).toHaveURL(/.*checkout-step-one.html/);
    await page.screenshot({ path: 'saucedemotest/checkout_step_one.png' });
  });

  // TC-CKO-002: กรอกข้อมูลผู้สั่งซื้อด้วยข้อมูลที่ถูกต้อง
  test('TC-CKO-002: Register in Checkout page using valid inputs', async ({ page }) => {
    await page.locator('[data-test="firstName"]').fill('omar');
    await page.locator('[data-test="lastName"]').fill('abdo');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();

    await expect(page).toHaveURL(/.*checkout-step-two.html/);
    await expect(page.locator('.title')).toHaveText('Checkout: Overview');
    await page.screenshot({ path: 'saucedemotest/checkout_step_two.png' });
  });

  // TC-CKO-003: กดดำเนินการต่อโดยไม่กรอกข้อมูลบังคับ
  test('TC-CKO-003: Register in Checkout page without filling mandatory fields', async ({ page }) => {
    await page.locator('[data-test="continue"]').click();

    const errorMessage = page.locator('h3[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Error: First Name is required');
    await page.screenshot({ path: 'saucedemotest/checkout_validation_error.png' });
  });

  // TC-CKO-010: ตรวจสอบความถูกต้องของราคารวม (Item total + Tax = Total)
  test('TC-CKO-010: Verify total price is correct', async ({ page }) => {
    await page.locator('[data-test="firstName"]').fill('omar');
    await page.locator('[data-test="lastName"]').fill('abdo');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();

    // ยืนยันการเปลี่ยนหน้าไปยัง Step Two ก่อนอ่านค่าองค์ประกอบ (แก้ไข WebKit Timeout)
    await expect(page).toHaveURL(/.*checkout-step-two.html/);

    const subtotalLocator = page.locator('[data-test="subtotal-label"]');
    const taxLocator = page.locator('[data-test="tax-label"]');
    const totalLocator = page.locator('[data-test="total-label"]');

    await expect(subtotalLocator).toBeVisible();

    const subtotalText = await subtotalLocator.innerText();
    const taxText = await taxLocator.innerText();
    const totalText = await totalLocator.innerText();

    const itemTotal = parseFloat(subtotalText.replace(/[^0-9.]/g, ''));
    const tax = parseFloat(taxText.replace(/[^0-9.]/g, ''));
    const actualTotal = parseFloat(totalText.replace(/[^0-9.]/g, ''));

    const expectedTotal = parseFloat((itemTotal + tax).toFixed(2));

    expect(actualTotal).toBe(expectedTotal);
    await page.screenshot({ path: 'saucedemotest/checkout_overview.png' });
  });

});