import { test, expect } from '@playwright/test';

test.describe('Coffee Cart - ECommerce Price Calculation Test Suite', () => {

  test.beforeEach(async ({ page }) => {
    // 1. เข้าสู่หน้าเว็บ Coffee Cart
    await page.goto('https://seleniumbase.io/coffee/');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'coffeetest/coffee_cart_homepage.png' });
  });

  // Coffee_001: ตรวจสอบราคารวมเมื่อซื้อกาแฟ 1 แก้ว (Cafe Latte)
  test('Coffee_001: Verify the total price once buy one coffee', async ({ page }) => {
    await page.locator('[data-test="Cafe_Latte"]').click();
    await page.locator('[aria-label="Cart page"]').click();
    await expect(page).toHaveURL(/.*cart/);

    const checkoutBtn = page.locator('[data-test="checkout"]');
    await expect(checkoutBtn).toBeVisible();
    await expect(checkoutBtn).toContainText('Total: $16.00');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'coffeetest/coffee_001_checkout.png' });
  });

  // Coffee_002: ตรวจสอบราคารวมเมื่อซื้อกาแฟ 3 แก้ว (Mocha, Flat White, Cappuccino)
  test('Coffee_002: Verify the total price once buy three coffee', async ({ page }) => {
    await page.locator('[data-test="Mocha"]').click();
    await page.locator('[data-test="Flat_White"]').click();
    await page.locator('[data-test="Cappuccino"]').click();

    // ปิด Promo Modal กรณีที่มีป๊อปอัพโปรโมชั่นแสดงขึ้นมา
    const promoNoBtn = page.locator('button:has-text("No, thanks"), .promo button.no');
    try {
      await promoNoBtn.waitFor({ state: 'visible', timeout: 2000 });
      await promoNoBtn.click();
    } catch {
      // ข้ามกรณีไม่มีป๊อปอัพแสดง
    }

    await page.locator('[aria-label="Cart page"]').click();
    await expect(page).toHaveURL(/.*cart/);

    const checkoutBtn = page.locator('[data-test="checkout"]');
    await expect(checkoutBtn).toBeVisible();
    await expect(checkoutBtn).toContainText('Total: $45.00');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'coffeetest/coffee_002_checkout.png' });
  });

  // Coffee_003: ตรวจสอบราคารวมเมื่อเพิ่มจำนวนกาแฟชนิดเดียวกันเป็น 2 แก้ว (Americano)
  test('Coffee_003: Verify the total price once buy the same kind of coffee 2 unit', async ({ page }) => {
    await page.locator('[data-test="Americano"]').click();
    await page.locator('[aria-label="Cart page"]').click();
    await expect(page).toHaveURL(/.*cart/);

    // แก้ไขโดยใช้ :visible เพื่อเลือกเฉพาะปุ่มที่แสดงผลอยู่บนหน้าจอ
    const plusButton = page.locator('button[aria-label="Add one Americano"]:visible');
    await expect(plusButton).toBeVisible();
    await plusButton.click();

    const checkoutBtn = page.locator('[data-test="checkout"]');
    await expect(checkoutBtn).toBeVisible();
    await expect(checkoutBtn).toContainText('Total: $14.00');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'coffeetest/coffee_003_checkout.png' });
  });

});